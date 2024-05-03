import { PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";

const attributesRouter = express.Router();
const prisma = new PrismaClient();

attributesRouter.get("/:name", async (req: Request, res: Response) => {
  // get all recipes with given attribute
  const { name } = req.params;

  try {
    const recipes = await prisma.recipe.findMany({
      where: {
        recipeIngredients: {
          some: {
            ingredient: {
              ingredientAttributes: {
                some: {
                  attribute: {
                    name,
                  },
                },
              },
            },
          },
        },
      },
    });

    res.json(
      recipes.map((recipe) => ({
        name: recipe.name,
        id: recipe.id,
      })),
    );
  } catch (error) {
    res.json(error);
  }
});

export default attributesRouter;
