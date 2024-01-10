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
exports.hook__DECORATOR = exports.GET_user$id = exports.hook__ERROR = exports.hook__POST = exports.hook__PRE = exports.GET_ = exports.GET_dogs$$ = exports.GET_dogs$name$age$sex = exports.POST_dogs = exports.GET_dogs$0 = exports.GET_dogs = void 0;
// /dogs
function GET_dogs(ctx) {
    ctx.reply(ctx); // ! error in nodejs
}
exports.GET_dogs = GET_dogs;
// /dogs
function GET_dogs$0(ctx) {
    ctx.reply("all requests to /dogs/* ends on this page"); // ! error in nodejs
}
exports.GET_dogs$0 = GET_dogs$0;
function POST_dogs(ctx) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            ctx.reply("enter skelter");
            return [2 /*return*/];
        });
    });
}
exports.POST_dogs = POST_dogs;
function GET_dogs$name$age$sex(ctx) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, name, age, sex;
        return __generator(this, function (_b) {
            _a = ctx.params, name = _a.name, age = _a.age, sex = _a.sex;
            ctx.reply("hello " + name + " you are " + age + " years old and you are " + sex);
            return [2 /*return*/];
        });
    });
}
exports.GET_dogs$name$age$sex = GET_dogs$name$age$sex;
function GET_dogs$$(ctx) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, name, age, sex;
        return __generator(this, function (_b) {
            _a = ctx.search, name = _a.name, age = _a.age, sex = _a.sex;
            ctx.reply("hello " + name + " you are " + age + " years old and you are " + sex);
            return [2 /*return*/];
        });
    });
}
exports.GET_dogs$$ = GET_dogs$$;
/**
 * @param {{ redirect: (arg0: string) => void; }} ctx
 */
function GET_(ctx) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            // ctx.redirect("http://localhost:8080/dogs");
            throw new Error("tada");
        });
    });
}
exports.GET_ = GET_;
/**
 * @param {any} ctx
 */
function hook__PRE(ctx) {
    // console.log("PRE function boohoo");
    // console.log(ctx);
}
exports.hook__PRE = hook__PRE;
function hook__POST(ctx) { }
exports.hook__POST = hook__POST;
function hook__ERROR(ctx, err) {
    console.log(err);
    ctx.throw(400, "bad request!");
    console.log("booo2"); // nop this won't run, JetPath took over control
}
exports.hook__ERROR = hook__ERROR;
// GET localhost:8080/user/:id
function GET_user$id(ctx) {
    var id = ctx.id();
    ctx.reply("you are " + id);
}
exports.GET_user$id = GET_user$id;
function hook__DECORATOR() {
    return {
        id: function () {
            var id = this.params.id;
            return id;
        },
    };
}
exports.hook__DECORATOR = hook__DECORATOR;
