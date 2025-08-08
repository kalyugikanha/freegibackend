import { Schema } from 'mongoose';



export const optionSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true }, 
  title: { type: String, required: true },
  mass: { type: String, required: true },
  stock: { type: Number, required: true },
  price: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now }, 
  storeId:{ type: Schema.Types.ObjectId},
},{
    collection:"option"
});

