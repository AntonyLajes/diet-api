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

// src/auth/AuthController.ts
var AuthController_exports = {};
__export(AuthController_exports, {
  AuthController: () => AuthController
});
module.exports = __toCommonJS(AuthController_exports);

// src/error/AuthError.ts
var AuthError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "AuthError";
    Error.captureStackTrace(this, this.constructor);
  }
};
var AuthError_default = AuthError;

// src/auth/AuthController.ts
var import_bcrypt = __toESM(require("bcrypt"), 1);
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
        password: import_bcrypt.default.hashSync(password, 10)
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AuthController
});
