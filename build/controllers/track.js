"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const storage_1 = require("firebase/storage");
const firestore_1 = require("firebase/firestore");
const app_1 = require("firebase/app");
const firebase_config_1 = require("../config/firebase.config");
const utils_1 = require("../utils/utils");
(0, app_1.initializeApp)(firebase_config_1.firebaseConfig);
const storage = (0, storage_1.getStorage)();
const db = (0, firestore_1.getFirestore)();
const getTrack = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const coll = (0, firestore_1.collection)(db, "tracks");
        const collSnap = yield (0, firestore_1.getCountFromServer)(coll);
        const prevId = parseInt(req.params.prevSongId);
        let randomId;
        if (isNaN(prevId)) {
            randomId = (0, utils_1.randomNumber)(collSnap.data().count);
        }
        else {
            randomId = (0, utils_1.randomNumber)(collSnap.data().count, prevId);
        }
        const q = (0, firestore_1.query)(coll, (0, firestore_1.where)("id", "==", randomId), (0, firestore_1.limit)(1));
        const docSnap = yield (0, firestore_1.getDocs)(q);
        return res.send(docSnap.docs[0].data());
    }
    catch (err) {
        return res.status(400).send(err.message);
    }
});
const postTrack = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const storageRef = (0, storage_1.ref)(storage, `tracks/${req.file.originalname}`);
        const snapshot = yield (0, storage_1.uploadBytesResumable)(storageRef, req.file.buffer, {
            contentType: req.file.mimetype,
        });
        const downloadURL = yield (0, storage_1.getDownloadURL)(snapshot.ref);
        const coll = (0, firestore_1.collection)(db, "tracks");
        const collSnap = yield (0, firestore_1.getCountFromServer)(coll);
        const docRef = yield (0, firestore_1.addDoc)((0, firestore_1.collection)(db, "tracks"), {
            id: collSnap.data().count + 1,
            trackName: req.body.trackName,
            artist: req.body.artist,
            trackUrl: downloadURL,
        });
        const docSnap = yield (0, firestore_1.getDoc)(docRef);
        if (docSnap.exists()) {
            return res.send(docSnap.data());
        }
        else {
            return res.send({
                status: "failed",
                message: "No document exists",
            });
        }
    }
    catch (error) {
        return res.status(400).send(error.message);
    }
});
exports.default = {
    getTrack,
    postTrack,
};
//# sourceMappingURL=track.js.map