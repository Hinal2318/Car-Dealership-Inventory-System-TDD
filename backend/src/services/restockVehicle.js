const mongoose = require('mongoose');
const Vehicle = require('../models/Vehicle');

const restockVehicle = async (id, amount) => {
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('Vehicle not found');
  }

  if(typeof amount!== 'number' || amount<=0 || !Number.isInteger(amount))
  { throw new Error('Invalid restock amount');}

  const vehicle = await Vehicle.findById(id);
  if (!vehicle) {
    throw new Error('Vehicle not found');
  }

  vehicle.quantity+=amount;
  await vehicle.save();
  return vehicle;

};

module.exports=restockVehicle;