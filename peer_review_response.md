### Code Review Comments
#### We tokenized users, hashed passwords, and added character mins to address the following:
- no hashing or salting of passwords. 
- no limit to name or password besides the limitations of sql's TEXT, which can take 255 characters. 
- empty strings can be inputted for username and password. 
- a minimum password character minimum should be established for password. 
- there does not appear to be any tools for authenticating users during actions, there is the /:id included with the API call, but that is not an imposing barrier against someone adjusting the id before the call.
- there is no purpose to login at the moment without user restrictions based on sign in.
- Looking at your recipes.ts, it seems that all the way to post information include only knowing the id – if anyone knows the id or puts in a random id, they can change whatever they want about the recipe maliciously – you should add in user authentication as well when creating a recipe
- It looks like you are storing the user password in plain text when signing up – to protect their information consider hashing and adding a salt before storing it 
ingredients/:id/attributes – just knowing the id of an ingredient would allow someone to add attributes to it (malicious behavior) – consider authenticating and attaching user info to the changes made so if there is a ‘troll’, you can take appropriate measures when misinformation is brought to your attention
- recipe/:id/rate – anyone could put in a random user id and leave a negative/positive review – consider adding authentication with the user and password you create in users and returning the rating with the user’s user and not the id

#### The following were ignored individually for various reasons explained with each bullet point:
- can post the same recipe over and over with the same attributes. - ignore (true because recipes can have different attributes)
- while testing non unique usernames against signup, they were correctly denied but the primary key was still incremented. This normally would not be an issue, but that is a pretty easy issue to implement and further, to mass produce. Someone with ill intent could speed up the primary key usage by sending several requests across multiple servers for a non unique name. - ignore
- recipes/:id (post): suggest returning the recipe ID AND the recipe name so the user can make sure that they correctly inputted the recipe - non concern, if there was a frontend, it would show up on there
- recipes/:id/ingredient: similar suggestions on returning the name of the ingredient as well as the id in the json response  - non concern, if there was a frontend, it would show up on there
- There are more but I believe you get the idea.. - non concern, if there was a frontend, it would show up on there

### Schema/API Design Comments
#### We updated our APISpec.md to reflect the following comments. Some were irrelevent with schema changes, which were also updated in the APISpec.md:
- just want to update APISpec.md from these suggestions
- /recipes/ (POST) : still has "average_rating" listed as a value to be passed into creating a new recipe.
- /recipes/{recipe_id} (GET) : APISpecs different from application. No recipe_id, incredient_id has become ingredient list, and now there is an attribute list.
- /ingredients (POST) : has transformed from requiring the name and all hard-coded attribute booleans, into an attribute list which is appended to each ingredient.
- /users/login (POST) : returns str on failure and id on success, not boolean.
- /users/{user_id} (GET) and (POST) : seems like these were ideas that were added to the docs within the intial plannings phase, but were later tossed out (or maybe just not implemented yet) during v2. (POST) is stated as being an update functionality, but all it is from the specs is a (GET) that can access any username and password since "POST" just takes id.


#### The following were ignored individually for various reasons explained with each bullet point:
- For your recipes you have an ingredient list, but how would a user know how much of an ingredient to use in the recipe? I suggest adding a quantity column to RecipeIngredient - supposed to be specified in instructions column of recipe table
- Also, quantity means nothing without units (1 bowl? 1 cup? 1 g? 1 house?) so I would suggest also adding a units column (think back to one of the quizzes we took in class) to RecipeIngredient - supposed to be specified in instructions column of recipe table
- Similarly, for recipes, you would usually have instructions. I see you have an instructions field but it doesn’t seem feasible for long instructions (like longer than one line, ordered by steps) Perhaps you could create a separate instructions table with a foreign key to the recipe that also has a field for step number that separates the steps from one big paragraph? - this will not enhance functionality at all: no need to query for specific steps
- Consider adding a reset function as well as inserting some premade data on schema creation so you can test more easily (like some base recipes, a base user) for easier testing - beyond scope of project

#### The following were irrelevent with our new schema changes, or out of scope:
- /ingredients/ (POST) gives a lot of freedom to the user in providing information on attribute characteristics, I think this poses a risk as the API becomes more complex and more widely used. For one, there is the risk of several offshoots of the same term. Example, Beef, beef, bef, bEef, bEEf, beeF, etc. etc. are all the same specified ingredient, but the names will all appear to other users by their alloted names, which can cause confusion. I suggest having a table for ingredients by themselves, which would contain a unique primary key id, name of ingredient, and its attributes, and another table to handle the connection between ingredients and recipes. In this manner, the schema is a more positive evaluation model that only allows a limited amount of ingredients (that can be increased through another feature, such as flags or requests to moderators) rather than allowing all ingredients through and creating a mess for moderators to clean up later. This also fixes the issue of ingredients being assigned improper attributes.
- TABLE RecipeIngredient : it is unclear how much of each ingredient is needed for the recipe, so maybe include a column for quantity and measurement.
- TABLE Recipe : it would be nice to have a completion time of the recipe.
- TABLE Rating : maybe include the timestamp of the ratings, to give users an idea of how recent ratings have been compared to prior ratings (has it improved?).
maybe have a method of updating/deleting a recipe.
- and of deleting or updating a user (given /user/{user_id} (POST) does not work as intended).
- there is a means of overwriting a review, but not of deleting a review, which could pose problems for a user who wants to erase their data from the service.
- adding in a seed.sql (or whatever files prisma supports) will make it faster in testing more complex cases since it removes the obstacle of having to account for an empty table at the start of db boot up.
- it might be nice to have a reset function that can bring all the data back to square 1 or 0 (at the baseline of seed.sql or no info).
