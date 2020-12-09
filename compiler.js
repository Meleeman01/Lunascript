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
	//line deleter
	function deleteLine(line) {
		line = line.replace(line,'');
		return line;
	}
	//remove comments lol
	for (let i in input) {
		if (!comment) {
			if (input[i].includes('--')) {
				if (input[i].includes('--[[')) {
					//set comment flag to true, as this comment will span multiple lines
					comment = true;
					//delete the line with the comment
					input[i] = deleteLine(input[i]);
				}
				else {
					console.log(input[i]);
					let index = input[i].indexOf('-');
					input[i] = input[i].substring(0,index);
				}
			}
		}
		//once we reach the end of a comment make sure we set the comment flag to false
		else if(comment && input[i].includes(']]--')) {
			input[i] = deleteLine(input[i]);
			comment = false;
		}
		else {
			input[i] = deleteLine(input[i]);
			console.log(input[i]);
		}
	}
	//after removing all the comments, filter all the entries so that we only process non empty strings.
	input = input.filter(function(line) {
		line = line.trim();
		if (line == '') {
			return false;
		}
		return true;
	});
		
		



	console.log(input);
}

parse(lexer);