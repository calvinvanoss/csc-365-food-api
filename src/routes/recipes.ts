import { PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";

const recipesRouter = express.Router();
const prisma = new PrismaClient();

recipesRouter.get("/:id", async (req: Request, res: Response) => {
  // get ingredients, attributes, and average rating of recipe
  const { id } = req.params;

  try {
    const recipe = await prisma.recipe.findUniqueOrThrow({
      where: {
        id: parseInt(id),
      },
      include: {
        recipeIngredients: {
          include: {
            ingredient: {
              include: {
                ingredientAttributes: {
                  include: {
                    attribute: true,
                  },
                },
              },
            },
          },
        },
        user: true,
      },
    });

    const rating = await prisma.rating.aggregate({
      where: {
        recipeId: parseInt(id),
      },
      _avg: {
        rating: true,
      },
    });

    res.json({
      name: recipe.name,
      author: {
        name: recipe.user.name,
        id: recipe.userId,
      },
      instructions: recipe.instructions,
      ingredients: recipe.recipeIngredients.map(
        (recipeIngredient) => recipeIngredient.ingredient.name,
      ),
      attributes: [
        ...new Set(
          recipe.recipeIngredients.flatMap((recipeIngredient) =>
            recipeIngredient.ingredient.ingredientAttributes.map(
              (ingredientAttribute) => ingredientAttribute.attribute.name,
            ),
          ),
        ),
      ],
      rating: rating._avg.rating,
    });
  } catch (error) {
    res.json(error);
  }
});

recipesRouter.post("/:id", async (req: Request, res: Response) => {
  // create recipe
  const { id } = req.params;
  const { name, instructions } = req.body;

  try {
    const recipe = await prisma.recipe.create({
      data: {
        name,
        instructions,
        user: {
          connect: {
            id: parseInt(id),
          },
        },
      },
    });
    res.json(recipe.id);
  } catch (error) {
    res.json(error);
  }
});

recipesRouter.post("/:id/ingredients", async (req: Request, res: Response) => {
  // add ingredient to recipe
  const { id } = req.params;
  const { ingredientName } = req.body;

  try {
    const ingredient = await prisma.ingredient.upsert({
      where: { name: ingredientName },
      update: {},
      create: { name: ingredientName },
    });

    await prisma.recipeIngredient.create({
      data: {
        recipe: {
          connect: {
            id: parseInt(id),
          },
        },
        ingredient: {
          connect: {
            name: ingredientName,
          },
        },
      },
    });

    res.json(ingredient.id);
  } catch (error) {
    res.json(error);
  }
});

recipesRouter.put("/:id/rate", async (req: Request, res: Response) => {
  // rate recipe
  const { id } = req.params;
  const { userId, rating } = req.body;

  try {
    const result = await prisma.rating.upsert({
      where: {
        recipeId_userId: {
          recipeId: parseInt(id),
          userId: parseInt(userId),
        },
      },
      create: {
        recipe: {
          connect: {
            id: parseInt(id),
          },
        },
        user: {
          connect: {
            id: parseInt(userId),
          },
        },
        rating: rating,
      },
      update: {
        rating: rating,
      },
    });

    res.json(result);
  } catch (error) {
    res.json(error);
  }
});

export default recipesRouter;
