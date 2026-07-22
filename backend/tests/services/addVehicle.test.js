const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const addVehicle = require('../../src/services/addVehicle');
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


describe('addVehicle service',()=>{

      // Test Case 1: creates a vehicle when all fields are valid
    
    test('should create vehicle when all fields are valid',async()=>{
        const vehicleData={
            make: 'Toyota',
            model: 'Corolla',
            category: 'Sedan',
            price: 220000,
            quantity:5,
        };
        const vehicle=await addVehicle(vehicleData);
        
    expect(vehicle).toHaveProperty('_id');
    expect(vehicle.make).toBe('Toyota');
    expect(vehicle.model).toBe('Corolla');
    expect(vehicle.category).toBe('Sedan');
    expect(vehicle.price).toBe(220000);
    expect(vehicle.quantity).toBe(5);
    });

     // Test Case 2: throws error if a required field is missing

     test('should throw error if any required field is missing',async()=>{
        const validVehicle = {
      make: 'Toyota',
      model: 'Corolla',
      category: 'Sedan',
      price: 220000,
      quantity: 5,
    };
    //missing make
    const missingMake = { ...validVehicle };
    delete missingMake.make;
    await expect(addVehicle(missingMake)).rejects.toThrow();

    //missing model
     const missingModel = { ...validVehicle };
    delete missingModel.model;
    await expect(addVehicle(missingModel)).rejects.toThrow();

    //missing category
     const missingCategory = { ...validVehicle };
    delete missingCategory.category;
    await expect(addVehicle(missingCategory)).rejects.toThrow();

    // Test missing 'price'
    const missingPrice = { ...validVehicle };
    delete missingPrice.price;
    await expect(addVehicle(missingPrice)).rejects.toThrow();

    // Test missing 'quantity'
    const missingQuantity = { ...validVehicle };
    delete missingQuantity.quantity;
    await expect(addVehicle(missingQuantity)).rejects.toThrow();

     });

});
