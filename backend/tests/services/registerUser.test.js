const mongoose=require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const registerUser = require('../../src/services/registerUser.js');
const User = require('../../src/models/User.js');

let mongoServer;

//start in memory mongoDB server before running test

beforeAll(async()=>{
    mongoServer=await MongoMemoryServer.create();
    const uri=mongoServer.getUri();
    await mongoose.connect(uri);
});

//clean DB and stop server after all test run

afterAll(async()=>{
    await mongoose.disconnect();
    await mongoServer.stop();
});

//clear collection before each test

afterEach(async()=>{
    await User.deleteMany({});
});

//Test case :1 Creates a user with hashed password

describe('registerUser service',()=>{
    test('It should create a user with hashed password',async()=>{
        const userData={
            email:'test@gmail.com',
            password:'password123'
            
        };
        const user=await registerUser(userData);
        expect(user).toHaveProperty('_id');
        expect(user.email).toBe('test@gmail.com');
        expect(user.password).not.toBe('password123');
        expect(user.password.length).toBeGreaterThan(20);
    });

    //Test case 2 : reject duplicate email

    test('It should reject duplicate email',async()=>{
        const userData={
            email:'duplicate@gmail.com',
            password:'password123'
        };
        await registerUser(userData);
        await expect(registerUser(userData)).rejects.toThrow('user already exists');
    });

    //Test case 3:Throw error if field are missing
    test('should throw if email or password field re missing',async()=>{

        //missing password

        await expect(registerUser(
            {email:'no-pass@gmail.com'}
        )).rejects.toThrow(
            'Email and password are required'
        );

        //missing email
        await expect(registerUser({password:'no-email'})).rejects.toThrow('Email and password are required');

    })
})
