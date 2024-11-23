"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/diets/DietController.ts
var DietController_exports = {};
__export(DietController_exports, {
  DietController: () => DietController
});
module.exports = __toCommonJS(DietController_exports);
var import_crypto = require("crypto");

// src/error/DietError.ts
var DietError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "DietError";
    Error.captureStackTrace(this, this.constructor);
  }
};
var DietError_default = DietError;

// src/diets/DietController.ts
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  DietController
});
