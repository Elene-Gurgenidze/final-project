const {schema, model} = require("mongoose");

const destinationSchema = new schema(
    {
        name: {type:String, required:true, trim:true},
        country: {type:String, required:true, trim:true},
        city: {type:String, required:true, trim:true},
        description: {type:String, trim:true},
        category: {type:String, enum: ["nature", "culture", "food", "hotel", "other"], default:"other" },
        image: {type:String, trim:true},
        rating:{type:Number, min:0, max:5, default: 0},
       
    },
     {timestamps:true}
);
const Destination = model("Destination", destinationSchema);
module.exports = Destination;