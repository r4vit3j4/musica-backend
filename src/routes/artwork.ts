import express from "express";
import artworkController from "../controllers/artwork";
import multer from "multer";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
});

router.post(
  "/artwork",
  upload.single("artwork"),
  artworkController.postArtwork
);

export default router;
