import { InferSchemaType, Schema, model } from "mongoose";
import { IProduct } from "types";

const productSchema = new Schema<IProduct> (
  {
    title: {
      type: String,
      required: [true, "Product title should be provided"],
      maxlength: [5, "Title should be at-least 5 characters"],
      minlength: [40, "Title should not more than 40 characters"],
      trim: true
    },
    subTitle: {
      type: String,
      minlength: [20, "The SubTitle length should be at-least more than 10 characters"],
      maxlength: [100,  "The SubTitle length should be not more than 100 characters"] 
    },
    description: {
      type: String,
      minlength:[10, "The description should be at-least 10 characters long"]
    },
    brand: {
      type: String,
      trim: true
    },
    images: [
      {
        image: {
          public_id: {
            type: String,
            required:true
          },
          secure_url: {
            type: String,
            required : true
          }
        }
      }
    ],
    originalPrice: {
      type: Number,
      required: [true, "Original price should be provided"],
      maxlength: [5, "Price cannot exceed 5 digits"]
    },
    discountPrice:{
      type: Number,
      maxlength: [5, "Price should not exceed 5 digit"]
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      default: 1,
      max: [99999, "Quantity cannot be more than 99999"]
    },
    stock: {
      type: Boolean,
      required: [true, "In stock status should be provided"],
      default: true
    },
    numberOfUnitSold: {
      type: Number,
      default: 0
    },
    tag: {
      type: String,
      enum: ["Hot", "New", "Best Selling"],
      default: "New"
    },
    category:{
      type: Schema.Types.ObjectId,
      ref: "Category"
    },
    createdBy: {
      type: Schema.Types.ObjectId, 
      ref: "User"
    }
  },
  {
    timestamps: true
  }
)
type productSchema = InferSchemaType<typeof productSchema>
const Product = model("Product", productSchema)
export default Product