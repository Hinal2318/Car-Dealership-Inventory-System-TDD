const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const updateVehicle = require('../../src/services/updateVehicle');
const Vehicle = require('../../src/models/Vehicle');
let mongoserver;

beforeAll(async()=>{
    mongoServer= await MongoMemoryServer.create();
    const uri=mongoServer.getUri();
    await mongoose.connect(uri);
});

afterAll(async()=>{
   await mongoose.disconnect();
   await mongoServer.stop();
});

afterEach(async()=>{
    await Vehicle.deleteMany({});
})

describe('updateVehicle Service',()=>{
    //test case 1: update fields for a valid ID
    test('should update feilds for valid vehicle ID',async()=>{
        const vehicle=await Vehicle.create({
      make: 'Toyota',
      model: 'Corolla',
      category: 'Sedan',
      price: 22000,
      quantity: 5,
    });

    const updateData={
        price:24000,
        quantity:10
    };

    const updatedVehicle=await updateVehicle(vehicle._id,updateData);

    expect(updatedVehicle).toBeDefined();
    expect(updatedVehicle.price).toBe(24000);
    expect(updatedVehicle.quantity).toBe(10);

    //verify
    const dbVehicle=await Vehicle.findById(vehicle._id);
         expect(dbVehicle.price).toBe(24000);
         expect(dbVehicle.quantity).toBe(10)

});

    //Test case 2 :Throw error for invalid/missing ID
    test('should throw "Vehicle not found" for an invalid ID', async () => {
        const fakeID=new mongoose.Types.ObjectId();
        const updateData={price:25000};
        await expect(updateVehicle(fakeID,updateData)).rejects.toThrow("Vehicle not found");
    });

    test('should throw "Vehicle not found" if ID is missing', async () => {
        const updateData = { price: 25000 };
         await expect(updateVehicle(undefined, updateData)).rejects.toThrow('Vehicle not found');
  });
});


    
