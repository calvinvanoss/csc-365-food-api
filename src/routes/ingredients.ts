import { PrismaClient, Prisma } from "@prisma/client";
import express, { Request, Response } from "express";

const ingredientsRouter = express.Router();
const prisma = new PrismaClient();

ingredientsRouter.get("/:name", async (req: Request, res: Response) => {
  // #swagger.summary = 'get recipes associated with given ingredient'
  const { name } = req.params;

  try {
    const recipes = await prisma.recipe.findMany({
      where: {
        recipeIngredients: {
          some: {
            ingredient: {
              name,
            },
          },
        },
      },
      take: 10,
    });

    res.json(recipes);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Handle Prisma known request errors
      if (error.code === "P2025") {
        res.status(404).json({ error: "Ingredient not found" });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    } else {
      // Handle other errors
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

export default ingredientsRouter;
