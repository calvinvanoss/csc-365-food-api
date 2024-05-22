import { PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";

const attributesRouter = express.Router();
const prisma = new PrismaClient();

attributesRouter.get("/:name", async (req: Request, res: Response) => {
  // #swagger.summary = 'get recipes associated with given attribute'
  const { name } = req.params;

  try {
    const recipes = await prisma.recipe.findMany({
      where: {
        recipeAttributes: {
          some: {
            attribute: {
              name,
            },
          },
        },
      },
    });

    res.json(recipes);
  } catch (error) {
    res.json(error);
  }
});

export default attributesRouter;
