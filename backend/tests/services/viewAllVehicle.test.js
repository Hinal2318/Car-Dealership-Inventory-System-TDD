const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const viewAllVehicles = require('../../src/services/viewAllVehicles');
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

describe('viewAllVehicle service',()=>{
    test('should return all vehicles in the database',async()=>{
        await Vehicle.create([
            { make: 'Toyota', model: 'Corolla', category: 'Sedan', price: 22000, quantity: 5},
             { make: 'Honda', model: 'Civic', category: 'Sedan', price: 23000, quantity: 3 }
        ]);
        const vehicles=await viewAllVehicles();

        expect(vehicles).toHaveLength(2);
        // Check if both makes are present in any order
        const makes = vehicles.map(v => v.make);
        expect(makes).toContain('Toyota');
        expect(makes).toContain('Honda');
    });
})