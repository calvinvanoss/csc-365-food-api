### API Specification

## Users
### `/users/signup` (POST)
Create new user.
### `/users/login` (POST)
Login existing user. <br />
**Request**:

```json
[
  {
    "user_name": "string",
    "password": "string"
  }
]
```
**Response**:

```json
{
    "success": "boolean"
}
```

### `/users/{user_id}` (POST)
Update user profile.

**Request**:

```json
[
  {
    "user_id": "integer"
  }
]
```
**Response**:

```json
{
    "user_id": "integer",
    "user_name": "string",
    "password": "string"
}
```
### `/users/{user_id}` (GET)
Retrieve information about a given user. <br />
**Response**:

```json
[
    {
        "user_id": "integer",
        "user_name": "string",
        "password": "string"
    }
]
```

## Ingredients
### `/ingredients/` (POST)
Add a new ingredient.
### `/ingredients/{ingredient_id}` (GET)
Retrieve information about a given ingredient.  <br />
**Response**:

```json
[
    {
        "ingredient_id": "integer",
        "ingredient_name": "string",
        "vegetarian": "boolean",
        "gluten-free": "boolean",
        "vegan": "boolean",
        "keto": "boolean",
        "vegetarian": "boolean",
        "allergies": "text"
    }
]
```

## Recipes
### `/recipes/` (POST)
Add a new recipe.
### `/recipes/{recipe_id}` (GET)
Retrieve information about a given recipe. <br />
**Response**:

```json
[
    {
        "recipe_id": "integer",
        "recipe_name": "string",
        "ingredient_id": "integer",
        "recipe_instructions": "string",
        "average_rating": "integer", /* Between 1 and 10 */
    }
]
```

## Ratings
### `/ratings/{recipe_id}` (POST)
User assigns rating to recipe.
