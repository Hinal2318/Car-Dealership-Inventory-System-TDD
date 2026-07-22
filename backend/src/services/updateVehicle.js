const mongoose = require('mongoose');
const Vehicle = require('../models/Vehicle');

const updateVehicle=async(id,updateData)=>{
    if(!id ||  !mongoose.Types.ObjectId.isValid(id)){
        throw new Error('Vehicle not found');
    }

    const updatedVehicle=await Vehicle.findByIdAndUpdate(id,updateData,{
        new:true,
        runValidators:true,
    });

    if (!updatedVehicle) {
    throw new Error('Vehicle not found'); }
    
    return updatedVehicle;
};

module.exports=updateVehicle;