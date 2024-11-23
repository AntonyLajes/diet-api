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

// src/diets/DietService.ts
var DietService_exports = {};
__export(DietService_exports, {
  DietService: () => DietService
});
module.exports = __toCommonJS(DietService_exports);

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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  DietService
});
