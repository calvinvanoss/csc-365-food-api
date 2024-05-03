import { PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";

const ingredientsRouter = express.Router();
const prisma = new PrismaClient();

ingredientsRouter.get("/:id", async (req: Request, res: Response) => {
  // get recipes and attributes associated with given ingredient
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
        ingredientAttributes: {
          include: {
            attribute: true,
          },
        },
      },
    });

    res.json({
      name: ingredient.name,
      recipes: ingredient.recipeIngredients.map((recipeIngredient) => ({
        name: recipeIngredient.recipe.name,
        id: recipeIngredient.recipeId,
      })),
      attributes: ingredient.ingredientAttributes.map(
        (ingredientAttributes) => ingredientAttributes.attribute.name,
      ),
    });
  } catch (error) {
    res.json(error);
  }
});

ingredientsRouter.post(
  "/:id/attributes",
  async (req: Request, res: Response) => {
    // add attribute to ingredient
    const { id } = req.params;
    const { attributeName } = req.body;

    try {
      const attribute = await prisma.attribute.upsert({
        where: { name: attributeName },
        update: {},
        create: { name: attributeName },
      });

      await prisma.ingredientAttribute.create({
        data: {
          ingredient: {
            connect: {
              id: parseInt(id),
            },
          },
          attribute: {
            connect: {
              name: attributeName,
            },
          },
        },
      });

      res.json(attribute.id);
    } catch (error) {
      res.json(error);
    }
  },
);

export default ingredientsRouter;
