import {Schema, model} from "mongoose";
import { IAddress } from "types";


const addressSchema = new Schema<IAddress> (
  {
    name: {
      type: String, 
      required: [true, "Name is required"],
      minlength: [6, "Place name should be at-least 6 characters long"],
      maxlength:[25, "Place name cannot be more than 25 characters"],
      trim: true
    },
    // TODO: phone number lenght constraint
    phoneNumber : {
      type: String,
      required : [true, "Phone number is required"],
      unique: true,
      minlength: [8, "Phone number cannot be less than 10 digits"],
      maxlength: [10, "Phone number cannot be more than 15 digits"]
    },
    houseNumber:{
      type: String,
      required: [true, "House number is required"]
    },
    city: {
      type: String,
      required: [true, "City is required"],
      trim: true
    },
    pinCode: {
      type: String,
      trim: true
    },
    landMark: {
      type: String,
      trim: true,
      minlength: 5,   
      maxlength: 50, 
    }, 
    isPrimary: {
      type: Boolean
    }

}, {timestamps: true})

const Address = model("Address", addressSchema)

export default Address
