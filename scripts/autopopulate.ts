import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";
import { recipes } from "./exampleRecipes";

const prisma = new PrismaClient();

const randomNumSet = (length: number, range: number) => {
  const set = new Set<number>();
  while (set.size < length) {
    const randomNum = faker.number.int({ min: 1, max: range });
    set.add(randomNum);
  }
  return Array.from(set);
};

const autopopulateGenerated = async () => {
  await prisma.ingredient.createMany({
    data: [...new Set(recipes.flatMap((recipe) => recipe.ingredients))].map(
      (ingredient) => ({ name: ingredient }),
    ),
  });
  await prisma.attribute.createMany({
    data: [...new Set(recipes.flatMap((recipe) => recipe.attributes))].map(
      (attribute) => ({ name: attribute }),
    ),
  });
  await prisma.user.createMany({
    data: Array.from({ length: recipes.length }).map((_, idx) => ({
      name: `user ${idx + 1}`,
      password: "password",
      token: `token ${idx + 1}`,
    })),
  });
  await Promise.all(
    recipes.map(async (recipe, idx) => {
      await prisma.recipe.create({
        data: {
          name: recipe.name,
          instructions: "instructions",
          userId: idx + 1,
          recipeIngredients: {
            create: recipe.ingredients.map((ingredient) => ({
              ingredient: {
                connect: {
                  name: ingredient,
                },
              },
            })),
          },
          recipeAttributes: {
            create: recipe.attributes.map((attribute) => ({
              attribute: {
                connect: {
                  name: attribute,
                },
              },
            })),
          },
        },
      });
    }),
  );
  await prisma.rating.createMany({
    data: Array.from({ length: recipes.length }).flatMap((_, idx) =>
      randomNumSet(10, recipes.length).map((recipeId) => ({
        recipeId,
        userId: idx + 1,
        rating: faker.number.int({ min: 1, max: 5 }),
      })),
    ),
  });
};

autopopulateGenerated();

/*
const autopopulateMillion = async () => {
  await prisma.ingredient.createMany({
    data: Array.from({ length: 100 }).map((_, idx) => ({
      name: `ingredient ${idx + 1}`,
    })),
  });

  await prisma.attribute.createMany({
    data: Array.from({ length: 40 }).map((_, idx) => ({
      name: `attribute ${idx + 1}`,
    })),
  });

  await prisma.user.createMany({
    data: Array.from({ length: 50000 }).map((_, idx) => ({
      name: `user ${idx + 1}`,
      password: "password",
      token: `token ${idx + 1}`,
    })),
  });

  await prisma.recipe.createMany({
    data: Array.from({ length: 50000 })
      .map((_, idx) => ({
        name: `recipe1 ${idx + 1}`,
        instructions: faker.lorem.sentence(),
        userId: idx + 1,
      }))
      .concat(
        Array.from({ length: 50000 }).map((_, idx) => ({
          name: `recipe2 ${idx + 1}`,
          instructions: faker.lorem.sentence(),
          userId: idx + 1,
        })),
      ),
  });

  await prisma.recipeIngredient.createMany({
    data: Array.from({ length: 100000 }).flatMap((_, idx) =>
      randomNumSet(5, 100).map((ingredientId) => ({
        recipeId: idx + 1,
        ingredientId,
      })),
    ),
  });

  await prisma.recipeAttribute.createMany({
    data: Array.from({ length: 100000 }).flatMap((_, idx) =>
      randomNumSet(2, 40).map((attributeId) => ({
        recipeId: idx + 1,
        attributeId,
      })),
    ),
  });

  await prisma.rating.createMany({
    data: Array.from({ length: 50000 }).flatMap((_, idx) =>
      randomNumSet(10, 100000).map((recipeId) => ({
        recipeId,
        userId: idx + 1,
        rating: faker.number.int({ min: 1, max: 5 }),
      })),
    ),
  });
};

autopopulateMillion();
*/
