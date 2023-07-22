import express from "express";
import baseController from "../controllers/base";

const router = express.Router();

router.get("/", baseController.getBase);

export default router;
