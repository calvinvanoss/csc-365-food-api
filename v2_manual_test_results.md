# Search for recipe by attribute flow
Karen, a new vegetarian user wants to search for recipes that fits her dietary restrictions.

She first signs up with a POST request to `/users/signup`.
She then searches for vegetarian recipes with a GET request to `/attributes/:name`.
She then looks at one she likes with a GET request to `/recipes/:id`.

She now has all the info she needs to make this vegetarian recipe.

## Curl Commands
```bash
# User signup
curl -X POST -H "Content-Type: application/json" \
-d '{"name":"Karen", "password":"password"}' \
http://localhost:3000/users/signup
# response: 2
```
```bash
# Search for recipes with vegetarian attribute
curl http://localhost:3000/attributes/vegetarian
# response: [{"name":"Vegetarian Meal","id":1}]
```
```bash
# get more details about recipe
curl http://localhost:3000/recipes/1
# response: {
#    "name":"Vegetarian Meal",
#    "author":{"name":"Ken","id":1},
#    "instructions":"Step by step instructions",
#    "ingredients":["Ingredient 1"],
#    "attributes":["vegetarian"],
#    "rating":null
#}
```

# Rate recipe flow
Kennedy, an existing user, wants to rate a recipe he recently tried.

He would have previously signed up with `/users/login`.

He first logs in with a POST request to `/users/login`.
He then rates the recipe with a PUT request to `/recipes/:id/rate`.
He can now view the rating with a GET request to `/recipes/:id`.

Now his rating score will affect the overall rating displayed on that recipe.

## Curl Commands
```bash
# User signup
curl -X POST -H "Content-Type: application/json" \
-d '{"name":"Kennedy", "password":"password"}' \
http://localhost:3000/users/signup
# response: 3
```
```bash
# User login
curl -X POST -H "Content-Type: application/json" \
-d '{"name":"Kennedy", "password":"password"}' \
http://localhost:3000/users/login
# response: 3
```
```bash
# Rate recipe
curl -X PUT -H "Content-Type: application/json" \
-d '{"userId":"3", "rating":"5"}' \
http://localhost:3000/recipes/1/rate
# response: {"rating":5,"recipeId":1,"userId":3}
```
```bash
# view recipe to see rating
curl http://localhost:3000/recipes/1
# response: {
#    "name":"Vegetarian Meal",
#    "author":{"name":"Ken","id":1},
#    "instructions":"Step by step instructions",
#    "ingredients":["Ingredient 1"],
#    "attributes":["vegetarian"],
#    "rating":5
#}
```
