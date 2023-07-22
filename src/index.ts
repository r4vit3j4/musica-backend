import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import baseRouter from "./routes/base";
import trackRouter from "./routes/track";
import bodyParser from "body-parser";

dotenv.config();

const PORT = process.env.PORT || 8080;

const app = express();

app.use(
  cors({
    origin: "*",
  })
);

app.use(bodyParser.json());

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use("/", baseRouter);

app.use("/api/v1/", trackRouter);

app.listen(PORT, () => {
  console.log(`server started on port http://localhost:${PORT}...`);
});
