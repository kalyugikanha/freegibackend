import { Schema } from 'mongoose';



export const pincodeSchema = new Schema({
    pincode:{
        type: String,
        required: true
    },
  storeId:{ type: Schema.Types.ObjectId},
},{
    collection:"pincode"
});

