import { PrismaClient, Prisma } from "@prisma/client";
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
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Handle Prisma known request errors
      if (error.code === 'P2025') {
        res.status(404).json({ error: 'Attribute not found' });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    } else {
      // Handle other errors
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

export default attributesRouter;
