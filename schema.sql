-- derived from prisma/schema.prisma

CREATE TABLE User (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE Recipe (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    instructions TEXT,
    userId INT NOT NULL,
    FOREIGN KEY (userId) REFERENCES User(id)
);

CREATE TABLE RecipeIngredient (
    recipeId INT NOT NULL,
    ingredientId INT NOT NULL,
    FOREIGN KEY (recipeId) REFERENCES Recipe(id) ON DELETE CASCADE,
    FOREIGN KEY (ingredientId) REFERENCES Ingredient(id) ON DELETE CASCADE,
    PRIMARY KEY (recipeId, ingredientId)
);

CREATE TABLE Ingredient (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE IngredientAttribute (
    ingredientId INT NOT NULL,
    attributeId INT NOT NULL,
    FOREIGN KEY (ingredientId) REFERENCES Ingredient(id) ON DELETE CASCADE,
    FOREIGN KEY (attributeId) REFERENCES Attribute(id) ON DELETE CASCADE,
    PRIMARY KEY (ingredientId, attributeId)
);

CREATE TABLE Attribute (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE Rating (
    rating INT,
    recipeId INT NOT NULL,
    userId INT NOT NULL,
    FOREIGN KEY (recipeId) REFERENCES Recipe(id) ON DELETE CASCADE,
    FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE,
    PRIMARY KEY (recipeId, userId)
);