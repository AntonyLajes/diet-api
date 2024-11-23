"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/app.ts
var app_exports = {};
__export(app_exports, {
  app: () => app
});
module.exports = __toCommonJS(app_exports);
var import_fastify = __toESM(require("fastify"), 1);

// src/error/AuthError.ts
var AuthError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "AuthError";
    Error.captureStackTrace(this, this.constructor);
  }
};
var AuthError_default = AuthError;

// src/auth/AuthService.ts
var import_bcrypt = __toESM(require("bcrypt"), 1);
var import_jsonwebtoken = __toESM(require("jsonwebtoken"), 1);
var AuthService = class {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }
  async register(user) {
    const userExists = await this.userRepository.findByEmail(user.email);
    if (userExists) throw new AuthError_default("Email already in used by another user.");
    const createdUser = await this.userRepository.register(user);
    return createdUser;
  }
  async login(user) {
    const userExists = await this.userRepository.findByEmail(user.email);
    if (!userExists) throw new AuthError_default("User not found.");
    const isSamePassoword = import_bcrypt.default.compareSync(user.password, userExists.password);
    if (!isSamePassoword) throw new AuthError_default("Invalid password.");
    const token = import_jsonwebtoken.default.sign({ id: userExists.id, email: userExists.email }, "autenticacao-jwt", { expiresIn: "1d" });
    return { token, user: userExists };
  }
  async verifyToken(token) {
    const decodedToken = import_jsonwebtoken.default.verify(token, "autenticacao-jwt");
    if (typeof decodedToken !== "string" && decodedToken.email) {
      const user = await this.userRepository.findByEmail(decodedToken.email);
      return user;
    }
    return void 0;
  }
};

// src/database.ts
var import_knex = __toESM(require("knex"), 1);

// env/index.ts
var import_config = require("dotenv/config");
var import_zod = require("zod");
var envSchema = import_zod.z.object({
  NODE_ENV: import_zod.z.enum(["development", "test", "production"]).default("production"),
  DATABASE_URL: import_zod.z.string(),
  DB_CLIENT: import_zod.z.enum(["sqlite", "pg"]).default("sqlite")
});
var _env = envSchema.safeParse(process.env);
if (!_env.success) {
  console.log(`Error: Invalid environment variable: ${_env.error.format()}`);
  throw new Error(`Invalid environment variable: ${_env.error.format()}`);
}
var env = _env.data;

// src/database.ts
console.log(`env.DB_CLIENT => ${env.DB_CLIENT}`);
var config = {
  client: env.DB_CLIENT,
  connection: env.DB_CLIENT === "sqlite" ? {
    filename: env.DATABASE_URL
  } : env.DATABASE_URL,
  useNullAsDefault: true,
  migrations: {
    directory: "./db/migrations",
    extension: "ts"
  }
};
var knex = (0, import_knex.default)(config);

// src/user/UserRepository.ts
var UserRepository = class {
  constructor(database) {
    this.database = database;
  }
  async findByEmail(email) {
    return await knex("users").where("email", email).first();
  }
  async register(user) {
    return await knex("users").insert(user).returning("*");
  }
};

// src/diets/DietRepository.ts
var DietRepository = class {
  constructor(database) {
    this.database = database;
  }
  async save(diet) {
    return await this.database("diets").insert(diet).returning("*");
  }
  async update(diet) {
    return await this.database("diets").where(
      {
        user_id: diet.user_id,
        id: diet.id
      }
    ).update(diet).returning("*");
  }
  async delete(id) {
    return await this.database("diets").where("id", id).delete();
  }
  async findAll(userId) {
    return await this.database("diets").where("user_id", userId).select("*");
  }
  async findById(userId, id) {
    return await this.database("diets").where({ id, user_id: userId }).returning("*");
  }
  async findByOnADiet(userId, on_a_diet) {
    return await this.database("diets").where({ user_id: userId, on_a_diet }).returning("*");
  }
};

// src/error/DietError.ts
var DietError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "DietError";
    Error.captureStackTrace(this, this.constructor);
  }
};
var DietError_default = DietError;

// src/diets/DietService.ts
var DietService = class {
  constructor(dietRepository) {
    this.dietRepository = dietRepository;
  }
  async save(diet) {
    return await this.dietRepository.save(diet);
  }
  async update(diet) {
    return await this.dietRepository.update({
      id: diet.id,
      title: diet.title,
      description: diet.description,
      on_a_diet: diet.on_a_diet,
      user_id: diet.user_id
    });
  }
  async delete(id) {
    const deleteCode = await this.dietRepository.delete(id);
    if (deleteCode === 0) throw new DietError_default("Diet not found.");
    return deleteCode;
  }
  async findAll(userId) {
    return await this.dietRepository.findAll(userId);
  }
  async findById(userId, id) {
    return await this.dietRepository.findById(userId, id);
  }
  async findTotalDiets(userId) {
    return await this.findAll(userId);
  }
  async findOnADiet(userId, on_a_diet) {
    return await this.dietRepository.findByOnADiet(userId, on_a_diet);
  }
  async findBestSequence(userId) {
    const diets = await this.dietRepository.findAll(userId);
    let bestSequencyDiets = [];
    let currentSequencyDiets = [];
    for (const diet of diets) {
      if (diet.on_a_diet) {
        currentSequencyDiets.push(diet);
        if (currentSequencyDiets.length > bestSequencyDiets.length) {
          bestSequencyDiets = [...currentSequencyDiets];
        }
      } else {
        currentSequencyDiets = [];
      }
    }
    return bestSequencyDiets;
  }
};

// src/diets/DietController.ts
var import_crypto = require("crypto");
var DietController = class {
  constructor(dietService) {
    this.dietService = dietService;
  }
  async save(request) {
    const { title, description, on_a_diet } = request.body;
    if (!title || !description || typeof on_a_diet === "undefined") return { code: 400, body: { message: "Parameters title, description and on_a_diet are required." } };
    const user = request.user;
    if (!user) return { code: 401, body: { message: "Unauthorized: User logged in not valid." } };
    try {
      const diet = {
        id: (0, import_crypto.randomUUID)(),
        user_id: user.id,
        title,
        description,
        on_a_diet
      };
      const created_diet = await this.dietService.save(diet);
      return { code: 200, body: created_diet };
    } catch (error) {
      console.log("error", error);
      return { code: 400, body: { message: "Unexpected error occurred." } };
    }
  }
  async update(request) {
    const { title, description, on_a_diet } = request.body;
    console.log(`id:`, request.params);
    const { id } = request.params;
    if (!title || !description || typeof on_a_diet === "undefined" || !id) return { code: 400, body: { message: "Parameters title, description, on_a_diet and id are required." } };
    const user = request.user;
    if (!user) return { code: 401, body: { message: "Unauthorized: user not logged in." } };
    const toUpdateDiet = {
      id,
      title,
      description,
      on_a_diet,
      user_id: user.id
    };
    const updatedDiet = await this.dietService.update(toUpdateDiet);
    return { code: 200, body: updatedDiet };
  }
  async delete(request) {
    const { id } = request.params;
    if (!id) return { code: 400, body: { message: "Parameters id is required." } };
    const user = request.user;
    if (!user) return { code: 401, body: { message: "Unauthorized: user not logged in." } };
    try {
      const deletedStatus = await this.dietService.delete(id);
      const code = deletedStatus === 1 ? 200 : 204;
      return { code, body: deletedStatus };
    } catch (error) {
      if (error instanceof DietError_default) {
        return { code: 404, body: error.message };
      }
      return { code: 404, body: { message: "Unexpected error occurred." } };
    }
  }
  async findAll(request) {
    const user = request.user;
    if (!user) return { code: 401, body: { message: "Unauthorized: user not logged in." } };
    const { id } = request.params;
    const diets = id ? await this.dietService.findById(user.id, id) : await this.dietService.findAll(user.id);
    return { code: 200, body: diets };
  }
  async findTotalDiets(request) {
    const user = request.user;
    if (!user) return { code: 401, body: { message: "Unauthorized: user not logged in." } };
    const totalDiets = (await this.dietService.findTotalDiets(user.id)).length;
    return { code: 200, body: { totalDiets } };
  }
  async findByOnADiet(request) {
    const { on_a_diet } = request.query;
    if (!on_a_diet) return { code: 400, body: { message: "Parameter on_a_diet is required." } };
    const user = request.user;
    if (!user) return { code: 401, body: { message: "Unauthored: user not logged in." } };
    const onADiet = await this.dietService.findOnADiet(user.id, on_a_diet);
    return { code: 200, body: onADiet };
  }
  async findBestSequence(request) {
    const user = request.user;
    if (!user) return { code: 400, body: { message: "Parameter on_a_diet is required." } };
    const bestSequence = await this.dietService.findBestSequence(user.id);
    return { code: 200, body: { bestSequence } };
  }
};

// src/routes/diets.ts
async function dietsRoutes(server) {
  const userRepository = new UserRepository(knex);
  const authService = new AuthService(userRepository);
  const dietRepository = new DietRepository(knex);
  const dietService = new DietService(dietRepository);
  const dietController = new DietController(dietService);
  server.addHook("preHandler", async (req, reply) => {
    const token = req.headers.authorization?.replace(/^Bearer /, "");
    if (!token) return reply.code(401).send("Unauthorized: Token missing.");
    const user = await authService.verifyToken(token);
    if (!user) return reply.code(401).send({ message: "Unauthorized: Invalid token." });
    req.user = user;
  });
  server.post("/new", async (req, reply) => {
    const { code, body } = await dietController.save(req);
    console.log(`body`, body);
    reply.code(code).send(body);
  });
  server.put("/update/:id", async (req, reply) => {
    const { code, body } = await dietController.update(req);
    reply.code(code).send(body);
  });
  server.delete("/delete/:id", async (req, reply) => {
    const { code, body } = await dietController.delete(req);
    reply.code(code).send(body);
  });
  server.get("/:id", async (req, reply) => {
    const { code, body } = await dietController.findAll(req);
    reply.code(code).send(body);
  });
  server.get("/total", async (req, reply) => {
    const { code, body } = await dietController.findTotalDiets(req);
    reply.code(code).send(body);
  });
  server.get("/search", async (req, reply) => {
    const { code, body } = await dietController.findByOnADiet(req);
    reply.code(code).send(body);
  });
  server.get("/best_sequence", async (req, reply) => {
    const { code, body } = await dietController.findBestSequence(req);
    reply.code(code).send(body);
  });
}

// src/auth/AuthController.ts
var import_bcrypt2 = __toESM(require("bcrypt"), 1);
var import_crypto2 = require("crypto");
var AuthController = class {
  constructor(authService) {
    this.authService = authService;
  }
  async register(request) {
    const { name, email, password } = request.body;
    if (!name || !email || !password) return { code: 400, body: { message: "Properties name, email, and password are required." } };
    try {
      const user = {
        id: (0, import_crypto2.randomUUID)(),
        name,
        email,
        password: import_bcrypt2.default.hashSync(password, 10)
      };
      const createdUser = await this.authService.register(user);
      return { code: 200, body: createdUser };
    } catch (error) {
      if (error instanceof AuthError_default) return { code: 400, body: { message: error.message } };
      return { code: 400, body: { message: "Register unexpected error." } };
    }
  }
  async login(request) {
    const { email, password } = request.body;
    if (!email || !password) return { code: 400, body: { message: "Properties email and password is required." } };
    try {
      const user = {
        email,
        password
      };
      const loggedUser = await this.authService.login(user);
      return { code: 200, body: loggedUser };
    } catch (error) {
      if (error instanceof AuthError_default) return { code: 401, body: { message: error.message } };
      return { code: 401, body: { message: "Login unexpected error." } };
    }
  }
};

// src/routes/autentication.ts
function autenticationRoutes(server) {
  const userRepository = new UserRepository(knex);
  const authService = new AuthService(userRepository);
  const authController = new AuthController(authService);
  server.post("/register", async (req, reply) => {
    const { code, body } = await authController.register(req);
    reply.code(code).send(body);
  });
  server.post("/login", async (req, reply) => {
    const { code, body } = await authController.login(req);
    reply.code(code).send(body);
  });
}

// src/app.ts
var app = (0, import_fastify.default)();
app.register(autenticationRoutes, { prefix: "auth" });
app.register(dietsRoutes, { prefix: "diets" });
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  app
});
