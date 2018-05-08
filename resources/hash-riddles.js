#!/usr/bin/node
var unhashed = require("./riddles-unhashed"),
    utils = require("./utils.js"),
    fs = require("fs");

var hashed = [];
unhashed.riddles.forEach(function(r) {
    if (r.clue) {
        hashed.push({
            clue: r.clue,
            answer: utils.checksum(r.answer.toLowerCase()),
            explanation: utils.encrypt(r.answer.toLowerCase(), r.explanation)
        });
    } else {
        hashed.push(r);
    }
});
console.log("var riddles = " + JSON.stringify(hashed, undefined, 2) +
    ";\nvar universal='" + utils.checksum(unhashed.universal) + "';");
