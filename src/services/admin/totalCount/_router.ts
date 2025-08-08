import { Router } from "express";
import { list } from "./count";

const router = Router();

router.post("/list", list);
// router.post('/deleteImage', deleteImage);

export default router;
