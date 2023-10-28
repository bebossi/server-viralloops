import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { generateToken } from "../config/jwt.config";

const prisma = new PrismaClient();

export class UserController {
  async signUp(req: Request, res: Response) {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    try {
      const { password, email } = req.body;
      const hashedPassword = await bcrypt.hash(password, salt);

      if (req.currentUser) {
        const user = await prisma.user.update({
          where: {
            id: req.currentUser.id,
          },
          data: {
            email,
            password: hashedPassword,
          },
        });
        return res.status(200).json(user);
      }

      const newUser = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
        },
      });


      return res.status(200).json(newUser);
    } catch (err) {
      console.log(err);
      return res.status(400).json(err);
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const user = await prisma.user.findUnique({
        where: { email: email },
        include: {
          formWidgets: true,
        },
      });

      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }
      const isValidPassword = bcrypt.compare(password, user.password!);

      if (!isValidPassword) {
        return res.status(401);
      }
      const token = generateToken(user);

      
      res.cookie("token", token, {
        httpOnly: true,
        // secure: true,
        // path: "/",
        // sameSite: "none",
      });

      return res.status(200).json({
        user: {
          email: user.email,
        },
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  }
}