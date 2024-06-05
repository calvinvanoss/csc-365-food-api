import { PrismaClient, Recipe, Prisma } from "@prisma/client";
import express, { Request, Response } from "express";
import { hash, generateToken } from "../utils/users";

const usersRouter = express.Router();
const prisma = new PrismaClient();

usersRouter.post("/signup", async (req: Request, res: Response) => {
  // #swagger.summary = 'create user'
  const { name, password } = req.body;

  if (password.length < 8) {
    res.status(400).json("password must be at least 8 characters");
    return;
  }

  try {
    const user = await prisma.user.create({
      data: {
        name,
        password: hash(password),
        token: generateToken(name),
      },
    });
    res.json({ token: user.token });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        res.status(400).json("User with the same name already exists");
      } else {
        res.status(500).json("An error occurred while creating the user");
      }
    } else {
      res.status(500).json("An error occurred while creating the user");
    }
  }
});

usersRouter.post("/login", async (req: Request, res: Response) => {
  // #swagger.summary = 'login user to get auth token'
  const { name, password } = req.body;

  try {
    const user = await prisma.user.findFirstOrThrow({
      where: {
        name,
        password: hash(password),
      },
    });

    res.json({ token: user.token });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      res.status(400).json("Invalid username or password");
    } else {
      res.status(500).json("An error occurred while logging in");
    }
  }
});

usersRouter.get("/:id", async (req: Request, res: Response) => {
  // #swagger.summary = 'get recipes associated with given user'
  const { id } = req.params;

  try {
    const user = await prisma.user.findUniqueOrThrow({
      where: {
        id: parseInt(id),
      },
      include: {
        recipes: true,
      },
    });
    res.json(user.recipes);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      res.status(404).json("User not found");
    } else {
      res.status(500).json("An error occurred while retrieving user recipes");
    }
  }
});

usersRouter.get("/:id/recommendations", async (req: Request, res: Response) => {
  // #swagger.summary = 'use collaborative filtering to recommend recipes to user'
  const { id } = req.params;
  const userId = parseInt(id);

  try {
    const recommendations = await prisma.$queryRaw<Recipe[]>`
      SELECT * FROM recipes where id in ( -- get 10 highest rated recipes by similar users
          SELECT ratings.recipe_id from ratings
          WHERE ratings.user_id in ( -- get 5 most similar users
              SELECT similar_user_ratings.user_id
              FROM ratings target_user_ratings
              JOIN ratings similar_user_ratings ON target_user_ratings.recipe_id = similar_user_ratings.recipe_id
              WHERE target_user_ratings.user_id = ${userId}
              AND similar_user_ratings.user_id <> ${userId}
              AND ABS(target_user_ratings.rating - similar_user_ratings.rating) <= 1
              GROUP BY similar_user_ratings.user_id
              ORDER BY COUNT(*) DESC
              LIMIT 5
          )
          GROUP BY recipe_id
          ORDER BY max(rating) desc
          LIMIT 10
      )
      AND recipes.user_id <> ${userId}
      ORDER BY (( -- count of common ingredients
          SELECT COUNT(*) FROM recipe_ingredients
          WHERE recipe_ingredients.recipe_id = recipes.id
          AND recipe_ingredients.ingredient_id in (
              SELECT recipe_ingredients.ingredient_id
                  FROM ratings
                  JOIN recipes ON ratings.recipe_id = recipes.id
                  JOIN recipe_ingredients ON recipes.id = recipe_ingredients.recipe_id
                  WHERE ratings.user_id = ${userId}
                  GROUP BY recipe_ingredients.ingredient_id
                  ORDER BY COUNT(*) DESC
                  LIMIT 5
          )) + ( -- count of common attributes
          SELECT COUNT(*) FROM recipe_attributes
          WHERE recipe_attributes.recipe_id = recipes.id
          AND recipe_attributes.attribute_id in (
              SELECT recipe_attributes.attribute_id
                  FROM ratings
                  JOIN recipes ON ratings.recipe_id = recipes.id
                  JOIN recipe_attributes ON recipes.id = recipe_attributes.recipe_id
                  WHERE ratings.user_id = ${userId}
                  GROUP BY recipe_attributes.attribute_id
                  ORDER BY COUNT(*) DESC
                  LIMIT 3
          ))) DESC
      LIMIT 5
      `;

    res.json(recommendations);
  } catch (error) {
    res.status(500).json("An error occurred while retrieving recommendations");
  }
});

export default usersRouter;
