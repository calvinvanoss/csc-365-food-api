### Example Flows

#### Create Recipe flow


#### Search for recipe flow
A new vegan user wants to search for recipes.
- She first signs up with a `POST users/signup`
- She then updates her dietary restrictions to exclude animal products with `POST users/{user_id}`  
- She calls a recipe search with `GET recipes/{recipe_id}`
- The recipe search function calls a `GET users/{user_id}` to query excluding her dietary restrictions
- She can then look through the returned recipes 


#### Rate recipe flow
