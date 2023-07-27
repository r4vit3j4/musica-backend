import { Request, Response } from "express";
import { initializeApp } from "firebase/app";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { firebaseConfig } from "../config/firebase.config";
import {
  addDoc,
  collection,
  getCountFromServer,
  getDoc,
  getFirestore,
} from "firebase/firestore";

initializeApp(firebaseConfig);

const storage = getStorage();
const db = getFirestore();

const postArtwork = async (req: Request, res: Response) => {
  try {
    if (req.file) {
      const storageRef = ref(storage, `artworks/${req.file.originalname}`);

      const snapshot = await uploadBytesResumable(storageRef, req.file.buffer, {
        contentType: req.file.mimetype,
      });

      const downloadURL = await getDownloadURL(snapshot.ref);

      const coll = collection(db, "artworks");
      const collSnap = await getCountFromServer(coll);

      const docRef = await addDoc(collection(db, "artworks"), {
        id: collSnap.data().count + 1,
        artworkUrl: downloadURL,
      });

      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return res.send(docSnap.data());
      } else {
        return res.send({
          status: "failed",
          message: "No document exists",
        });
      }
    } else {
      res.status(400).send({
        error: "File Error",
      });
    }
  } catch (error: any) {
    return res.status(400).send(error.message);
  }
};

export default {
  postArtwork,
};
