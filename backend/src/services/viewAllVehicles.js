const Vehicle = require('../models/Vehicle');

const viewAllVehicles=async()=>{
    return Vehicle.find({});
};

module.exports=viewAllVehicles;