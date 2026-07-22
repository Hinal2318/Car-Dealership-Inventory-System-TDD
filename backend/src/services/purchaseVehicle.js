const mongoose = require('mongoose');
const Vehicle = require('../models/Vehicle');
const purchaseVehicle=async(id)=>{
    if(!id || !mongoose.Types.ObjectId.isValid(id))
    {
         throw new Error('Vehicle not found');
    }
    const vehicle=await Vehicle.findById(id);
    if(!vehicle)
    {
        throw new Error('Vehicle not found');
    }
    if(vehicle.quantity<=0)
    {
        throw new Error('insufficient stock');
    }
    vehicle.quantity-=1;
    await vehicle.save();
    return vehicle;
};
module.exports=purchaseVehicle;