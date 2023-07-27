import express from "express";
import trackController from "../controllers/track";
import multer from "multer";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
});

router.get(["/track", "/track/:prevSongId"], trackController.getTrack);
router.post("/track", upload.single("track"), trackController.postTrack);

export default router;
