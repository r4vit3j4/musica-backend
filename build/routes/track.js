"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const track_1 = __importDefault(require("../controllers/track"));
const multer_1 = __importDefault(require("multer"));
const router = express_1.default.Router();
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
});
router.get("/track/:prevSongId", track_1.default.getTrack);
router.post("/track", upload.single("track"), track_1.default.postTrack);
exports.default = router;
//# sourceMappingURL=track.js.map