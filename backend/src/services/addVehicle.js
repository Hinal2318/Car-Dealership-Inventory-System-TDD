const Vehicle = require('../models/Vehicle');

const addVehicle=async(vehicleData)=>{
     const { make, model, category, price, quantity } = vehicleData;

     //throw error if any required feild is missing
     if (make === undefined || model === undefined ||category === undefined || price=== undefined ||quantity === undefined ) 
        {
    throw new Error('All fields (make, model, category, price, quantity) are required');
  }

  //Validate price and quantity are not negative
  if(price<0 || quantity<0)
  {
     throw new Error('Price and quantity must be non-negative numbers');
  }

  //create vehicle 
    const newVehicle = await Vehicle.create({
    make: make.trim(),
    model: model.trim(),
    category: category.trim(),
    price,
    quantity,
  });
  return newVehicle;
};

module.exports = addVehicle;
