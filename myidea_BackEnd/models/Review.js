const { Schema, model } = require("mongoose");

const reviewSchema = new Schema(
    {
        user: { 
            type: Schema.Types.ObjectId, 
            ref: "User", 
            required: true 
        },
        destination: { 
            type: Schema.Types.ObjectId, 
            ref: "Destination", 
            required: true 
        },
        rating: { 
            type: Number, 
            required: true, 
            min: 1, 
            max: 5 
        },
        comment: { 
            type: String, 
            required: true, 
            trim: true 
        }
    },
    { 
        timestamps: true 
    }
);

const Review = model("Review", reviewSchema);

module.exports = Review;