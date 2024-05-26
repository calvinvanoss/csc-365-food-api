import { PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";
import { hash, generateToken } from "../utils/users";

const usersRouter = express.Router();
const prisma = new PrismaClient();

usersRouter.post("/signup", async (req: Request, res: Response) => {
  // #swagger.summary = 'create user'
  const { name, password } = req.body;

  if (password.length < 8) {
    res.status(400).json("password must be at least 8 characters");
    return;
  }

  try {
    const user = await prisma.user.create({
      data: {
        name,
        password: hash(password),
        token: generateToken(name),
      },
    });
    res.json({ token: user.token });
  } catch (error) {
    res.status(500).json(error);
  }
});

usersRouter.post("/login", async (req: Request, res: Response) => {
  // #swagger.summary = 'login user to get auth token'
  const { name, password } = req.body;

  try {
    const user = await prisma.user.findFirstOrThrow({
      where: {
        name,
        password: hash(password),
      },
    });

    res.json({ token: user.token });
  } catch (error) {
    res.status(500).json(error);
  }
});

usersRouter.get("/:id", async (req: Request, res: Response) => {
  // #swagger.summary = 'get recipes associated with given user'
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
    res.status(500).json(error);
  }
});

usersRouter.get(
  "/users/:id/recommendations",
  async (req: Request, res: Response) => {
    // #swagger.summary = 'TODO'

    res.json("TODO");
  },
);

export default usersRouter;
