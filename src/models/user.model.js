const mongoose = require("mongoose");
const bcrypt = require("bcryptjs")

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required for creating an account"],
      trim: true,
      lowercase: true,
      match: [
        /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
        "Invalid Email address",
      ],
      unique: [true, "Email Already Exist."],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    name: {
      type: String,
      required: [true, "Name is required for creating an account"],
      minlength: [6, "password should conatin more than 6 character"],
    },
    systemUser:{
      type:Boolean,
      default:false,
      immutable:true,
      select:false
    }
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function (next)  {
  if (!this.isModified("password")) {
    return 
  }

  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;
  return
})


userSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password, this.password)
} 

const userModel = mongoose.model("user",userSchema)

module.exports = userModel;