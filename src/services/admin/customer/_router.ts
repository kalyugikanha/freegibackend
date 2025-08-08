import { Router } from "express";
import { add, list, remove, update, view } from "./customer";

const router = Router();

router.post("/list", list);
router.post("/add", add);
router.post("/update", update);
router.post("/view", view);
router.post("/delete", remove);
// router.post('/deleteImage', deleteImage);

export default router;
