import { Router } from "express";
import { add, update, uploadImage } from "./drivingLicense";

const router = Router();

router.post("/add", add);
router.post("/aadhar", update);
router.post("/uploadImage", uploadImage);
// router.post('/deleteImage', deleteImage);

export default router;
