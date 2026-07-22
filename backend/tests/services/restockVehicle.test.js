const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const restockVehicle = require('../../src/services/restockVehicle');
const Vehicle = require('../../src/models/Vehicle');
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
  await Vehicle.deleteMany({});
});
describe('restockVehicle Service', () => {
  // Test Case 1: increases quantity by the given amount
  test('should increase the quantity of a vehicle by the given amount', async () => {
    const vehicle=await Vehicle.create({
      make: 'Toyota',
      model: 'Corolla',
      category: 'Sedan',
      price: 22000,
      quantity: 5,
    });

    const updatedVehicle=await restockVehicle(vehicle._id,10);
    expect(updatedVehicle.quantity).toBe(15);
    const dbVehicle=await Vehicle.findById(vehicle._id);
    expect(dbVehicle.quantity).toBe(15);
  });

   // Test Case 2: throws if the amount is negative, zero, or not a whole number
  test('should throw an error if the amount is negative, zero, or not a whole number', async () =>{
      const vehicle = await Vehicle.create({
      make: 'Toyota',
      model: 'Corolla',
      category: 'Sedan',
      price: 22000,
      quantity: 5,
    });
    await expect(restockVehicle(vehicle._id,-5)).rejects.toThrow('Invalid restock amount');
    await expect(restockVehicle(vehicle._id, 0)).rejects.toThrow('Invalid restock amount');
    await expect(restockVehicle(vehicle._id, 2.5)).rejects.toThrow('Invalid restock amount');
  });

  //Test Case 3: throws "Vehicle not found" for invalid ID
  test('should throw "Vehicle not found" if ID does not exist', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    await expect(restockVehicle(fakeId, 5)).rejects.toThrow('Vehicle not found');
  });
});