"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET_error = exports.POST_petImage$id = exports.DELETE_petBy$id = exports.PUT_petBy$id = exports.GET_pets_search$$ = exports.POST_pets = exports.GET_petBy$id = exports.GET_pets = exports.GET_ = exports.BODY_petImage$id = exports.BODY_petBy$id = exports.BODY_pets = void 0;
//? Body validators
exports.BODY_pets = {
    body: {
        name: { err: "please provide dog name", type: "string" },
        image: { type: "string", nullable: true, inputType: "file" },
        age: { type: "number", inputType: "number", nullable: true },
    },
    info: "the pet api",
    headers: {
        "Content-Type": "application/json",
        Authorization: "Bear *********",
        "X-Pet-Token": "token",
    },
    method: "POST",
};
exports.BODY_petBy$id = {
    body: {
        name: { err: "please provide dog name", type: "string" },
        image: { type: "string", nullable: true, inputType: "file" },
        age: { type: "number" },
    },
    info: "This api allows you to update a pet with it's ID",
    method: "PUT",
};
exports.BODY_petImage$id = {
    body: { image: { type: "string", nullable: true, inputType: "file" } },
    method: "POST",
};
// ? Routes
// ? PETshop temperaly Database
var pets = [];
// ? /
function GET_(ctx) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            // return new Promise((r) => {
            setTimeout(function () {
                console.log("lol");
                ctx.reply("Welcome to Petshop!");
                // r("");
            }, 3000);
            return [2 /*return*/];
        });
    });
}
exports.GET_ = GET_;
// List Pets: Retrieve a list of pets available in the shop
// ? /pets
function GET_pets(ctx) {
    ctx.reply(pets);
}
exports.GET_pets = GET_pets;
// ? /petBy/19388
// Get a Pet by ID: Retrieve detailed information about a specific pet by its unique identifier
function GET_petBy$id(ctx) {
    var _a;
    var petId = (_a = ctx.params) === null || _a === void 0 ? void 0 : _a.id;
    var pet = pets.find(function (p) { return p.id === petId; });
    if (pet) {
        ctx.reply(pet);
    }
    else {
        ctx.code = 404;
        ctx.reply({ message: "Pet not found" });
    }
}
exports.GET_petBy$id = GET_petBy$id;
// ? /pets
// Add a New Pet: Add a new pet to the inventory
function POST_pets(ctx) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var _b, _c, _d, _e, newPet;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    if (!((_a = ctx.validate) === null || _a === void 0)) return [3 /*break*/, 1];
                    _b = void 0;
                    return [3 /*break*/, 3];
                case 1:
                    _d = (_c = _a).call;
                    _e = [ctx];
                    return [4 /*yield*/, ctx.json()];
                case 2:
                    _b = _d.apply(_c, _e.concat([_f.sent()]));
                    _f.label = 3;
                case 3:
                    _b;
                    newPet = ctx.body;
                    // Generate a unique ID for the new pet (in a real scenario, consider using a UUID or another robust method)
                    newPet.id = String(Date.now());
                    pets.push(newPet);
                    ctx.reply({ message: "Pet added successfully", pet: newPet });
                    return [2 /*return*/];
            }
        });
    });
}
exports.POST_pets = POST_pets;
// ? /pets/q/?
// Add a New Pet: Add a new pet to the inventory
function GET_pets_search$$(ctx) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_b) {
            (_a = exports.BODY_pets.validate) === null || _a === void 0 ? void 0 : _a.call(exports.BODY_pets, ctx.search);
            ctx.reply({
                message: "Pets searched successfully",
                pets: pets.filter(function (pet) { return pet.name === ctx.search.q || pet.name.includes(ctx.search.q); }),
            });
            return [2 /*return*/];
        });
    });
}
exports.GET_pets_search$$ = GET_pets_search$$;
// Update a Pet: Modify the details of an existing pet
// ? /petBy/8766
function PUT_petBy$id(ctx) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var petId, updatedPetData, index;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    (_a = exports.BODY_petBy$id.validate) === null || _a === void 0 ? void 0 : _a.call(exports.BODY_petBy$id, ctx.body);
                    petId = ctx.params.id;
                    return [4 /*yield*/, ctx.json()];
                case 1:
                    updatedPetData = _b.sent();
                    index = pets.findIndex(function (p) { return p.id === petId; });
                    if (index !== -1) {
                        // Update the existing pet's data
                        pets[index] = __assign(__assign({}, pets[index]), updatedPetData);
                        ctx.reply({ message: "Pet updated successfully", pet: pets[index] });
                    }
                    else {
                        ctx.code = 404;
                        ctx.reply({ message: "Pet not found" });
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.PUT_petBy$id = PUT_petBy$id;
// ? /petBy/8766
// Delete a Pet: Remove a pet from the inventory
function DELETE_petBy$id(ctx) {
    var petId = ctx.params.id;
    var index = pets.findIndex(function (p) { return p.id === petId; });
    if (index !== -1) {
        var deletedPet = pets.splice(index, 1)[0];
        ctx.reply({ message: "Pet deleted successfully", pet: deletedPet });
    }
    else {
        ctx.code = 404;
        ctx.reply({ message: "Pet not found" });
    }
}
exports.DELETE_petBy$id = DELETE_petBy$id;
// ? /petImage/76554
// Upload a Pet's Image: Add an image to a pet's profile
function POST_petImage$id(ctx) {
    return __awaiter(this, void 0, void 0, function () {
        var petId, formdata, profilePicture, index;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    petId = ctx.params.id;
                    // @ts-ignore
                    console.log({ r: ctx.request });
                    return [4 /*yield*/, ctx.request.formData()];
                case 1:
                    formdata = _a.sent();
                    console.log(formdata);
                    profilePicture = formdata.get("image");
                    if (!profilePicture)
                        throw new Error("Must upload a profile picture.");
                    console.log({ formdata: formdata, profilePicture: profilePicture });
                    index = pets.findIndex(function (p) { return p.id === petId; });
                    if (!(index !== -1)) return [3 /*break*/, 3];
                    // Attach the image URL to the pet's profile (in a real scenario, consider storing images externally)
                    pets[index].imageUrl = "/images/".concat(petId, ".png");
                    // write profilePicture to disk
                    // @ts-ignore
                    return [4 /*yield*/, Bun.write(pets[index].imageUrl, profilePicture)];
                case 2:
                    // write profilePicture to disk
                    // @ts-ignore
                    _a.sent();
                    ctx.reply({
                        message: "Image uploaded successfully",
                        imageUrl: pets[index].imageUrl,
                    });
                    return [3 /*break*/, 4];
                case 3:
                    ctx.code = 404;
                    ctx.reply({ message: "Pet not found" });
                    _a.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.POST_petImage$id = POST_petImage$id;
// ? error hook
// export function hook__ERROR(ctx: AppCTX, err: unknown) {
//   ctx.code = 400;
//   console.log(err);
//   ctx.reply(String(err));
// }
function GET_error() {
    return new Promise(function (r) {
        setTimeout(function () {
            throw new Error("Edwinger loves jetpath");
        }, 100);
    });
}
exports.GET_error = GET_error;
