import { PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";

const ingredientsRouter = express.Router();
const prisma = new PrismaClient();

ingredientsRouter.get("/:id", async (req: Request, res: Response) => {
  // #swagger.summary = 'get recipes associated with given ingredient'
  const { id } = req.params;

  try {
    const recipes = await prisma.recipe.findMany({
      where: {
        recipeIngredients: {
          some: {
            ingredient: {
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

export default ingredientsRouter;
