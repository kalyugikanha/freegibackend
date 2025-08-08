import { Request, Response } from "express";
import { Orders, Payments } from "./_validation";
import _ from "lodash";
import mongoose from "mongoose";
import { model } from "mongoose";
import { optionSchema } from "../../../models/option";
import { productSchema } from "../../../models/product";
import { dealofthedaySchema } from "../../../models/dealoftheday";
import { addressSchema } from "../../../models/address";
import { Order } from "../../admin/totalCount/_validation";
export const Option = model("option", optionSchema);
export const Product = model("product", productSchema);
export const DealOfTheDay = model("dealoftheday", dealofthedaySchema);
export const Address = model("address", addressSchema);

export const OrderCountApi = async (req: Request, res: Response) => {
  // Get the current date and time
  const now = new Date();

  // Define the start of today, this week, and this month
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );
  const startOfWeek = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - now.getDay()
  );
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  // Query for orders assigned to the delivery agent
  const todayOrdersCount = await Orders.find({
    deliveryAgent: req.body.cid,
    createdAt: { $gte: startOfToday },
  }).countDocuments();

  const weeklyOrdersCount = await Orders.find({
    deliveryAgent: req.body.cid,
    createdAt: { $gte: startOfWeek },
  }).countDocuments();

  const monthlyOrdersCount = await Orders.find({
    deliveryAgent: req.body.cid,
    createdAt: { $gte: startOfMonth },
  }).countDocuments();

  // Return the counts in a single response
  res.status(200).json({
    today: todayOrdersCount || 0,
    weekly: weeklyOrdersCount || 0,
    monthly: monthlyOrdersCount || 0,
  });
};

export const activeOrder = async (req: Request, res: Response) => {
  // const { agentId } = req.params;
  // Define active order statuses
  const activeStatuses = ["pending", "confirmed", "shipped"];

  // Query for active orders assigned to the delivery agent
  const activeOrdersCount = await Orders.countDocuments({
    deliveryAgent: req.body.cid,
    status: { $in: activeStatuses },
  });

  // Return the active order count
  res.status(200).json({ activeOrders: activeOrdersCount || 0 });
};

export const list = async (req: Request, res: Response) => {
  const orders = await Orders.find({
    $or: [
      { deliveryAgent: req.body.cid },
      { deliveryAgent: null }
    ],
    status: {
      '$not': {
        '$in': ["pending","delivered", "cancelled",'Reject']
      }
    }
  }).populate({
    path: "address", 
  })
  .populate({
    path: "products.productId",
    model: "product",
  })
  .populate({
    path: "products.optionId",
    model: "option", 

  })
  .populate({
    path: "cartOffer.productId",
    model: "product", 
    strictPopulate: false,

  }) .populate({
    path: "cartOffer.optionId",
    model: "option", 
    strictPopulate: false,

  })
  .populate({
    path: "cartOffer.freeGiftId", 
    model: "freeProduct", 
  })
  .populate("userId", {
      password: 0,
      otp: 0,
      role: 0,
      amount: 0,
      createdAt: 0,
      updatedAt: 0,
    })
    .populate({
      path: "deliveryAgent",
      select: "-password -otp -amount -createdAt -updatedAt -authCode", // Fields hide karna
      match: { role: "DeliveryAgent" } // Sirf customer role wale users laana
    })
    .populate("couponCode", { name: 1, code: 1, discount: 1 })
    .populate("address", { tag: 1, address: 1, pincode: 1, lat: 1, long: 1, addressType: 1, default: 1, floor: 1, landMark: 1 })
    .populate("tax", { name: 1, percentage: 1, description: 1 })
    .sort({ _id: -1 })
    .lean();
console.log("---orders---- " +orders.length);
const updatedOrders = await Promise.all(orders.map(async (order) => {
  let dealOfTheDayData = [];

  if (order.dealofthedays && order.dealofthedays.length > 0) {
    for (let dealItem of order.dealofthedays) {
      // Fetch the deal based on dealId
      const deal = await DealOfTheDay.findById(dealItem.dealId)
        .populate({
          path: "products.productId",
        })
        .populate({
          path: "products.optionId",
        })
        .lean();

      if (deal) {
        dealOfTheDayData.push({
          dealId: deal._id,
          flog: "dealOfDay", 
          name: deal.name,
          image: deal.image,
          price: deal.price,
          description: deal.description,
          quantity: dealItem.quantity,
          products: deal.products.map(product => ({
            
            ...product,
            optionDetails: product.optionId,
          })),
        });
      }
    }
  }

  order.dealofthedays = dealOfTheDayData; 

  return order;
}));
  res.status(200).json({ data: updatedOrders });
};

export const OrderHistory = async (req: Request, res: Response) => {
  const orders = await Orders.find({
    deliveryAgent: req.body.userId,
    status: "delivered",
  })
    .populate("userId", {
      password: 0,
      otp: 0,
      role: 0,
      amount: 0,
      createdAt: 0,
      updatedAt: 0,
    }).populate({
      path: "deliveryAgent",
      select: "-password -otp -amount -createdAt -updatedAt -authCode", // Fields hide karna
      match: { role: "DeliveryAgent" } // Sirf customer role wale users laana
    })
    .populate("couponCode", { name: 1, code: 1, discount: 1 })
    .populate("products.productId")
    .populate("address", { tag: 1, address: 1, pincode: 1, lat: 1, long: 1, addressType: 1, default: 1, floor: 1, landMark: 1  })
    .populate("tax", { name: 1, percentage: 1, description: 1 })
    .sort({ _id: -1 })
    .lean();

      

  res.status(200).json({ data: orders });
};

export const cancelOrder = async (req: Request, res: Response) => {
  const fileds: any = {
    status: "cancelled",
  };
  if (req.body.reason) {
    fileds["reason"] = req.body.reason;
  } else {
    fileds["description"] = req.body.description;
  }

  await Orders.findOneAndUpdate(
    { _id: new mongoose.Types.ObjectId(req.body._id) },
    { $set: fileds }
  );
  res.status(200).json({ message: "Order cancel successfully." });
};

export const cashPaymentOrder = async (req: Request, res: Response) => {
  const fileds: any = {
    paymentStatus: "completed",
  };

  await Orders.findOneAndUpdate(
    { _id: new mongoose.Types.ObjectId(req.body._id) },
    { $set: fileds }
  );

  const paymentfileds: any = {
    status: "completed",
    paymentDate: new Date().toISOString()
  };

  await Payments.findOneAndUpdate(
    { orderId: new mongoose.Types.ObjectId(req.body._id) },
    { $set: paymentfileds }
  );
  res.status(200).json({ message: "Cash Payment successfully." });
};

export const updateStatus = async (req: Request, res: Response) => {
  let check= await Order.findOne(
    { _id: req.body.orderId },
  )
  if(!check) return res.status(404).json({ message: "No record found." });
   await Order.updateOne(
    { _id: req.body.orderId },
    { $set: { status: req.body.status ,notes:req.body.notes,deliveryAgent:req.body.cid} }
  );
  let orderData= await Order.findOne(
    { _id: req.body.orderId },
  )


  res.status(200).json({ message: "Order status updated successfully",data:orderData });
}