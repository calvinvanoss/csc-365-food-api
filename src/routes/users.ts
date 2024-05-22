import { PrismaClient } from "@prisma/client";
import { sign } from "jsonwebtoken";
import express, { Request, Response } from "express";

const usersRouter = express.Router();
const prisma = new PrismaClient();

const generateToken = (name: string) => {
  return sign({ name }, process.env.JWT_SECRET!);
};

usersRouter.get("/:id", async (req: Request, res: Response) => {
  // get recipes associated with given user
  const { id } = req.params;

  try {
    const user = await prisma.user.findUniqueOrThrow({
      where: {
        id: parseInt(id),
      },
      include: {
        recipes: true,
      },
    });
    res.json(user.recipes);
  } catch (error) {
    res.json(error);
  }
});

usersRouter.post("/signup", async (req: Request, res: Response) => {
  // signup user
  const { name, password } = req.body;

  try {
    const user = await prisma.user.create({
      data: {
        name,
        password,
        token: generateToken(name),
      },
    });
    res.json(user.token);
  } catch (error) {
    res.json(error);
  }
});

usersRouter.post("/login", async (req: Request, res: Response) => {
  // login user
  const { name, password } = req.body;

  try {
    const user = await prisma.user.findFirst({
      where: {
        name,
        password,
      },
    });
    if (!user) {
      res.json("Invalid login");
      return;
    }
    res.json(user.token);
  } catch (error) {
    res.json(error);
  }
});

export default usersRouter;
