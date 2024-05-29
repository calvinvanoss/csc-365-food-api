### API Specification

## Users
### `/users/signup` (POST)
Create new user. <br />

**Request**:

```json
{
  "user_name": "string",
  "password": "string" /* Must be at least 8 characters */
}
```
**Response**:

```json
{
  "user_token": "token"
}
```
### `/users/login` (POST)
Login existing user. <br />

**Request**:

```json
{
  "user_name": "string",
  "password": "string"
}
```
**Response**:

```json
{
  "user_token": "token"
}
```

### `/users/{user_id}` (GET)
Get recipes associated with given user. <br />

**Response**:

```json
[
  {
    "recipe_id" : "integer",
    "name": "string",
    "instructions": "string",
    "user_id": "integer"
  }
]
```
### `/users/{user_id}/recommendations` (GET)
Use collaborative filtering to recommend recipes to user. <br />

**Response**:

```json
[
  {
    "recipe_id" : "integer",
    "name": "string",
    "instructions": "string",
    "user_id": "integer"
  }
]
```

## Ingredients
### `/ingredients/{ingredient_id}` (GET)
Retrieve information about a given ingredient.  <br />

**Response**:

```json
[
  {
    "recipe_id" : "integer",
    "name": "string",
    "instructions": "string",
    "user_id": "integer"
  }
]
```

## Recipes
### `/recipes/` (POST)
Add a new recipe. <br />

**Request**:

```json
{
  "recipe_name": "string",
  "recipe_instructions": "string",
}
```
**Response**:

```json
{
  "recipe_id" : "integer",
  "name": "string",
  "instructions": "string",
  "user_id": "integer"
}
```
### `/recipes/{recipe_id}` (GET)
Retrieve ingredients, attributes, and average rating of recipe. <br />

**Response**:

```json
{
  "recipe_name": "string",
  "author":{
    "user_name": "string",
    "user_id": "integer"
  },
  "instructions": "string",
  "ingredients": [
    {
      "ingredient_id": "integer",
      "ingredient_name": "string"
    }
  ],
  "attributes": [
    {
      "attribute_id": "integer",
      "attribute_name": "string"
    }
  ],
  "rating": "integer"
}
```
### `/recipes/{recipe_id}/ingredients` (POST)
Adds an ingredient to a recipe. Forks the recipe if not the owner. <br />

**Request**:

```json
{
  "ingredient_name": "string"
}
```
**Response**:

```json
{
  "recipe_id" : "integer",
  "name": "string",
  "instructions": "string",
  "user_id": "integer"
}
```
### `/recipes/{recipe_id}/ingredients` (DELETE)
Deletes an ingredient from a recipe. Forks the recipe if not the owner. <br />

**Request**:

```json
{
  "ingredient_name": "string"
}
```
**Response**:

```json
{
  "recipe_id" : "integer",
  "name": "string",
  "instructions": "string",
  "user_id": "integer"
}
```
### `/recipes/{recipe_id}/attributes` (POST)
Adds an attribute to a recipe. <br />

**Request**:

```json
{
  "attribute_name": "string"
}
```
**Response**:

```json
{
  "recipe_id" : "integer",
  "name": "string",
  "instructions": "string",
  "user_id": "integer"
}
```
### `/recipes/{recipe_id}/attributes` (DELETE)
Deletes an attribute from a recipe. <br />

**Request**:

```json
{
  "attribute_name": "string"
}
```
**Response**:

```json
{
  "recipe_id" : "integer",
  "name": "string",
  "instructions": "string",
  "user_id": "integer"
}
```
### `/recipes/{recipe_id}/rate` (POST)
Adds a rating to a recipe. <br />

**Request**:

```json
{
  "rating": "integer", /* Between 1 and 5 */
  "description": "string"
}
```
**Response**:

```json
{
  "success": true
}
```
## Attributes
### `/attributes/{name}` (GET)
Gets recipes associated with the given attribute. <br />

**Response**:

```json
[
  {
    "recipe_id" : "integer",
    "name": "string",
    "instructions": "string",
    "user_id": "integer"
  }
]
```