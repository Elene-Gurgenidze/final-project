const { Schema, model } = require("mongoose");

const dayPlanSchema = new Schema(
    {
        trip: { 
            type: Schema.Types.ObjectId, 
            ref: "Trip", 
            required: true 
        },
        dayNumber: { 
            type: Number, 
            required: true 
        },
        title: { 
            type: String, 
            required: true, 
            trim: true 
        },
        activities: { 
            type: String, 
            trim: true 
        }, 
        destination: { 
            type: Schema.Types.ObjectId, 
            ref: "Destination" 
        }
    },
    { 
        timestamps: true 
    }
);

const DayPlan = model("DayPlan", dayPlanSchema);

module.exports = DayPlan;