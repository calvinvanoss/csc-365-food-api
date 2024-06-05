# Fake Data Modeling
- run npm run populate
- runs the scripts/autopopulate.ts file
- 100 example ingredients are added
- 40 example attributes are added
- 50,000 users are created
- each user creates 2 recipes for 100,000 recipes
- each recipe gets 5 random ingredients for 500,000 recipeIngredients
- each recipe gets 2 random attributes for 200,000 recipeAttributes
- each user rates 10 recipes for 500,000 ratings
- 1,350,140 total entries

# Performance results of hitting endpoints
- POST /users/signup - 0.023664
- POST /users/login - 0.015701
- GET /users/{id} - 0.040200
- GET /users/{id}/recommendations - 0.592773
- POST /recipes/ - 0.020878
- GET /recipes/{id} - 0.023345
- POST /recipes/{id}/ingredients - 0.075630
- DELETE /recipes/{id}/ingredients - 0.074789
- POST /recipes/{id}/attributes - 0.023204
- DELETE /recipes/{id}/attributes - 0.057083
- PUT /recipes/{id}/rate - 0.078964
- GET /ingredients/{id} - 0.013333
- GET /attributes/{id} - 0.011917

# Performance tuning
## GET /users/{id}/recommendations
- query plan before
1. Hash Cond: (ratings.user_id = "ANY_subquery".user_id)
2. Seq Scan on ratings
3. Subquery Scan on "ANY_subquery"
4. Parallel Seq Scan on ratings target_user_ratings
5. Bitmap Heap Scan on ratings similar_user_ratings
6. Bitmap Index Scan on ratings_pkey
7. Index Scan using recipes_pkey on recipes
8. Hash Cond: (recipe_ingredients.ingredient_id = "ANY_subquery_1".ingredient_id)
9. Index Only Scan using recipe_ingredients_pkey on recipe_ingredients
10. Subquery Scan on "ANY_subquery_1"
11. Parallel Seq Scan on ratings ratings_1
12. Index Only Scan using recipes_pkey on recipes recipes_1
13. Index Only Scan using recipe_ingredients_pkey on recipe_ingredients recipe_ingredients_1
14. Hash Cond: (recipe_attributes_1.attribute_id = recipe_attributes.attribute_id)
15. Parallel Seq Scan on ratings ratings_2
16. Index Only Scan using recipes_pkey on recipes recipes_2
17. Index Only Scan using recipe_attributes_pkey on recipe_attributes recipe_attributes_1
18. Index Only Scan using recipe_attributes_pkey on recipe_attributes
- index changes
1. changed composite key index from @@id([recipeId, userId]) to @@id([userId, recipeId])
- query plan after
1. Hash Cond: (similar_user_ratings.recipe_id = target_user_ratings.recipe_id)
2. Parallel Seq Scan on ratings similar_user_ratings
3. Index Scan using ratings_pkey on ratings target_user_ratings
4. Index Scan using ratings_pkey on ratings
5. Index Scan using recipes_pkey on recipes
6. Hash Cond: (recipe_ingredients.ingredient_id = "ANY_subquery".ingredient_id)
7. Index Only Scan using recipe_ingredients_pkey on recipe_ingredients
8. Subquery Scan on "ANY_subquery"
9. Index Only Scan using ratings_pkey on ratings ratings_1
10. Index Only Scan using recipes_pkey on recipes recipes_1
11. Index Only Scan using recipe_ingredients_pkey on recipe_ingredients recipe_ingredients_1
12. Hash Cond: (recipe_attributes.attribute_id = "ANY_subquery_1".attribute_id)
13. Index Only Scan using recipe_attributes_pkey on recipe_attributes
14. Subquery Scan on "ANY_subquery_1"
15. Index Only Scan using ratings_pkey on ratings ratings_2
16. Index Only Scan using recipes_pkey on recipes recipes_2
17. Index Only Scan using recipe_attributes_pkey on recipe_attributes recipe_attributes_1
- performance improvement: 0.592773 -> 0.059477
## POST /recipes/{id}/ingredients
- query plan before
1. Seq Scan on users
- index changes
1. CREATE INDEX idx_users_token ON users(token);
- query plan after
1. Index Scan using idx_users_token on users
- performance improvement: 0.075630 -> 0.032152
## PUT /recipes/{id}/rate
- query plan before
1. Seq Scan on users
- index changes
1. CREATE INDEX idx_users_token ON users(token);
- query plan after
1. Index Scan using idx_users_token on users
- performance improvement: 0.078964  -> 0.027830