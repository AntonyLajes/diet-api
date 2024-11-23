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

// src/routes/autentication.ts
var autentication_exports = {};
__export(autentication_exports, {
  autenticationRoutes: () => autenticationRoutes
});
module.exports = __toCommonJS(autentication_exports);

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

// src/auth/AuthController.ts
var import_bcrypt2 = __toESM(require("bcrypt"), 1);
var import_crypto = require("crypto");
var AuthController = class {
  constructor(authService) {
    this.authService = authService;
  }
  async register(request) {
    const { name, email, password } = request.body;
    if (!name || !email || !password) return { code: 400, body: { message: "Properties name, email, and password are required." } };
    try {
      const user = {
        id: (0, import_crypto.randomUUID)(),
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  autenticationRoutes
});
