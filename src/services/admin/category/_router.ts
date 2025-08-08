import { Router } from "express";
import {
  add,
  changeStatus,
  list,
  remove,
  update,
  uploadImage,
  view,
} from "./category";

const router = Router();

router.post("/list", list);
router.post("/add", add);
router.put("/update", update);
router.post("/view", view);
router.post("/changeStatus", changeStatus);
router.post("/delete", remove);
router.post("/uploadImage", uploadImage);
// router.post('/deleteImage', deleteImage);

export default router;
