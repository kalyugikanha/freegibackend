import express from "express";
import { userAuth } from "../middleware/auth";
// superAdminService
import superAdminLogin from "./superAdmin/auth/_router";
import superAdminStoreUser from "./superAdmin/storeUser/_router";

import customerLogin from "./customer/login/_router";
import customerProfile from "./customer/profile/_router";
import customerCategory from "./customer/category/_router";
import customerSubCategory from "./customer/subCategory/_router";
import customerProduct from "./customer/product/_router";
import customerCart from "./customer/cart/_router";
import customerAddress from "./customer/address/_router";
import customerMostReviewItem from "./customer/reviwes/_router";
import customerOrder from "./customer/orders/_router";
import customerTax from "./customer/tax/_router";
import customerCouponCode from "./customer/couponCode/_router";
import customerService from "./customer/customerService/_router";
import wallet from "./customer/wallet/_router";
import wish from "./customer/wish/_router";
import dealOfTheDay from "./customer/dealOfTheDay/_router";

import driverLogin from "./driver/login/_router";
import driverProfile from "./driver/profile/_router";
import driverArea from "./driver/area/_router";
import driverDrivingLicense from "./driver/drivingLicence/_router";
import driverOrders from "./driver/orders/_router";
import driverGeoLocation from "./driver/geoLocation/_router";
import driverMessages from "./driver/messages/_router";

import adminLogin from "./admin/login/_router";
import adminProfile from "./admin/profile/_router";
import adminCategory from "./admin/category/_router";
import adminSubCategory from "./admin/subCategory/_router";
import adminProduct from "./admin/product/_router";
import adminFreeProduct from "./admin/freeProduct/_router";
import adminCartOffer from "./admin/cartOffer/_router";
import adminCouponCode from "./admin/couponCode/_router";
import adminTax from "./admin/tax/_router";
import adminCustomer from "./admin/customer/_router";
import adminDashboard from "./admin/totalCount/_router";
import adminOrder from "./admin/order/_router";
import adminBanner from "./admin/banner/_router";
import adminDealoftheday from "./admin/dealoftheday/_router";
import adminFeatureditem from "./admin/featureditem/_router";
import adminPincode from "./admin/pincode/_router";

const app = express();

app.use("/superAdmin", superAdminLogin);
app.use("/superAdmin/storeUser", superAdminStoreUser);

app.use("/customer", customerLogin);
app.use("/customer/profile", userAuth, customerProfile);
app.use("/customer/category", userAuth, customerCategory);
app.use("/customer/subCategory", userAuth, customerSubCategory);
app.use("/customer/product", userAuth, customerProduct);
app.use("/customer/cart", userAuth, customerCart);
app.use("/customer/address", userAuth, customerAddress);
app.use("/customer/review-item", userAuth, customerMostReviewItem);
app.use("/customer/order", userAuth, customerOrder);
app.use("/customer/tax", userAuth, customerTax);
app.use("/customer/coupon-code", userAuth, customerCouponCode);
app.use("/customer/customerservice", userAuth, customerService);
app.use("/customer/wallet", userAuth, wallet);
app.use("/customer/wish", userAuth, wish);
app.use("/customer/dealOfTheDay", userAuth, dealOfTheDay);

app.use("/driver", driverLogin);
app.use("/driver/profile", userAuth, driverProfile);
app.use("/driver/area", userAuth, driverArea);
app.use("/driver/driving-license", userAuth, driverDrivingLicense);
app.use("/driver/order", userAuth, driverOrders);
app.use("/driver/geoLocation", userAuth, driverGeoLocation);
app.use("/driver/messages", userAuth, driverMessages);

app.use("/admin", adminLogin);
app.use("/admin/profile", userAuth, adminProfile);
app.use("/admin/category", userAuth, adminCategory);
app.use("/admin/subCategory", userAuth, adminSubCategory);
app.use("/admin/product", userAuth, adminProduct);
app.use("/admin/freeProduct", userAuth, adminFreeProduct);
app.use("/admin/cartOffer", userAuth, adminCartOffer);
app.use("/admin/coupon-code", userAuth, adminCouponCode);
app.use("/admin/tax", userAuth, adminTax);
// app.use("/admin/customer", userAuth, adminTax);
app.use("/admin/customer", userAuth, adminCustomer);
app.use("/admin/dashboard", userAuth, adminDashboard);
app.use("/admin/order", userAuth, adminOrder);
app.use("/admin/banner", userAuth, adminBanner);
app.use("/admin/dealoftheday", userAuth, adminDealoftheday);
app.use("/admin/featureditem", userAuth, adminFeatureditem);
app.use("/admin/pincode", userAuth, adminPincode);

export default app;
