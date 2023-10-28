import jwt from "jsonwebtoken";
import { User } from "@prisma/client";

export function generateToken(user: User) {
  const { id } = user;

  const signature: string = process.env.TOKEN_SIGN_SECRET as string;

  const expiration = "24h";

  return jwt.sign({ id }, signature, {
    expiresIn: expiration,
  });
}