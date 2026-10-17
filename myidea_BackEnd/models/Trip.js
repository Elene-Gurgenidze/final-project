const { Schema, model } = require("mongoose");

const tripSchema = new Schema(
    {
        title: { 
            type: String, 
            required: true, 
            trim: true 
        },
        description: { 
            type: String, 
            trim: true 
        },
        startDate: { 
            type: Date, 
            required: true 
        },
        endDate: { 
            type: Date, 
            required: true 
        },
        user: { 
            type: Schema.Types.ObjectId, 
            ref: "User", 
            required: true 
        },
        destinations: [
            { 
                type: Schema.Types.ObjectId, 
                ref: "Destination" 
            }
        ]
    },
    { 
        timestamps: true 
    }
);

const Trip = model("Trip", tripSchema);

module.exports = Trip;