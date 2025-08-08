import { Router } from "express";
import { add, recentCartItems, remove, update,reorder, view,couponApply,couponList } from "./cart";

const router = Router();

router.post("/add", add);
router.post("/view", view);
router.post("/recent-item", recentCartItems);
router.post("/update", update);
router.post("/remove", remove);
router.post('/reorder', reorder);
router.get("/couponList", couponList)
router.post('/couponApply', couponApply);

export default router;
