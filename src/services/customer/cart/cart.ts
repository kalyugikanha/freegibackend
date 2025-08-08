import { Request, Response } from "express";
import { Cart,Orders, validateAdd } from "./_validation";
import mongoose,{ model } from "mongoose";
import { optionSchema } from "../../../models/option";
import { errorHandler } from "../../../helper/erroHandle";
import { cartOffer } from "../../../models/cartOffer";
import { freeProductSchema } from "../../../models/freeProduct";
import { productSchema } from "../../../models/product";
import { couponCodeSchema } from "../../../models/couponCode";
import { dealofthedaySchema } from "../../../models/dealoftheday";
export const Option = model("option", optionSchema);
export const CartOffer = model("cartOffer", cartOffer);
export const FreeProduct = model("freeProduct", freeProductSchema);
export const Product = model("product", productSchema);
export const CouponCode = model("CouponCode", couponCodeSchema);
export const DealOfTheDay = model("dealoftheday", dealofthedaySchema);

export const add = async (req: Request, res: Response) => {
  const { error } = validateAdd(req.body);
  if (error) throw error;

  let { products, dealOfTheDay } = req.body;
  let cart = await Cart.findOne({ userId: req.body.cid,storeId: req.body.storeId });

  if (!cart) {
    cart = new Cart({
      userId: req.body.cid,
      products: [],   
      dealofthedayId: [], 
      amount: 0,      
    });
  }

  const initialAmount = cart.amount;

  if (products && products.length > 0) {
    for (let product of products) {
      const i = cart.products.findIndex(
        (p: any) =>
          p.productId.toString() === product.productId.toString() &&
          p.optionId.toString() === product.optionId.toString()
      );

      if (i !== -1) {
        cart.products[i].quantity += product.quantity;
      } else {
        cart.products.push({ ...product, flog: "product" }); 
      }

      cart.amount += product.quantity *product.price
    }
  }

  if (dealOfTheDay && dealOfTheDay.length > 0) {
    for (let data of dealOfTheDay) {
      const deal: any = await DealOfTheDay.findOne({_id:data?.dealId,storeId: req.body.storeId});
      if (!deal) {
        return res.status(400).json({ error: `Deal with ID ${data?.dealId} not found.` });
      }
      

      const existingDeal = cart.dealofthedayId.find(
        (d: any) => d.dealId.toString() === data?.dealId.toString()
      );

      if (existingDeal) {
        existingDeal.quantity += Number(data?.quantity) || 0;
      } else {
        cart.dealofthedayId.push({ dealId: data?.dealId, flog: "dealOfDay", quantity: Number(data?.quantity) || 1 });
      }

      cart.amount += (Number(data?.quantity) || 0) * (Number(deal.price) || 0);
    }
    }
    cart.storeId = req.body.storeId;

  cart = await cart.save();

  res.status(200).json({
    message: "Product added to cart",
    previousAmount: initialAmount,
    newAmount: cart.amount,
    cart,
  });
};

export const view = errorHandler(async (req: Request, res: Response) => {

  
  const cart = await Cart.find({ userId: req.body.cid,storeId: req.body.storeId })
 .populate({
   path: "products.productId",
   model: "product",
 })
 .populate({
   path: "products.optionId",
   model: "option", 
 })
 .lean();

const updatedOrders = await Promise.all(cart.map(async (cartItem:any) => {
 let dealOfTheDayData = [];
  cartItem.totalAmount = cartItem.amount;
 
 if (cartItem.dealofthedayId && cartItem.dealofthedayId.length > 0) {
   for (let dealItem of cartItem.dealofthedayId) {
     const deal = await DealOfTheDay.findOne({_id:dealItem.dealId,storeId: req.body.storeId})
       .populate({
         path: "products.productId",
       })
       .populate({
         path: "products.optionId",
       })
       .lean();

     // If deal exists, add it to the dealOfTheDayData array
     if (deal) {
       dealOfTheDayData.push({
         dealId: deal._id,
         flog: "dealOfDay", // Ensure flog is included
         name: deal.name,
         image: deal.image,
         price: deal.price,
         description: deal.description,
         quantity: dealItem.quantity,
         products: deal.products.map(product => ({
           ...product,
         })),
       });
     }
   }
 }

 cartItem.dealofthedays = dealOfTheDayData;


 // Fetch current cart offer based on totalAmount
 let cartOffer = await CartOffer.findOne({
   minPrice: { $lte: cartItem.totalAmount },
   maxPrice: { $gte: cartItem.totalAmount },
   storeId: req.body.storeId
 })
   .populate("freeGiftId") 
   .populate({
     path: "products.productId",
     model: "product"
   })
   .populate({
    path: "products.optionId",
    model: "option"
  })
   .sort({ minPrice: 1 })
   .lean();

 let nextCartOffer = null;
 if (cartOffer) {
   nextCartOffer = await CartOffer.findOne({
     minPrice: { $gt: cartOffer.maxPrice },
   })
     .populate("freeGiftId")
     .populate({
      path: "products.productId",
      model: "product"
    })
    .populate({
     path: "products.optionId",
     model: "option"
   })
     .sort({ minPrice: 1 })
     .lean();
 }

 // Populate product and options in the cart offer
 if (cartOffer && cartOffer.products.length > 0) {
  //  const productIds = cartOffer.products.map((p: any) => p.productId);
  // //  const options = await Option.find({ productId: { $in: productIds } }).lean(); 

   cartOffer.products = cartOffer.products.map((product: any) => ({
     ...product,
   }));
 }

 if (nextCartOffer && nextCartOffer.products.length > 0) {
  //  const nextProductIds = nextCartOffer.products.map((p: any) => p._id);
  //  const nextOptions = await Option.find({ products: { $in: nextProductIds } }).lean();

   nextCartOffer.products = nextCartOffer.products.map((product: any) => ({
     ...product,
    //  options: nextOptions.filter((opt) => opt.productId.toString() === product._id.toString()),
   }));
 }


 cartItem.cartOffer = cartOffer || {};
 cartItem.nextCartOffer = nextCartOffer || {};
 delete cartItem.dealofthedayId;
 delete cartItem.amount
 return cartItem; 
}));
return res.status(200).json({ cart: updatedOrders });
})
export const recentCartItems = async (req: Request, res: Response) => {
  // Find the latest cart for the user, sorted by the updatedAt field in descending ord
try{
  let recentCart: any = await Cart.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(req.body.cid),
        storeId:new mongoose.Types.ObjectId(req.body.storeId)
      },
    },
    {
      $lookup: {
        from: "dealoftheday", 
        localField: "dealofthedayId.dealId",
        foreignField: "_id",
        as: "dealOfTheDay",
      },
    },
    {
      $unwind: {
        path: "$dealOfTheDay",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "product",
        localField: "dealOfTheDay.products.productId",
        foreignField: "_id",
        as: "dealProductDetail",
      },
    },
    {
      $unwind: {
        path: "$dealProductDetail",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "option",
        let: { dealOptions: "$dealOfTheDay.products.optionId", dealProductId: "$dealProductDetail._id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$productId", "$$dealProductId"] },
                  { $in: ["$_id", "$$dealOptions"] }, // Fetch only matching options
                ],
              },
            },
          },
        ],
        as: "dealOptions",
      },
    },
    {
      $unwind: {
        path: "$products",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "option",
        localField: "products.optionId",
        foreignField: "_id",
        as: "options",
      },
    },
    {
      $unwind: {
        path: "$options",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "product",
        localField: "products.productId",
        foreignField: "_id",
        as: "productDetail",
      },
    },
    {
      $unwind: {
        path: "$productDetail",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $group: {
        _id: "$_id",
        products: {
          $push: {
            $cond: {
              if: { $gt: ["$products", null] },
              then: {
                productId: "$products.productId",
                quantity: "$products.quantity",
                price: "$products.price",
                optionId: "$products.optionId",
                optionDetails: "$options",
                flog: "product",
                details: {
                  _id: "$productDetail._id",
                  name: "$productDetail.name",
                  image: "$productDetail.image",
                  category: "$productDetail.category",
                  subCategory: "$productDetail.subCategory",
                  description: "$productDetail.description",
                  status: "$productDetail.status",
                },
              },
              else: "$$REMOVE",
            },
          },
        },
        dealOfTheDay: {
          $push: {
            $cond: {
              if: { $gt: ["$dealOfTheDay", null] },
              then: {
                dealId: "$dealOfTheDay._id",
                flog: "dealOfDay",
                quantity: {
                  $arrayElemAt: [
                    "$dealofthedayId.quantity",
                    {
                      $indexOfArray: ["$dealofthedayId.dealId", "$dealOfTheDay._id"],
                    },
                  ],
                },
                name: "$dealOfTheDay.name",
                image: "$dealOfTheDay.image",
                price: "$dealOfTheDay.price",
                description: "$dealOfTheDay.description",
                productDetails: {
                  _id: "$dealProductDetail._id",
                  name: "$dealProductDetail.name",
                  image: "$dealProductDetail.image",
                  category: "$dealProductDetail.category",
                  subCategory: "$dealProductDetail.subCategory",
                  description: "$dealProductDetail.description",
                  status: "$dealProductDetail.status",
                },
                optionDetails: {
                  $arrayElemAt: ["$dealOptions", 0], // Return the first matched option
                },
              },
              else: "$$REMOVE",
            },
          },
        },
        totalAmount: { $first: "$amount" },
        status: { $first: "$status" },
        createdAt: { $first: "$createdAt" },
        updatedAt: { $first: "$updatedAt" },
      },
    },
  {
    $sort: { updatedAt: -1 }
  },
  {
    $limit: 1
  }]);
  res.json({
    data:recentCart
  })


  const updatedOrders = await Promise.all(recentCart.map(async (cartItem:any) => {
    let dealOfTheDayData = [];
     cartItem.totalAmount = cartItem.amount;
    
    if (cartItem.dealofthedayId && cartItem.dealofthedayId.length > 0) {
      for (let dealItem of cartItem.dealofthedayId) {
        const deal = await DealOfTheDay.findOne({_id:dealItem.dealId,storeId: req.body.storeId})
          .populate({
            path: "products.productId",
          })
          .populate({
            path: "products.optionId",
          })
          .lean();
   
        // If deal exists, add it to the dealOfTheDayData array
        if (deal) {
          dealOfTheDayData.push({
            dealId: deal._id,
            flog: "dealOfDay", // Ensure flog is included
            name: deal.name,
            image: deal.image,
            price: deal.price,
            description: deal.description,
            quantity: dealItem.quantity,
            products: deal.products.map(product => ({
              ...product,
            })),
          });
        }
      }
    }
   
    cartItem.dealofthedays = dealOfTheDayData;
   
   
    // Fetch current cart offer based on totalAmount
    let cartOffer = await CartOffer.findOne({
      minPrice: { $lte: cartItem.totalAmount },
      maxPrice: { $gte: cartItem.totalAmount },
      storeId: req.body.storeId
    })
      .populate("freeGiftId") 
      .populate({
        path: "products.productId",
        model: "product"
      })
      .populate({
       path: "products.optionId",
       model: "option"
     })
      .sort({ minPrice: 1 })
      .lean();
   
    let nextCartOffer = null;
    if (cartOffer) {
      nextCartOffer = await CartOffer.findOne({
        minPrice: { $gt: cartOffer.maxPrice },
        storeId: req.body.storeId
      })
        .populate("freeGiftId")
        .populate({
         path: "products.productId",
         model: "product"
       })
       .populate({
        path: "products.optionId",
        model: "option"
      })
        .sort({ minPrice: 1 })
        .lean();
    }
   
    // Populate product and options in the cart offer
    if (cartOffer && cartOffer.products.length > 0) {
     //  const productIds = cartOffer.products.map((p: any) => p.productId);
     // //  const options = await Option.find({ productId: { $in: productIds } }).lean(); 
   
      cartOffer.products = cartOffer.products.map((product: any) => ({
        ...product,
      }));
    }
   
    if (nextCartOffer && nextCartOffer.products.length > 0) {
     //  const nextProductIds = nextCartOffer.products.map((p: any) => p._id);
     //  const nextOptions = await Option.find({ products: { $in: nextProductIds } }).lean();
   
      nextCartOffer.products = nextCartOffer.products.map((product: any) => ({
        ...product,
       //  options: nextOptions.filter((opt) => opt.productId.toString() === product._id.toString()),
      }));
    }
   
   
    cartItem.cartOffer = cartOffer || {};
    cartItem.nextCartOffer = nextCartOffer || {};
    delete cartItem.dealofthedayId;
    delete cartItem.amount
    return cartItem; 
   }));
    

  res.status(200).json({ data: updatedOrders });
}catch(error){
  res.status(200).json({
    message:error
  })
  console.log(error);
  
}
};

export const update = async (req: Request, res: Response) => {
  try {
    const { userId, id, productId, optionId, quantity, price, flog } = req.body;

    let cartDetail: any = await Cart.findOne({ _id: new mongoose.Types.ObjectId(id),storeId: req.body.storeId, userId });

    if (!cartDetail) {
      return res.status(404).json({ message: "Cart not found." });
    }

    let index = cartDetail.products?.findIndex(
      (x: any) =>
        x.productId?.toString() === productId.toString() &&
        x.optionId?.toString() === optionId.toString()
    );

    let dealPrice = 0;
   
    if (cartDetail.dealofthedayId && cartDetail.dealofthedayId.length > 0) {
      const dealPrices = await Promise.all(
        cartDetail.dealofthedayId.map(async (deal: any) => {
          const dealInfo:any = await DealOfTheDay.findOne({_id:deal.dealId,storeId: req.body.storeId})
         
          if (dealInfo) {
            return dealInfo.price * deal.quantity;
          }
          return 0;
        })
      );
      dealPrice = dealPrices.reduce((total, price) => total + price, 0);

    }
    const newProductTotal = quantity * price;

    if (index !== undefined && index !== -1) {
      cartDetail.products[index].quantity = quantity;
      cartDetail.products[index].price = newProductTotal;
    } else {
      cartDetail.products.push({
        productId: new mongoose.Types.ObjectId(productId),
        optionId: new mongoose.Types.ObjectId(optionId),
        quantity,
        price: newProductTotal,
        flog,
      });
    }

    let updatedAmount = cartDetail.products.reduce(
      (total: number, product: any) => total + product.price,
      0
    );

    updatedAmount += dealPrice; 
    cartDetail.amount = updatedAmount;

    console.log("Cart After Update:", cartDetail);

    const cart = await Cart.findByIdAndUpdate(
      id,
      { $set: { products: cartDetail.products, amount: cartDetail.amount } },
      { new: true }
    );

    if (!cart) {
      return res.status(500).json({ message: "Cart update failed." });
    }

    return res.status(200).json({ message: "Cart updated successfully", cart });
  } catch (error) {
    console.error("Error updating cart:", error);
    return res.status(500).json({ message: error instanceof Error ? error.message : "An unknown error occurred." });
  }
};




export const remove = async (req: Request, res: Response) => {
  try {
    const { userId, id, productId, optionId, dealOfTheDayId } = req.body;

    if (!id || !userId) {
      return res.status(400).json({ message: "Cart ID and User ID are required." });
    }

    const cart = await Cart.findOne({_id:id,storeId: req.body.storeId});
    if (!cart || cart.userId.toString() !== userId) {
      return res.status(404).json({ message: "Cart not found or does not belong to the user." });
    }

    // If productId, optionId, and dealOfTheDayId are not provided, remove the entire cart entry
    if (!productId && !optionId && !dealOfTheDayId) {
      await Cart.findByIdAndDelete(id);
      return res.status(200).json({ message: "Cart deleted successfully." });
    }

    // Removing deal of the day from cart
    if (dealOfTheDayId) {
      const dealIndex = cart.dealofthedayId.findIndex(
        (deal: any) => deal.dealId.toString() === dealOfTheDayId.toString()
      );

      if (dealIndex !== -1) {
        cart.dealofthedayId.splice(dealIndex, 1);

        const dealDetails = await DealOfTheDay.findOne({_id:dealOfTheDayId,storeId: req.body.storeId});
        if (dealDetails) {
          cart.amount -= dealDetails.price ?? 0;
        }
      } else {
        return res.status(404).json({ message: "Deal not found in cart." });
      }
    } else {
      if (!productId || !optionId) {
        return res.status(400).json({ message: "Product ID and Option ID are required." });
      }

      const productIndex = cart.products.findIndex(
        (product: any) =>
          product.productId.toString() === productId.toString() &&
          product.optionId.toString() === optionId.toString()
      );

      if (productIndex !== -1) {
        const product = cart.products[productIndex];
        cart.products.splice(productIndex, 1);
        cart.amount -= product.quantity * product.price;
      } else {
        return res.status(400).json({ message: "Product not found in cart." });
      }
    }
    if (cart.products.length === 0 && cart.dealofthedayId.length === 0) {
      await Cart.findByIdAndDelete({
        _id: id,
        userId: userId,
      });
      return res.status(200).json({ message: "Cart was empty and has been deleted." });
    }


    await cart.save();
    

    res.status(200).json({
      message: "Product or Deal removed successfully.",
      cart,
    });
  } catch (error) {
    console.error("Error in remove function:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const reorder = async (req: Request, res: Response) => {
  let order = await Orders.findOne({ _id: req.body.orderId,storeId: req.body.storeId });
  if (order) {
    let cart = await Cart.findOne({ userId: req.body.cid,storeId: req.body.storeId });
    if (!cart) {
      cart = new Cart({
        userId: req.body.cid,
        products: order.products,
      });
    } else {
      for (let index = 0; index < order.products.length; index++) {
        const element = order.products[index];
        let i: any = cart.products.findIndex(
          (x: any) =>
            x.productId.toString() === element.productId.toString() 
        );
        if (i != -1) {
          cart.products[i].quantity += element.quantity;
        } else {
          cart.products.push(element);
        }
      }
    }

    cart.amount = cart.products.reduce(
      (sum, p: any) => sum + p.quantity * p.price,
      0
    ); // Calculate total

    cart = await cart.save();

    res.status(200).json({ message: "Product added to cart", cart });
  }
  else {
    return res.status(400).json({ message: "No record found." });
  }
}
export const couponList = async (req: Request, res: Response) => {

  let couponData= await CouponCode.find({
    status:"enable",
    storeId: req.body.storeId,
    endDate:{$gt:new Date()}
  })
    
  res.status(200).json({ data: couponData });
};

export const couponApply = errorHandler(async (req: Request, res: Response) => {
  const { code, totalAmount } = req.body;

  // Find the coupon by code and ensure it's enabled
  const coupon = await CouponCode.findOne({ code, status: "enable",storeId: req.body.storeId }).lean();

  if (!coupon) {
    return res.status(400).json({ message: "Invalid or expired coupon code." });
  }

  const currentDate = new Date();

      if(coupon.endDate && new Date(coupon.endDate) < currentDate) {
    return res.status(400).json({ message: "Coupon is not valid at this time." });
  }

  if (totalAmount < coupon.minPrice || totalAmount > coupon.maxPrice) {
    return res.status(400).json({
      message: `Coupon is only valid for orders between ₹${coupon.minPrice} and ₹${coupon.maxPrice}.`,
    });
  }

  if (coupon.limit !== 0 && coupon.limit <= 0) {
    return res.status(400).json({ message: "Coupon usage limit reached." });
  }

  let discountAmount = 0;
  if (coupon.type === "percentage") {
    discountAmount = (totalAmount * coupon.discount) / 100;
  } else if (coupon.type === "rupees") {
    discountAmount = coupon.discount;
  }

  discountAmount = Math.min(discountAmount, totalAmount);

  await CouponCode.findByIdAndUpdate(coupon._id, { $inc: { limit: -1 } });

  res.status(200).json({
    message: "Coupon applied successfully.",
    discountAmount:discountAmount,
    finalAmount: totalAmount - discountAmount,
  });
});


