import { createHash } from "crypto";
import { sign } from "jsonwebtoken";

const generateToken = (name: string) => {
  return sign({ name }, process.env.JWT_SECRET!);
};

const hash = (password: string) => {
  return createHash("sha256").update(password).digest("hex");
};

export { generateToken, hash };
