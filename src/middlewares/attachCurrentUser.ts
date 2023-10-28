import { PrismaClient, User } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

declare module "express" {
  interface Request {
    currentUser?: User;
  }
}

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.sendStatus(403);
    }

    const secret = process.env.TOKEN_SIGN_SECRET as string;

    const data = jwt.verify(token, secret) as User;
    const user = await prisma.user.findUnique({
      where: { id: data.id},
    });

    req.currentUser = user as User;

    next();
  } catch (error) {
    res.status(401).json({ error: "Unauthorized" });
  }
}