import { Router } from "express";
import {register, update, getUser,deleteUser,getSingleUser } from "./user";

const router = Router();

router.post("/register", register);
router.post("/", getUser);
router.get("/:id", getSingleUser);
router.put("/:id", update);
router.delete("/:id", deleteUser);

export default router;
