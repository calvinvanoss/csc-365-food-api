### API Specification

## Users
### `/users/signup` (POST)
Create new user. <br />

**Request**:

```json
{
  "name": "string",
  "password": "string" /* Must be at least 8 characters */
}
```
**Response**:

```json
{
  "token": "string",
  "id": "integer"
}
```
### `/users/login` (POST)
Login existing user. <br />

**Request**:

```json
{
  "name": "string",
  "password": "string"
}
```
**Response**:

```json
{
  "token": "string",
  "id": "integer"
}
```

### `/users/{id}` (GET)
Get recipes associated with given user. <br />

**Response**:

```json
[
  {
    "id" : "integer",
    "name": "string",
    "instructions": "string",
    "id": "integer"
  }
]
```
### `/users/{id}/recommendations` (GET)
Use collaborative filtering to recommend recipes to user. <br />

**Response**:

```json
[
  {
    "id" : "integer",
    "name": "string",
    "instructions": "string",
    "id": "integer"
  }
]
```

## Recipes
### `/recipes/` (POST)
Add a new recipe. <br />

**Request**:

```json
{
  "name": "string",
  "instructions": "string",
  "token": "string"
}
```
**Response**:

```json
{
  "id" : "integer",
  "name": "string",
  "instructions": "string",
  "id": "integer"
}
```
### `/recipes/{id}` (GET)
Retrieve ingredients, attributes, and average rating of recipe. <br />

**Response**:

```json
{
  "name": "string",
  "author":{
    "name": "string",
    "id": "integer"
  },
  "instructions": "string",
  "ingredients": [
    {
      "id": "integer",
      "name": "string"
    }
  ],
  "attributes": [
    {
      "id": "integer",
      "name": "string"
    }
  ],
  "rating": "integer"
}
```
### `/recipes/{id}/ingredients` (POST)
Adds an ingredient to a recipe. Forks the recipe if not the owner. <br />

**Request**:

```json
{
  "name": "string",
  "token": "string"
}
```
**Response**:

```json
{
  "id" : "integer",
  "name": "string",
  "instructions": "string",
  "id": "integer"
}
```
### `/recipes/{id}/ingredients` (DELETE)
Deletes an ingredient from a recipe. Forks the recipe if not the owner. <br />

**Request**:

```json
{
  "name": "string",
  "token": "string"
}
```
**Response**:

```json
{
  "id" : "integer",
  "name": "string",
  "instructions": "string",
  "id": "integer"
}
```
### `/recipes/{id}/attributes` (POST)
Adds an attribute to a recipe. <br />

**Request**:

```json
{
  "name": "string",
  "token": "string"
}
```
**Response**:

```json
{
  "id" : "integer",
  "name": "string",
  "instructions": "string",
  "id": "integer"
}
```
### `/recipes/{id}/attributes` (DELETE)
Deletes an attribute from a recipe. <br />

**Request**:

```json
{
  "name": "string",
  "token": "string"
}
```
**Response**:

```json
{
  "id" : "integer",
  "name": "string",
  "instructions": "string",
  "id": "integer"
}
```
### `/recipes/{id}/rate` (POST)
Adds a rating to a recipe. <br />

**Request**:

```json
{
  "rating": "integer", /* Between 1 and 5 */
  "description": "string",
  "token": "string"
}
```
**Response**:

```json
{
  "success": true
}
```

## Ingredients
### `/ingredients/{name}` (GET)
Get recipes associated with the given ingredient.  <br />

**Response**:

```json
[
  {
    "id" : "integer",
    "name": "string",
    "instructions": "string",
    "id": "integer"
  }
]
```

## Attributes
### `/attributes/{name}` (GET)
Gets recipes associated with the given attribute. <br />

**Response**:

```json
[
  {
    "id" : "integer",
    "name": "string",
    "instructions": "string",
    "id": "integer"
  }
]
```
