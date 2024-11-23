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

// src/diets/DietRepository.ts
var DietRepository_exports = {};
__export(DietRepository_exports, {
  DietRepository: () => DietRepository
});
module.exports = __toCommonJS(DietRepository_exports);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  DietRepository
});
