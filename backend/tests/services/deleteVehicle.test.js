const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const deleteVehicle = require('../../src/services/deleteVehicle');
const Vehicle = require('../../src/models/Vehicle');
let mongoServer;

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
    await Vehicle.deleteMany({});
});

describe('deleteVehicle service',()=>{
    test('should delete a vehicle for a valid vehicle ID', async () => {
    // Create a test vehicle
    const vehicle = await Vehicle.create({
      make: 'Toyota',
      model: 'Corolla',
      category: 'Sedan',
      price: 22000,
      quantity: 5,
    });

    //call service to delete it

    const deletedVehicle=await deleteVehicle(vehicle._id);

    //verify returned deleted document
    expect(deletedVehicle).toBeDefined();
    
    //verify it no longer exists in database
    const dbVehicle = await Vehicle.findById(vehicle._id);
    expect(dbVehicle).toBeNull();
     });

     //Test Case 2:Throw vehicle not found for invalid ID
     test('should throw error for an invalid ID',async()=>{
        const fakeID=new mongoose.Types.ObjectId();
        await expect(deleteVehicle(fakeID)).rejects.toThrow('Vehicle not found');
     });

     //Test Case 3:Throw error if ID is missing
     test('should throw error if ID is missing or undefined',async()=>{
        await
        expect(deleteVehicle(undefined)).rejects.toThrow('Vehicle not found');
     })
}
)

