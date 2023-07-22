"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomNumber = void 0;
const randomNumber = (max, avoid) => {
    if (avoid) {
        return Math.floor(Math.random() * max) + 1;
    }
    else {
        let rand = Math.floor(Math.random() * max) + 1;
        while (rand === avoid) {
            rand = Math.floor(Math.random() * max) + 1;
        }
        return rand;
    }
};
exports.randomNumber = randomNumber;
//# sourceMappingURL=utils.js.map