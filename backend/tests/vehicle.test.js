const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/app');
const Vehicle = require('../src/models/Vehicle');
const User = require('../src/models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

let mongoServer;
let userToken;
let adminToken;
const JWT_SECRET = process.env.JWT_SECRET || 'test_secret';

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  // Seed two users directly to bypass HTTP setup for authentication testing
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const regularUser = await User.create({
    email: 'user@example.com',
    password: hashedPassword,
    role: 'user',
  });
  
  const adminUser = await User.create({
    email: 'admin@example.com',
    password: hashedPassword,
    role: 'admin',
  });

  // Generate tokens
  userToken = jwt.sign({ userId: regularUser._id, role: regularUser.role }, JWT_SECRET, { expiresIn: '1d' });
  adminToken = jwt.sign({ userId: adminUser._id, role: adminUser.role }, JWT_SECRET, { expiresIn: '1d' });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Vehicle.deleteMany({});
});

describe('Vehicle Endpoints Integration Tests', () => {
  // 1. Authentication Check (no token -> 401)
  it('should return 401 Unauthorized if no token is provided', async () => {
    const res = await request(app).get('/api/vehicles');
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('error', 'Unauthorized: Missing token');
  });

  // 2. Add Vehicle
  it('should add a vehicle when request is authenticated', async () => {
    const vehicleData = {
      make: 'Toyota',
      model: 'RAV4',
      category: 'SUV',
      price: 28000,
      quantity: 5,
    };

    const res = await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${userToken}`)
      .send(vehicleData);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.model).toBe('RAV4');
  });

  // 3. Get All Vehicles
  it('should return all vehicles', async () => {
    await Vehicle.create({ make: 'Honda', model: 'Accord', category: 'Sedan', price: 25000, quantity: 2 });

    const res = await request(app)
      .get('/api/vehicles')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
  });

  // 4. Search Vehicles
  it('should search and filter vehicles', async () => {
    await Vehicle.create([
      { make: 'Ford', model: 'Mustang', category: 'Coupe', price: 35000, quantity: 1 },
      { make: 'Tesla', model: 'Model 3', category: 'Sedan', price: 40000, quantity: 2 }
    ]);

    const res = await request(app)
      .get('/api/vehicles/search?make=ford')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].model).toBe('Mustang');
  });

  // 5. Update Vehicle
  it('should update an existing vehicle details', async () => {
    const vehicle = await Vehicle.create({ make: 'Honda', model: 'Accord', category: 'Sedan', price: 25000, quantity: 2 });

    const res = await request(app)
      .put(`/api/vehicles/${vehicle._id}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ price: 27000 });

    expect(res.status).toBe(200);
    expect(res.body.price).toBe(27000);
  });

  // 6. Purchase Vehicle
  it('should allow purchasing a vehicle', async () => {
    const vehicle = await Vehicle.create({ make: 'Honda', model: 'Accord', category: 'Sedan', price: 25000, quantity: 2 });

    const res = await request(app)
      .post(`/api/vehicles/${vehicle._id}/purchase`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.vehicle.quantity).toBe(1);
  });

  // 7. Restock Vehicle (Admin only vs Normal user checks)
  it('should block non-admin from restocking (returns 403)', async () => {
    const vehicle = await Vehicle.create({ make: 'Honda', model: 'Accord', category: 'Sedan', price: 25000, quantity: 2 });

    const res = await request(app)
      .post(`/api/vehicles/${vehicle._id}/restock`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ quantity: 5 });

    expect(res.status).toBe(403);
  });

  it('should allow admin to restock a vehicle (returns 200)', async () => {
    const vehicle = await Vehicle.create({ make: 'Honda', model: 'Accord', category: 'Sedan', price: 25000, quantity: 2 });

    const res = await request(app)
      .post(`/api/vehicles/${vehicle._id}/restock`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ quantity: 5 });

    expect(res.status).toBe(200);
    expect(res.body.vehicle.quantity).toBe(7);
  });

  // 8. Delete Vehicle (Admin only vs Normal user checks)
  it('should block non-admin from deleting (returns 403)', async () => {
    const vehicle = await Vehicle.create({ make: 'Honda', model: 'Accord', category: 'Sedan', price: 25000, quantity: 2 });

    const res = await request(app)
      .delete(`/api/vehicles/${vehicle._id}`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(403);
  });

  it('should allow admin to delete a vehicle (returns 200)', async () => {
    const vehicle = await Vehicle.create({ make: 'Honda', model: 'Accord', category: 'Sedan', price: 25000, quantity: 2 });

    const res = await request(app)
      .delete(`/api/vehicles/${vehicle._id}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'Vehicle deleted successfully');

    const dbVehicle = await Vehicle.findById(vehicle._id);
    expect(dbVehicle).toBeNull();
  });
});
