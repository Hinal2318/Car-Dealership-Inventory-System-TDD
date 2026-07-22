const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const loginUser = require('../../src/services/loginUser.js');
const User = require('../../src/models/User.js');

let mongoServer;
const JWT_SECRET=process.env.JWT_SECRET || 'test_secret';

beforeAll(async()=>{
    mongoServer=await MongoMemoryServer.create();
    const uri=mongoServer.getUri();
    await mongoose.connect(uri);
});

afterAll(async()=>{
    await mongoose.disconnect();
    await mongoServer.stop();
});

afterEach(async()=>{
    await User.deleteMany({});
});

describe('loginUser Service',()=>{

    //Test 1: returns JWT on correct email and password

    test('should return a JWT token on correct email and password',async()=>{
        //register a test user in DB
        const hashedPassword=await bcrypt.hash('password123',10);
        const user=await User.create({
            email:'logintest@gmail.com',
            password:hashedPassword,
            role:'user',
        });
        //call service
        const token=await loginUser({
            email:'logintest@gmail.com',
            password:'password123',
        });

        expect(token).toBeDefined();

        //verify token with correct payload(userId and role)

        const decoded=jwt.verify(token,JWT_SECRET);
        expect(decoded.userId).toBe(user._id.toString());
        expect(decoded.role).toBe('user');
    });

    //Test Case 2: Throw error on wrong password

    test('should throw error on incorrect password',async()=>{
        const hashedPassword=await bcrypt.hash('password123',10);
        await User.create({
            email:'logintest@gmail.com',
            password:hashedPassword,
        });

        await expect(
            loginUser({email:'logintest@gmail.com',
                password:'wrongpassword'
            })
        ).rejects.toThrow('Invalid email or password');
    });

    //Test Case 3 : throw error on unknown email

    test('should throw error on unknown email ',async()=>{
        await expect(
            loginUser({email:'unknown@gmail.com',
                password:'password123'
            })
        ).rejects.toThrow('Invalid email or password');
    });
});
