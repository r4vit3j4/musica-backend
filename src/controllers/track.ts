import { Request, Response } from "express";
import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";
import {
  addDoc,
  collection,
  getCountFromServer,
  getDoc,
  getDocs,
  getFirestore,
  limit,
  query,
  where,
} from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../config/firebase.config";
import { randomNumber } from "../utils/utils";

initializeApp(firebaseConfig);

const storage = getStorage();
const db = getFirestore();

const getTrack = async (req: Request, res: Response) => {
  try {
    const tracksCollection = collection(db, "tracks");
    const artCollection = collection(db, "artworks");

    const tracksCollSnap = await getCountFromServer(tracksCollection);
    const artCollSnap = await getCountFromServer(artCollection);

    const prevId = parseInt(req.params.prevSongId);

    let randomTrackId;

    if (isNaN(prevId)) {
      randomTrackId = randomNumber(tracksCollSnap.data().count);
    } else {
      randomTrackId = randomNumber(tracksCollSnap.data().count, prevId);
    }

    const randomArtworkId = randomNumber(artCollSnap.data().count);

    const trackQuery = query(
      tracksCollection,
      where("id", "==", randomTrackId),
      limit(1)
    );

    const artworkQuery = query(
      artCollection,
      where("id", "==", randomArtworkId),
      limit(1)
    );

    const trackDocSnap = await getDocs(trackQuery);
    const artworkDocSnap = await getDocs(artworkQuery);

    return res.send({
      ...trackDocSnap.docs[0].data(),
      artworkUrl: artworkDocSnap.docs[0].data().artworkUrl,
    });
  } catch (err: any) {
    return res.status(400).send(err.message);
  }
};

const postTrack = async (req: Request, res: Response) => {
  try {
    if (req.file) {
      const storageRef = ref(storage, `tracks/${req.file.originalname}`);

      const snapshot = await uploadBytesResumable(storageRef, req.file.buffer, {
        contentType: req.file.mimetype,
      });

      const downloadURL = await getDownloadURL(snapshot.ref);

      const coll = collection(db, "tracks");
      const collSnap = await getCountFromServer(coll);

      const docRef = await addDoc(collection(db, "tracks"), {
        id: collSnap.data().count + 1,
        trackName: req.body.trackName,
        artist: req.body.artist,
        trackUrl: downloadURL,
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
  getTrack,
  postTrack,
};
