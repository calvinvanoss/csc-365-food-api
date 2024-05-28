import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const exampleIngredients = [
  "flour",
  "sugar",
  "butter",
  "eggs",
  "milk",
  "chocolate",
  "vanilla",
  "salt",
  "baking soda",
  "baking powder",
  "cinnamon",
  "nutmeg",
  "ginger",
  "cocoa powder",
  "honey",
  "maple syrup",
  "olive oil",
  "vegetable oil",
  "coconut oil",
  "peanut butter",
];

const exampleAttributes = [
  "vegan",
  "vegetarian",
  "gluten-free",
  "dairy-free",
  "nut-free",
  "egg-free",
  "soy-free",
  "kosher",
  "halal",
];

const autopopulate = async () => {
  // add example ingredients
  for (const name of exampleIngredients) {
    await prisma.ingredient.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
  // add example attributes
  for (const name of exampleAttributes) {
    await prisma.attribute.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  // add 10 random users
  const users = await Promise.all(
    Array.from({ length: 10 }).map(
      async () =>
        await prisma.user.create({
          data: {
            name: faker.internet.userName(),
            password: faker.internet.password(),
            token: "",
          },
        }),
    ),
  );

  // each user creates 2 recipes with up to 5 random ingredients and 3 random attributes
  for (const user of users) {
    for (let i = 0; i < 2; i++) {
      const ingredientIds = new Set<number>(
        Array.from({ length: 5 }).map(() =>
          faker.number.int({ min: 1, max: 20 }),
        ),
      );
      const attributeIds = new Set<number>(
        Array.from({ length: 3 }).map(() =>
          faker.number.int({ min: 1, max: 9 }),
        ),
      );

      await prisma.recipe.create({
        data: {
          name: faker.lorem.words(3),
          instructions: faker.lorem.sentence(),
          userId: user.id,
          recipeIngredients: {
            createMany: {
              data: [...ingredientIds].map((id) => ({
                ingredientId: id,
              })),
            },
          },
          recipeAttributes: {
            createMany: {
              data: [...attributeIds].map((id) => ({
                attributeId: id,
              })),
            },
          },
        },
      });
    }
  }

  // each user rates up to 5 random recipes
  for (const user of users) {
    [
      ...new Set<number>(
        Array.from({ length: 5 }).map(() =>
          faker.number.int({ min: 1, max: 20 }),
        ),
      ),
    ].forEach(async (id) => {
      await prisma.rating.create({
        data: {
          rating: faker.number.int({ min: 1, max: 5 }),
          userId: user.id,
          recipeId: id,
        },
      });
    });
  }
};

autopopulate();
