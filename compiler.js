//the compiler for lunascript
const fs = require('fs');
const file = fs.readFileSync("example.luna","utf8");
//lexer init
console.log(file.toString());
