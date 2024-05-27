# Concurrency Control Mechanisms

### Case 1: Dirty Read Phenomenon
**Scenario**: In the `/recipes/:id/ingredients` endpoint, a user adds an ingredient to a recipe. However, 
if another user simultaneously adds the same ingredient to the same recipe, one of the transactions may 
read an outdated state of the recipe's ingredients, leading to a dirty read if the first transaction is 
rolled back.  
**Sequence Diagram**:
```mermaid
sequenceDiagram
    participant User1 as /recipes/:id/ingredients (User 1)
    participant DB as Database
    participant User2 as /recipes/:id/ingredients (User 2)
    Note over User1, User2: Initial state: Recipe has no ingredients
    User1->>DB: SELECT recipe_ingredients FROM recipe WHERE id = :id (reads empty)
    User2->>DB: SELECT recipe_ingredients FROM recipe WHERE id = :id (reads empty)
    User1->>DB: UPDATE recipe_ingredients SET ingredient = 'Ingredient A' WHERE id = :id
    User2->>DB: UPDATE recipe_ingredients SET ingredient = 'Ingredient A' WHERE id = :id
    User1->>DB: ROLLBACK
    User2->>DB: SELECT recipe_ingredients FROM recipe WHERE id = :id (reads 'Ingredient A')
    Note over User1, User2: User 2 reads the incorrect state (Ingredient A) due to dirty read.)
```
### Case 2: Non-Repeatable Read Phenomenon:
**Scenario**: The `/recipes/:id/attributes` endpoint adds an attribute to a recipe. If another user 
concurrently deletes the same attribute from the recipe, one of the transactions may read an 
inconsistent state of the recipe's attributes, leading to a non-repeatable read if the first 
transaction is rolled back.  
**Sequence Diagram**:
```mermaid
sequenceDiagram
    participant User1 as /recipes/:id/attributes (User 1)
    participant DB as Database
    participant User2 as /recipes/:id/attributes (User 2)
    Note over User1, User2: Initial state: Recipe has no attributes
    User1->>DB: SELECT recipe_attributes FROM recipe WHERE id = :id (reads empty)
    User2->>DB: SELECT recipe_attributes FROM recipe WHERE id = :id (reads empty)
    User1->>DB: UPDATE recipe_attributes SET attribute = 'Attribute A' WHERE id = :id
    User2->>DB: DELETE FROM recipe_attributes WHERE attribute = 'Attribute A' AND id = :id
    User1->>DB: ROLLBACK
    User2->>DB: SELECT recipe_attributes FROM recipe WHERE id = :id (reads empty)
    Note over User1, User2: User 2 reads the incorrect state (empty) due to non-repeatable read.
```
### Case 3: Phantom Read Phenomenon:
**Scenario**: The `/recipes/:id/rate` endpoint allows users to rate a recipe. If two users rate the same 
recipe concurrently, one of the transactions may read an inconsistent state of the recipe's ratings, 
leading to a phantom read if the first transaction is rolled back.  
**Sequence Diagram**:
```mermaid
sequenceDiagram
    participant User1 as /recipes/:id/rate (User 1)
    participant DB as Database
    participant User2 as /recipes/:id/rate (User 2)
    Note over User1, User2: Initial state: Recipe has no ratings
    User1->>DB: SELECT AVG(rating) FROM rating WHERE recipe_id = :id (reads null)
    User2->>DB: SELECT AVG(rating) FROM rating WHERE recipe_id = :id (reads null)
    User1->>DB: INSERT INTO rating (recipe_id, rating) VALUES (:id, 5)
    User2->>DB: INSERT INTO rating (recipe_id, rating) VALUES (:id, 4)
    User1->>DB: ROLLBACK
    User2->>DB: SELECT AVG(rating) FROM rating WHERE recipe_id = :id (reads 4)
    Note over User1, User2: User 2 reads the incorrect state (rating = 4) due to phantom read.
```
