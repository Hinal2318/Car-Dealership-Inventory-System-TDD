const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const purchaseVehicle = require('../../src/services/purchaseVehicle');
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

describe('purchaseVehicle Service', () => {
  // Test Case 1: decreases quantity by 1
  test('should decrease the quantity of a vehicle by 1', async () => {
    const vehicle = await Vehicle.create({
      make: 'Toyota',
      model: 'Corolla',
      category: 'Sedan',
      price: 22000,
      quantity: 5,
    });
    const updatedVehicle=await purchaseVehicle(vehicle._id);
    expect(updatedVehicle.quantity).toBe(4);

    const dbVehicle=await Vehicle.findById(vehicle._id);
    expect(dbVehicle.quantity).toBe(4);
  });

  //Test Case 2:Throw insufficient stock if quantity is alredy 0
  test('should throw "insufficient stock" if quantity is already 0', async () => {
    const vehicle = await Vehicle.create({
      make: 'Toyota',
      model: 'Corolla',
      category: 'Sedan',
      price: 22000,
      quantity: 0,
    });

    await expect(purchaseVehicle(vehicle._id)).rejects.toThrow('insufficient stock');
});

//Test case 3:Vehicle not found for invalid ID
test('should throw "Vehicle not found" if ID does not exist', async () =>{
    const fakeID=new mongoose.Types.ObjectId();
    await expect(purchaseVehicle(fakeID)).rejects.toThrow('Vehicle not found');
});

});