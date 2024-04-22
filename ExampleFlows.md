### Example Flows

#### Create Recipe flow
Ken, a skilled nutritionist and chef, crafted a delectable low-calorie meal upon a client's request. Witnessing significant weight loss in the client after a month, Ken endeavors to showcase his culinary prowess by sharing the recipe.

Initiating with a POST request to the `/recipes/` endpoint, Ken systematically adds ingredients through subsequent POST requests to the `/ingredients/` endpoint. 

Having published his recipe online, Ken eagerly anticipates user feedback and ratings.



#### Search for recipe flow
A new vegan user wants to search for recipes.
- She first signs up with a `POST users/signup`
- She then updates her dietary restrictions to exclude animal products with `POST users/{user_id}`  
- She calls a recipe search with `GET recipes/{recipe_id}`
- The recipe search function calls a `GET users/{user_id}` to query excluding her dietary restrictions
- She can then look through the returned recipes 


#### Rate recipe flow
An existing user wants to rate a recipe which he had previously searched for and then cooked.
- He first logs in with `POST users/login`
- He then assigns a rating to the recipe he used with `POST ratings/{recipe_id}`
