import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const forkRecipe = async (userId: number, recipeId: number) => {
  const recipe = await prisma.recipe.findUniqueOrThrow({
    where: {
      id: recipeId,
    },
    include: {
      recipeIngredients: true,
      recipeAttributes: true,
    },
  });

  const newRecipe = await prisma.recipe.create({
    data: {
      name: `copy of ${recipe.name}`,
      instructions: recipe.instructions,
      user: { connect: { id: userId } },
      recipeIngredients: {
        create: recipe.recipeIngredients.map((ri) => ({
          ingredientId: ri.ingredientId,
        })),
      },
      recipeAttributes: {
        create: recipe.recipeAttributes.map((ra) => ({
          attributeId: ra.attributeId,
        })),
      },
    },
  });

  return newRecipe;
};

const addIngredient = async (name: string, recipeId: number) => {
  await prisma.ingredient.upsert({
    where: { name },
    update: {},
    create: { name },
  });
  await prisma.recipeIngredient.create({
    data: {
      recipe: {
        connect: {
          id: recipeId,
        },
      },
      ingredient: {
        connect: {
          name,
        },
      },
    },
  });
};

const deleteIngredient = async (name: string, recipeId: number) => {
  const ingredient = await prisma.ingredient.findUniqueOrThrow({
    where: {
      name,
    },
  });

  await prisma.recipeIngredient.delete({
    where: {
      recipeId_ingredientId: {
        recipeId,
        ingredientId: ingredient.id,
      },
    },
  });
};

export { forkRecipe, addIngredient, deleteIngredient };
