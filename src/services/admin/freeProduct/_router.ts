import { Router } from "express";
import {
  add,
  list,
  remove,
  update,
  uploadImage,
  view,
} from "./freeProduct";
// import { fileUpload } from "../../../helper/upload";
const router = Router();

router.get("/list",list);
router.post("/add", add);
router.put("/:id", update);
router.get("/:id", view);
router.delete("/:id", remove);
router.post("/uploadImage", uploadImage);
// router.post('/deleteImage', deleteImage);

export default router;
