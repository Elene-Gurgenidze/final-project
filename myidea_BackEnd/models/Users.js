const {Schema, model } = require("mongoose");

const userSchema = new Schema(
    {
       name:{type: String, required:true, trim:true},
       email:{type: String, required:true, unique:true, lowercase:true, trim:true },
       role:{type:String, enum:["customer", "admin"],required: true, default: "customer"},
       password:{type:String, required:true},
       isBlocked:{ type:Boolean, default:false},
    }
)
const User = model("User", userSchema);

module.exports = User;