import { PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";

const attributesRouter = express.Router();
const prisma = new PrismaClient();

attributesRouter.get("/:id", async (req: Request, res: Response) => {
  // #swagger.summary = 'get recipes associated with given attribute'
  const { id } = req.params;

  try {
    const recipes = await prisma.recipe.findMany({
      where: {
        recipeAttributes: {
          some: {
            attribute: {
              id: parseInt(id),
            },
          },
        },
      },
    });

    res.json(recipes);
  } catch (error) {
    res.status(500).json(error);
  }
});

export default attributesRouter;
