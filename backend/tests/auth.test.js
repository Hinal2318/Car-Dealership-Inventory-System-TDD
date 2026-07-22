const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/app');
const User = require('../src/models/User');
let mongoServer;
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});
afterEach(async () => {
  await User.deleteMany({});
});

describe('Auth Endpoints Integration Tests', () => {
  // Added "async" here
  test('should complete full flow: register -> login -> hit protected route', async () => {
    const credentials = {
      email: 'testflow@example.com',
      password: 'password123',
    };

    // 1. Register a new user
    const registerRes = await request(app)
      .post('/api/auth/register')
      .send(credentials);
      
    expect(registerRes.status).toBe(201);
    expect(registerRes.body).toHaveProperty('message', 'User registered sucessfully');
    expect(registerRes.body.user.email).toBe(credentials.email);

    // 2. Login to get JWT token
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send(credentials);

    expect(loginRes.status).toBe(200);
    expect(loginRes.body).toHaveProperty('token');
    const token = loginRes.body.token;

    // 3. Use token to hit a protected route successfully
    const protectedRes = await request(app)
      .get('/api/vehicles')
      .set('Authorization', `Bearer ${token}`);
      
    expect(protectedRes.status).toBe(200);
    expect(Array.isArray(protectedRes.body)).toBe(true);
  }); 
}); 

