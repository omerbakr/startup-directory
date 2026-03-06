import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { users } from "#models/user.model.js";
import { db } from "#config/database.js";
import logger from "#config/logger.js";

export const hashPassword = async password => {
  try {
    return await bcrypt.hash(password, 12);
  } catch (e) {
    logger.error(`Error hashing password: ${e}`);
    throw new Error("Failed to hash password", { cause: e });
  }
};

export const comparePassword = async (password, hashedPassword) => {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (e) {
    logger.error(`Error comparing password: ${e}`);
    throw new Error("Failed to compare password", { cause: e });
  }
};

export const createUser = async ({ name, email, password, role = "user" }) => {
  try {
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      throw new Error("User with this email already exists");
    }

    const hashedPassword = await hashPassword(password);

    const [newUser] = await db
      .insert(users)
      .values({ name, email, password: hashedPassword, role })
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        createdAt: users.createdAt,
      });

    logger.info(`User created successfully: ${newUser.email}`);
    return newUser;
  } catch (e) {
    logger.error(`Error creating user: ${e}`);
    throw new Error("Failed to create user", { cause: e });
  }
};

export const authenticateUser = async ({ email, password }) => {
  try {
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!existingUser) {
      throw new Error("User not found");
    }

    const isPasswordValid = await comparePassword(
      password,
      existingUser.password
    );

    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    logger.info(`User ${existingUser.email} authenticated successfully`);
    return {
      id: existingUser.id,
      name: existingUser.name,
      email: existingUser.email,
      role: existingUser.role,
      createdAt: existingUser.createdAt,
    };
  } catch (e) {
    logger.error(`Error authenticating user: ${e}`);
    throw new Error("Authentication failed", { cause: e });
  }
};
