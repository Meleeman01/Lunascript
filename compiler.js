//the compiler for lunascript
const fs = require('fs');
const file = fs.readFileSync("example.luna","utf8");
//lexer init
const lexer = file.toString().split('\n') //produce an AST (abstract syntax tree)
let variables = {};

let definitions = {
	global:'global', for:'for', do:'do', while:'while', if:'if', then:'then',
	end:'end', function:'function', else:'else', elseif:'elseif', and:'and', 
	or:'or', break:'break', in:'in', return:'return', repeat:'repeat', print:'print',
	until:'until', true:'true', false:'false', nil:'nil', js:'js'
} //keep a list of definitions for lunascript

//lunascript tokens
let tokens = {
	plus:'+', minus:'-', asterisk:'*', backslash:'/',
	modulus:'%', assign:'=', equals:'==', lessThanEqualTo:'<=',
	greaterThanEqualTo:'>=', notEqualTo:'~=',
	greaterThan:'>', lessThan: '<',
	leftBracket:'[', rightBracket:']',leftCurlyBrace:'{', rightCurlyBrace:'}', 
	exponent:'^', dotDot:'..',
}

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
					//console.log(input[i]);
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
			//console.log(input[i]);
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

	//check all variable definitions
	for (let line of input) {
		//console.log(line);
		let lx = line.split(' ');
		for (let x of lx) {
			
			if (x == definitions[x]) {
				console.log(x);
			}

		}

	}



	console.log(input);
}

parse(lexer);