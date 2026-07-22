const Vehicle = require('../models/Vehicle');

const searchVehicles=async(query)=>{
    const { make, model, category, minPrice, maxPrice } = query;
    const mongoQuery={};

    //build text feild using case-sensitive regex
    if(make)
    {
        mongoQuery.make={$regex:make,$options:'i'};
    }
    if (model) {
    mongoQuery.model = { $regex: model, $options: 'i' };
    }
     if (category) {
    mongoQuery.category = { $regex: category, $options: 'i' };
    }

    // build numeric price range
    if(minPrice!==undefined || maxPrice!==undefined)
    {
        mongoQuery.price={};
        if (minPrice !== undefined && minPrice !== '') {
      mongoQuery.price.$gte = Number(minPrice);
     }
    if (maxPrice !== undefined && maxPrice !== '') {
      mongoQuery.price.$lte = Number(maxPrice);
    }
    }
    return Vehicle.find(mongoQuery);
};
module.exports=searchVehicles;