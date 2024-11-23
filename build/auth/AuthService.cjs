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

// src/auth/AuthService.ts
var AuthService_exports = {};
__export(AuthService_exports, {
  AuthService: () => AuthService
});
module.exports = __toCommonJS(AuthService_exports);

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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AuthService
});
