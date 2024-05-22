import { PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";

const recipesRouter = express.Router();
const prisma = new PrismaClient();

recipesRouter.get("/:id", async (req: Request, res: Response) => {
  // #swagger.summary = 'get ingredients, attributes, and average rating of recipe'
  const { id } = req.params;

  try {
    const recipe = await prisma.recipe.findUniqueOrThrow({
      where: {
        id: parseInt(id),
      },
      include: {
        recipeIngredients: {
          include: {
            ingredient: true,
          },
        },
        recipeAttributes: {
          include: {
            attribute: true,
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
      attributes: recipe.recipeAttributes.map(
        (recipeAttribute) => recipeAttribute.attribute.name,
      ),
      rating: rating._avg.rating,
    });
  } catch (error) {
    res.json(error);
  }
});

recipesRouter.post("/", async (req: Request, res: Response) => {
  // #swagger.summary = 'create recipe'
  const { name, instructions, token } = req.body;

  try {
    const user = await prisma.user.findFirstOrThrow({
      where: {
        token,
      },
    });

    const recipe = await prisma.recipe.create({
      data: {
        name,
        instructions,
        user: {
          connect: {
            id: user.id,
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
  // #swagger.summary = 'add ingredient to recipe'
  const { id } = req.params;
  const { name, token } = req.body;

  try {
    await prisma.recipe.findFirstOrThrow({
      where: {
        id: parseInt(id),
        user: {
          token,
        },
      },
    });
    await prisma.ingredient.upsert({
      where: { name },
      update: {},
      create: { name },
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
            name,
          },
        },
      },
    });

    res.json("success");
  } catch (error) {
    res.json(error);
  }
});

recipesRouter.post("/:id/attributes", async (req: Request, res: Response) => {
  // #swagger.summary = 'add attribute to recipe'
  const { id } = req.params;
  const { name, token } = req.body;

  try {
    await prisma.recipe.findFirstOrThrow({
      where: {
        id: parseInt(id),
        user: {
          token,
        },
      },
    });
    await prisma.attribute.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    await prisma.recipeAttribute.create({
      data: {
        recipe: {
          connect: {
            id: parseInt(id),
          },
        },
        attribute: {
          connect: {
            name,
          },
        },
      },
    });

    res.json("success");
  } catch (error) {
    res.json(error);
  }
});

recipesRouter.put("/:id/rate", async (req: Request, res: Response) => {
  // #swagger.summary = 'rate recipe'
  const { id } = req.params;
  const { rating, description, token } = req.body;

  try {
    const user = await prisma.user.findFirstOrThrow({
      where: {
        token,
      },
    });

    await prisma.rating.upsert({
      where: {
        recipeId_userId: {
          recipeId: parseInt(id),
          userId: user.id,
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
            id: user.id,
          },
        },
        rating: parseInt(rating),
        description,
      },
      update: {
        rating: parseInt(rating),
        description,
      },
    });

    res.json("success");
  } catch (error) {
    console.log(error);
    res.json(error);
  }
});

export default recipesRouter;
