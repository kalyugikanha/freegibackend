import { Request, Response } from "express";
import { Category, Product, Order, Payment, Users } from "./_validation";
import _ from "lodash";

export const list = async (req: Request, res: Response) => {
  const productCount = await Product.countDocuments({
    
  });
  const orderCount = await Order.countDocuments();
  const paymentCount = await Payment.aggregate([
    {
      $group: {
        _id: null, // No grouping key, calculate the total for all documents
        totalAmount: { $sum: "$amount" },
      },
    },
  ]);
  const customerCount = await Users.find({ role: "Customer" }).countDocuments();
  const deliveryAgentCount = await Users.find({
    role: "DeliveryAgent",
  }).countDocuments();
  const categoryCount = await Category.countDocuments();

  res.status(200).json({
    product: productCount || 0,
    order: orderCount || 0,
    payment: paymentCount || 0,
    customer: customerCount || 0,
    driver: deliveryAgentCount || 0,
    category: categoryCount || 0,
  });
};
