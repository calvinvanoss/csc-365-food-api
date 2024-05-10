# Create Recipe flow
Ken, a skilled nutritionist and chef, crafted a delectable vegetarian meal upon a client's request. Witnessing significant weight loss in the client after a month, Ken endeavors to showcase his culinary prowess by sharing the recipe.

Ken creates an account with a POST request to the `/users/signup` endpoint.
Ken creates a new recipe with a POST request to the `/recipes/:id` endpoint.
Ken adds ingredients through POST requests to the `/recipes/:id/ingredients` endpoint.
Ken adds attributes through POST request to the `/ingredients/:id/attributes` endpoint.
Anyone can now send a GET request to the `/recipes/:id` endpoint to view the recipe. 

Having published his recipe online, Ken eagerly anticipates user feedback and ratings.

## Curl Commands
```bash
# User signup
curl -X POST -H "Content-Type: application/json" \
-d '{"name":"Ken", "password":"password"}' \
http://localhost:3000/users/signup
# response: 1
```
```bash
# Create a new recipe
curl -X POST -H "Content-Type: application/json" \
-d '{"name":"Vegetarian Meal", "instructions":"Step by step instructions"}' \
http://localhost:3000/recipes/1
# response: 1
```
```bash
# Add ingredients to the recipe
curl -X POST -H "Content-Type: application/json" \
-d '{"ingredientName":"Ingredient 1"}' \
http://localhost:3000/recipes/1/ingredients
# response: 1
```
```bash
# Add attributes to the ingredient
curl -X POST -H "Content-Type: application/json" \
-d '{"attributeName":"vegetarian"}' \
http://localhost:3000/ingredients/1/attributes
# response: 1
```
```bash
# View the recipe
curl http://localhost:3000/recipes/1
# reponse: {
#     "name":"Vegetarian Meal",
#     "author":{"name":"Ken","id":1},
#     "instructions":"Step by step instructions",
#     "ingredients":["Ingredient 1"],"attributes":["vegetarian"],
#     "rating":null
# }
```
