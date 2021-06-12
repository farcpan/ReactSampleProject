"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var core_1 = require("@material-ui/core");
var TestComponent = function () {
    return (react_1.default.createElement("div", null,
        react_1.default.createElement(core_1.Button, null, "React Test Component")));
};
exports.default = TestComponent;
