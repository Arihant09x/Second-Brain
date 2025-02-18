"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.random = random;
function random(len) {
    let option = "ergrtytbvrtferbvtawercqwe1224356743121";
    let length = option.length;
    let randomString = "";
    for (let i = 0; i < len; i++) {
        randomString += option[Math.floor(Math.random() * length)];
    }
    return randomString;
}
