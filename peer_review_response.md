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

#### We added the Swagger UI to address the following:
- running curl statements at this point of time was not a large issue, but as you add on more complexity it would be nicer to have a supporting UI to make navigating endpoints easier. 
- I suggest having an external site where you can run testing rather than just testing locally because it was a little difficult testing out your code using curl statements from the command line 


#### We updated error handling improved messaging to address the following:
- The error messages are a little vague and could help out more by printing information related to the object rejected or at the very least the id. 
- The responses you get for your API calls are in general unclear – ex. In ver 1 test results most of the responses are 1, which does not provide useful info
- I appreciate your error checking with the try and catch blocks but I think it would be helpful to also add print statements/json responses that explain what you were trying to do when the error occurred for easier debugging purposes 

#### The following were addressed individually with self explanatory changes:
- Quite a few of the functions send an id as a response, but it is not always clear what table the id is from, I think this can be cleared up with more comments throughout the code. 
- can make a recipe with an empty name. 
- can give ratings outside the realm of 1-10, so ex. -5, or 100. 
- recipe/:id – To create a recipe, how would the user know which id hasn’t been used yet to create a recipe? Perhaps you should have the user put in the recipe information and automatically generate the next available id and assign it to this recipe 
- recipe:/id/ingredients – it is tedious to add ingredients one by one – is there any way to pass a list of ingredients to add it all at once to a recipe? It would also be less work for the database to insert a single time rather than repeating 
- I am confused on how signing in is related to creating a recipe – when you create a recipe there seems to be no field for user id? So I suppose there isn’t an author associated when creating the recipe but later on I see one of your responses return the recipe with the author so I am confused on how you know who created the recipe without an implicit field that asks for id 
- users/login: suggest returning something like “Invalid login: wrong password” if there is a user that matches but the password is incorrect. Also on success, I suggest returning something like “Successfully logged in user” 

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

#### The following were addressed with schema changes:
- I would suggest adding more comments in general to your API design such as what an attribute is because it is a little confusing the difference between ingredients and attributes (are attributes like vegan?) 
- I am still unsure about what ingredient attribute is but in attributes/:name it seems like you just find all recipes with an ingredient that has that attribute – what if I give carrot a Vegan attribute in one recipe? This call seems like it will return all recipes with carrots even if the recipe contains meat if you search for ‘Vegan’ 
- I think you could add an optional column to rating that is something like “comment” in case a user wants to explain why they gave that rating 
- How would a user know which attributes there are? I suggest putting a get request where users can get a catalog of what categories there are 
- Are there limitations to what attributes there are for ingredients? – it seems like it based on your APISpec – If so, I suggest having a preset catalog and then the user can assign the catalog id of the attribute to the ingredient or else a user could just randomly make up a category like “good to eat on Wednesdays” rather than just your general “gluten-free”, etc. 
- I see in your API spec that you have average_rating for recipes returned when you get a recipe between 1-10 – I think it is more standard to rate out of 5 stars but this is a minor suggestion – perhaps make it more clear by returning the scale it is measured by such as 10/10 or 4 out of 5 stars - add limitations to rating 
- Recipes can change – is there any way to update your databases through your API? If not consider having functions where you can add/delete ingredients or provide substitutions - update recipe endpoint 
- I see when ingredients are added to a recipe, you upsert it into your ingredient table → consider setting a format for ingredients (i.e. all lower or upper case) or else I think it could be that ‘carrot’ and ‘Carrot’ are two separate ingredients 

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
