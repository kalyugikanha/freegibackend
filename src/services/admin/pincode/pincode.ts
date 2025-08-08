import { Request, Response } from "express";
import { PinCode } from "./_validation";
import _ from "lodash";

export const list = async (req: Request, res: Response) => {
    const data = await PinCode.find({
        storeId: req.body.storeId
    });
    
    res.status(200).json({ data: data });
 
};
export const add = async (req: Request, res: Response) => {
 
    
    let pincode: any = await PinCode.findOne({
        pincode: req.body.pincode,
        storeId: req.body.storeId
    });
    if (pincode){
        return res.status(400).json({ message: "Pincode already exists." });
    }
 
    let data: any = new PinCode({
        pincode: req.body.pincode,
        storeId: req.body.storeId,
    });
    await data.save();

    res.status(200).json({ message: "Pincode added successfully." });


}

export const update = async (req: Request, res: Response) => {
    let checkout: any = await PinCode.findOne({
        _id: req.params.id,
        storeId: req.body.storeId
    });
    if (!checkout){
        return res.status(404).json({ message: "No record found." });
    }
    let data: any =await PinCode.findOne({
        pincode: req.body.pincode,
        storeId: req.body.storeId
    })
    if (data && data._id!=req.params.id){
        return res.status(400).json({ message: "Pincode already exists." });
    }
    await PinCode.findByIdAndUpdate(req.params.id, {
        $set: req.body
    }, { new: true });
    res.status(200).json({ message: "Pincode updated successfully." });

}

export const deletePinCode = async (req: Request, res: Response) => {
    let id=req.params.id
    let checkout: any = await PinCode.findOne({
        _id: id,
        storeId: req.body.storeId
    });
    if (!checkout){
        return res.status(404).json({ message: "No record found." });
    }

    await PinCode.deleteOne({ _id: id , storeId: req.body.storeId});
   
    res.status(200).json({ message: "Pincode deleted successfully." });

}
