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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DivisionServices = void 0;
const cloudinary_config_1 = require("../../config/cloudinary.config");
const appError_1 = __importDefault(require("../../errorHelpers/appError"));
const isTourEnd_1 = require("../../utils/isTourEnd");
const QueryBuilder_1 = require("../../utils/QueryBuilder");
const division_constants_1 = require("./division.constants");
const division_model_1 = require("./division.model");
const createDivision = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isDivisionExist = yield division_model_1.Division.findOne({ name: payload.name });
    if (isDivisionExist) {
        throw new appError_1.default(400, "Division already exist.");
    }
    const newDivision = yield division_model_1.Division.create(payload);
    return {
        data: newDivision,
    };
});
const getAllDivision = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const queryElement = new QueryBuilder_1.QueryBuilder(division_model_1.Division.find(), query);
    const tours = queryElement
        .search(division_constants_1.divisionSearchalbeFields)
        .filter()
        .sort()
        .fields()
        .paginate();
    const [data, meta] = yield Promise.all([
        tours.build(),
        queryElement.getMeta(),
    ]);
    return {
        data,
        meta,
    };
});
const getSingleDivision = (slug) => __awaiter(void 0, void 0, void 0, function* () {
    const division = yield division_model_1.Division.findOne({ slug });
    return {
        data: division,
    };
});
const updateDivision = (_id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isDivisionExist = yield division_model_1.Division.findById(_id);
    const session = yield division_model_1.Division.startSession();
    session.startTransaction();
    if (!isDivisionExist) {
        throw new appError_1.default(400, "Division does not exist.");
    }
    const dulicateDivision = yield division_model_1.Division.findOne({
        name: payload.name,
        _id: { $ne: _id },
    });
    if (dulicateDivision) {
        throw new appError_1.default(400, "A division with this name already exist.");
    }
    if (!payload.thumbnail) {
        const { thumbnail } = payload, rest = __rest(payload, ["thumbnail"]);
        payload = rest;
    }
    try {
        const updatedDivision = yield division_model_1.Division.findByIdAndUpdate(_id, payload, {
            new: true,
            runValidators: true,
            session,
        });
        if (payload.thumbnail && isDivisionExist.thumbnail) {
            yield (0, cloudinary_config_1.deleteImageFromCloudinary)(isDivisionExist.thumbnail);
        }
        yield session.commitTransaction();
        session.endSession();
        return {
            data: updatedDivision,
        };
    }
    catch (error) {
        // some error occur do not implement anything to the real data base
        yield session.abortTransaction(); // rollback
        session.endSession();
        throw new appError_1.default(400, `Faild to update division. ${error.message}`);
    }
});
const deleteDivision = (_id) => __awaiter(void 0, void 0, void 0, function* () {
    const isDivisionExist = yield division_model_1.Division.findById(_id);
    if (!isDivisionExist) {
        throw new appError_1.default(400, "Division is already deleted.");
    }
    yield (0, isTourEnd_1.handleTourDeleteWhenRefDelete)(_id, isDivisionExist.name, "division");
    const deletedDivision = yield division_model_1.Division.findByIdAndDelete(_id);
    return {
        data: deletedDivision,
    };
});
exports.DivisionServices = {
    createDivision,
    getAllDivision,
    getSingleDivision,
    updateDivision,
    deleteDivision,
};
