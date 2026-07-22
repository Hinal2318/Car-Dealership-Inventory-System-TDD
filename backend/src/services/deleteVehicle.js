const mongoose = require('mongoose');
const Vehicle = require('../models/Vehicle');

const deleteVehicle=async(id)=>{
    
    // Check if ID is missing or invalid
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('Vehicle not found');
  }

  //perform deletion
  const deletedVehicle=await Vehicle.findByIdAndDelete(id);

  //throw error if vehicle don't exists
   if (!deletedVehicle) {
    throw new Error('Vehicle not found');
  }
  return deletedVehicle;
}

module.exports=deleteVehicle;