import { expressjwt } from "express-jwt";
import * as dotenv from "dotenv";
import { Request } from "express";

dotenv.config();

export default expressjwt({
  secret: process.env.TOKEN_SIGN_SECRET as string,
  algorithms: ["HS256"],
  getToken: (req: Request) => {
    if (req.cookies.token) {
      return req.cookies.token;
    }
  },
});