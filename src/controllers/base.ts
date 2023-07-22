import { Request, Response } from "express";

const getBase = (req: Request, res: Response) => {
  return res.send({
    message: "Hello Friend 👋!",
  });
};

export default {
  getBase,
};
