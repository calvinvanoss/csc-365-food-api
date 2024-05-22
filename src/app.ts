import express from "express";
import usersRouter from "./routes/users";
import recipesRouter from "./routes/recipes";
import attributesRouter from "./routes/attributes";
import ingredientsRouter from "./routes/ingredients";
import { serve, setup } from "swagger-ui-express";
import swaggerDocument from "../swagger.json";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use("/users", usersRouter);
app.use("/recipes", recipesRouter);
app.use("/ingredients", ingredientsRouter);
app.use("/attributes", attributesRouter);

app.use("/docs", serve, setup(swaggerDocument));

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
