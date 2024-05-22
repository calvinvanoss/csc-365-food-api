import { PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";

const ingredientsRouter = express.Router();
const prisma = new PrismaClient();

ingredientsRouter.get("/:id", async (req: Request, res: Response) => {
  // #swagger.summary = 'get recipes associated with given ingredient'
  const { id } = req.params;

  try {
    const ingredient = await prisma.ingredient.findUniqueOrThrow({
      where: {
        id: parseInt(id),
      },
      include: {
        recipeIngredients: {
          include: {
            recipe: true,
          },
        },
      },
    });

    res.json({
      name: ingredient.name,
      recipes: ingredient.recipeIngredients.map(
        (recipeIngredient) => recipeIngredient.recipe,
      ),
    });
  } catch (error) {
    res.json(error);
  }
});

export default ingredientsRouter;
