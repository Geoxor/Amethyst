"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.md5 = void 0;
var node_crypto_1 = require("node:crypto");
var md5 = function (data) {
    return (0, node_crypto_1.createHash)("md5")
        .update(data)
        .digest("hex");
};
exports.md5 = md5;
