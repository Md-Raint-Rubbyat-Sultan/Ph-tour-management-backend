"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Division = void 0;
const mongoose_1 = require("mongoose");
const createSlug_1 = require("../../utils/createSlug");
const divisionSchema = new mongoose_1.Schema({
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, unique: true, trim: true },
    thumbnail: { type: String, trim: true, default: "" },
    description: {
        type: String,
        trim: true,
        default: "No description provided.",
    },
}, {
    timestamps: true,
    versionKey: false,
});
divisionSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (this.isModified("name")) {
            let baseSlug = `${(0, createSlug_1.createSlug)(this.name)}-division`;
            let counter = 0;
            while (yield exports.Division.exists({ slug: baseSlug })) {
                baseSlug = `${baseSlug}-${counter++}`;
            }
            this.slug = baseSlug;
        }
        next();
    });
});
divisionSchema.pre("findOneAndUpdate", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const division = this.getUpdate();
        if (division.name) {
            let baseSlug = `${(0, createSlug_1.createSlug)(division.name)}-division`;
            let counter = 0;
            while (yield exports.Division.exists({ slug: baseSlug })) {
                baseSlug = `${baseSlug}-${counter++}`;
            }
            division.slug = baseSlug;
        }
        next();
    });
});
exports.Division = (0, mongoose_1.model)("Division", divisionSchema);
