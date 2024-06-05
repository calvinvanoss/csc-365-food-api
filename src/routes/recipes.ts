import { Prisma, PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";
import { addIngredient, deleteIngredient, forkRecipe } from "../utils/recipes";

const recipesRouter = express.Router();
const prisma = new PrismaClient();

recipesRouter.post("/", async (req: Request, res: Response) => {
  // #swagger.summary = 'create recipe'
  const { name, instructions, token } = req.body;

  if (!name) {
    res.status(400).json({ error: "name required" });
    return;
  }
  if (!token) {
    res.status(400).json({ error: "token required" });
    return;
  }

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
    res.json(recipe);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2002':
          res.status(400).json({ error: 'A recipe with this name already exists.' });
          break;
        default:
          res.status(500).json({ error: 'Something went wrong.' });
      }
    } else {
      res.status(500).json({ error: 'Something went wrong.' });
    }
  }
});

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
        (recipeIngredient) => recipeIngredient.ingredient,
      ),
      attributes: recipe.recipeAttributes.map(
        (recipeAttribute) => recipeAttribute.attribute,
      ),
      rating: rating._avg.rating,
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2025':
          res.status(404).json({ error: 'Recipe not found.' });
          break;
        default:
          res.status(500).json({ error: 'Something went wrong.' });
      }
    } else {
      res.status(500).json({ error: 'Something went wrong.' });
    }
  }
});

recipesRouter.post("/:id/ingredients", async (req: Request, res: Response) => {
  // #swagger.summary = 'add ingredient to recipe, fork recipe if not owner'
  const { id } = req.params;
  const { name, token } = req.body;

  if (!name) {
    res.status(400).json({ error: "name required" });
    return;
  }
  if (!token) {
    res.status(400).json({ error: "token required" });
    return;
  }

  try {
    const user = await prisma.user.findFirstOrThrow({
      where: {
        token,
      },
    });
    const recipe = await prisma.recipe.findFirst({
      where: {
        id: parseInt(id),
        user: {
          id: user.id,
        },
      },
    });

    if (!recipe) {
      const newRecipe = await forkRecipe(user.id, parseInt(id));
      await addIngredient(name, newRecipe.id);
      res.json(newRecipe);
      return;
    }

    await addIngredient(name, parseInt(id));
    res.json(recipe);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2025':
          res.status(404).json({ error: 'Recipe not found.' });
          break;
        default:
          res.status(500).json({ error: 'Something went wrong.' });
      }
    } else {
      res.status(500).json({ error: 'Something went wrong.' });
    }
  }
});

recipesRouter.delete(
  "/:id/ingredients",
  async (req: Request, res: Response) => {
    // #swagger.summary = 'delete ingredient from recipe, fork recipe if not owner'
    const { id } = req.params;
    const { name, token } = req.body;

    if (!name) {
      res.status(400).json({ error: "name required" });
      return;
    }
    if (!token) {
      res.status(400).json({ error: "token required" });
      return;
    }

    try {
      const user = await prisma.user.findFirstOrThrow({
        where: {
          token,
        },
      });
      const recipe = await prisma.recipe.findFirst({
        where: {
          id: parseInt(id),
          user: {
            id: user.id,
          },
        },
      });

      if (!recipe) {
        const newRecipe = await forkRecipe(user.id, parseInt(id));
        await deleteIngredient(name, newRecipe.id);
        res.json(newRecipe);
        return;
      }

      await deleteIngredient(name, parseInt(id));
      res.json(recipe);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
          case 'P2025':
            res.status(404).json({ error: 'Recipe not found.' });
            break;
          default:
            res.status(500).json({ error: 'Something went wrong.' });
        }
      } else {
        res.status(500).json({ error: 'Something went wrong.' });
      }
    }
  },
);

recipesRouter.post("/:id/attributes", async (req: Request, res: Response) => {
  // #swagger.summary = 'add attribute to recipe'
  const { id } = req.params;
  const { name, token } = req.body;

  if (!name) {
    res.status(400).json({ error: "name required" });
    return;
  }
  if (!token) {
    res.status(400).json({ error: "token required" });
    return;
  }

  try {
    const recipe = await prisma.recipe.findFirstOrThrow({
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

    res.json(recipe);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2025':
          res.status(404).json({ error: 'Recipe not found.' });
          break;
        default:
          res.status(500).json({ error: 'Something went wrong.' });
      }
    } else {
      res.status(500).json({ error: 'Something went wrong.' });
    }
  }
});

recipesRouter.delete("/:id/attributes", async (req: Request, res: Response) => {
  // #swagger.summary = 'delete attribute from recipe'
  const { id } = req.params;
  const { name, token } = req.body;

  if (!name) {
    res.status(400).json({ error: "name required" });
    return;
  }
  if (!token) {
    res.status(400).json({ error: "token required" });
    return;
  }

  try {
    const recipe = await prisma.recipe.findFirstOrThrow({
      where: {
        id: parseInt(id),
        user: {
          token,
        },
      },
    });
    const attribute = await prisma.attribute.findUniqueOrThrow({
      where: { name },
    });
    await prisma.recipeAttribute.delete({
      where: {
        recipeId_attributeId: {
          recipeId: parseInt(id),
          attributeId: attribute.id,
        },
      },
    });

    res.json(recipe);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2025':
          res.status(404).json({ error: 'Recipe not found.' });
          break;
        default:
          res.status(500).json({ error: 'Something went wrong.' });
      }
    } else {
      res.status(500).json({ error: 'Something went wrong.' });
    }
  }
});

recipesRouter.put("/:id/rate", async (req: Request, res: Response) => {
  // #swagger.summary = 'rate recipe'
  const { id } = req.params;
  const { rating, description, token } = req.body;

  if (!token) {
    res.status(400).json({ error: "token required" });
    return;
  }

  // check if rating is between 1 and 5
  if (!(parseInt(rating) >= 1 && parseInt(rating) <= 5)) {
    res.status(400).json({ error: "Rating must be between 1 and 5" });
    return;
  }

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

    res.json({ success: true });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2025':
          res.status(404).json({ error: 'Recipe not found.' });
          break;
        default:
          res.status(500).json({ error: 'Something went wrong.' });
      }
    } else {
      res.status(500).json({ error: 'Something went wrong.' });
    }
  }
});

export default recipesRouter;
