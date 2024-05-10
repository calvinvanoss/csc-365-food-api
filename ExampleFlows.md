### Example Flows

#### Create Recipe flow
Ken, a skilled nutritionist and chef, crafted a delectable vegetarian meal upon a client's request. Witnessing significant weight loss in the client after a month, Ken endeavors to showcase his culinary prowess by sharing the recipe.

Ken creates an account with a POST request to the `/users/signup` endpoint.
Ken creates a new recipe with a POST request to the `/recipes/:userId` endpoint.
Ken adds ingredients through POST requests to the `/recipes/:id/ingredients` endpoint.
Ken adds attributes through POST request to the `/ingredients/:id/attributes` endpoint.
Anyone can now send a GET request to the `/recipes/:id` endpoint to view the recipe. 

Having published his recipe online, Ken eagerly anticipates user feedback and ratings.



#### Search for recipe by attribute flow
Karen, a new vegetarian user wants to search for recipes that fits her dietary restrictions.

She first signs up with a POST request to `/users/signup`.
She then searches for vegetarian recipes with a GET request to `/attributes/:name`.
She then looks at one she likes with a GET request to `/recipes/:id`.

She now has all the info she needs to make this vegetarian recipe.

#### Rate recipe flow
Kennedy, an existing user, wants to rate a recipe he recently tried.

He would have previously signed up with `/users/login`.

He first logs in with a POST request to `/users/login`.
He then rates the recipe with a PUT request to `/recipes/:id/rate`.
He can now view the rating with a GET request to `/recipes/:id`.

Now his rating score will affect the overall rating displayed on that recipe.
