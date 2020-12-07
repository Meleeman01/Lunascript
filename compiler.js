//the compiler for lunascript
const fs = require('fs');
const file = fs.readFileSync("example.luna","utf8");
//lexer init
const lexer = file.toString().split('\n') //produce an AST (abstract syntax tree)
let variables = {};
let definitions = [
	'global','for','do','while','if','then','end','function',
	'else', 'elseif', 'and', 'or','break','in','return','repeat','until',
	'true','false','nil','js'
] //keep a list of definitions for lunascript

//lunascript tokens
let tokens = [
	'+','-','*','/','%','=','==','<=','>=','~=',
	'>','<',
	'[',']','{','}','^','..',

]
console.log(lexer);

//parse input
function parse(input) {
	let keywords = [];
	let comment = false;

	//remove comments lol
	for (let i in input) {
		if (input[i].includes('--')) {
			console.log(input[i]);
			let index = input[i].indexOf('-');
			input[i] = input[i].substring(0,index);
		}
	}
		
		



	console.log(input);
}

parse(lexer);