const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const searchVehicles = require('../../src/services/searchVehicles');
const Vehicle = require('../../src/models/Vehicle');

let mongoServer;

beforeAll(async()=>{
    mongoServer=await MongoMemoryServer.create();
    const uri=mongoServer.getUri();
    await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async()=>{
    await Vehicle.create([
    { make: 'Toyota', model: 'Corolla', category: 'Sedan', price: 20000, quantity: 5 },
    { make: 'Honda', model: 'Civic', category: 'Sedan', price: 25000, quantity: 3 },
    { make: 'Ford', model: 'F-150', category: 'Truck', price: 35000, quantity: 2 },
    ]);
});

afterEach(async () => {
  await Vehicle.deleteMany({});
});

describe('searchVehicles service',()=>{

    //Test :each filter Alone

    test('should filter by make alone (case-insensitive regex)', async () =>{
        const results=await searchVehicles({make:'toy'});
        expect(results).toHaveLength(1);
        expect(results[0].make).toBe('Toyota');
    });

    test('should filter by category alone', async () => {
    const results = await searchVehicles({ category: 'Sedan' });
    expect(results).toHaveLength(2);});

    test('should filter by maximum price alone ($lte)', async () => {
    const results = await searchVehicles({ maxPrice: 22000 });
    expect(results).toHaveLength(1)}); 

        //test case: combined filters
   
    test('should filter by combined criteria (category + price range)', async () => {
      const results = await searchVehicles({
      category: 'sedan',
      minPrice: 18000,
      maxPrice: 22000,
    });
    expect(results).toHaveLength(1);
    expect(results[0].model).toBe('Corolla');

    });

    //Test case: Search with no matches
    test('should return empty array if no vehicles match criteria', async () => {
        const results=await searchVehicles({make:'Tesla'});
        expect(results).toHaveLength(0);
    });

});


