//the compiler for lunascript
const fs = require('fs');
const file = fs.readFileSync("example.luna","utf8");
//lexer init
const lexer = file.toString().split('\n') //produce an AST (abstract syntax tree)
const variables = {};
const globalVars = [];
let errorStack = {
	syntaxError:[],
	tokenError:[]
};
let definitions = {
	global:'global', for:'for', do:'do', while:'while', if:'if', then:'then',
	end:'end', function:'function', else:'else', elseif:'elseif', and:'and', 
	or:'or', break:'break', in:'in', return:'return', repeat:'repeat', print:'print',
	until:'until', true:'true', false:'false', nil:'nil', js:'js'
} //keep a list of definitions for lunascript

//lunascript tokens
let tokens = {
	'+':'+', '-':'-', '*':'*', '/':'/',
	'%':'%', '=':'=', '==':'==', '<=':'<=',
	'>=':'>=', '~=':'~=',
	'>':'>', '<': '<',
	'[':'[', ']':']','{':'{', '}':'}', 
	'^':'^', '..':'..','(':'(',')':')',
	'~':'~',
}
//regex strings for checking
const checkWord = new RegExp(/\w\D\S/);
const checkSpecialChars = new RegExp(/\*|\+|\!|\~|\-|\%|\=/);
 
const output = [];

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
	function findLine(input,lineToFind) {
		return input.findIndex((e)=> e == lineToFind);
	}
	function checkVariableDeclaration(termToCheck,line) {
		//if the first character is not a number return true
		if (isNaN(parseInt(termToCheck[0]))) {
			return true;
		}
		else {
			errorStack.syntaxError.push(`Variable name cannot start with a number:: On Line ${findLine(lexer,line)+1} >> ${line}`);
			return false
		};
	}
	function checkReservedWords(termToCheck,line) {
		if (definitions[termToCheck]) {
			errorStack.syntaxError.push(`reserved keyword "${definitions[termToCheck]}" cannot be used as a variable:: On Line ${findLine(lexer,line)+1} >> ${line}`);
			return false;
		}else return true;
	}
	function checkTokens(termToCheck,line) {
		let tokenized = termToCheck.split('');
		for(let t of tokenized) {
			if (tokens[t]) {
				errorStack.tokenError.push(`wtf is this token "${tokens[t]}" doing here dumbass?::  On Line ${findLine(lexer,line)+1} >> ${line}`);
				return false;
			}else return true;
		}
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
	for (let line in input) {
		//console.log(line);
		let lx = input[line].split(' ');

		//tokens
		for (let x in lx) {
			console.log(lx[x]);
			if (lx[x] == 'global') {
				//if we see the global key word check the next 
				if (typeof lx[parseInt(x+1)] == 'string'){
					//next should be a variable name.
					let nextWord = lx[parseInt(x+1)];
					checkReservedWords(nextWord,input[line]);
					checkVariableDeclaration(nextWord,input[line]);
					checkTokens(nextWord,input[line]);
				}
			}

		}

	}



	console.log(input);
	//error display
	for (let error in errorStack) {
		if (errorStack[error].length) {
			for (let e of errorStack[error]) {
				//format the error so it looks nice on the compiler.
				eFormatted = e.split("::");
				console.log("\x1b[31m",error+": "+eFormatted[0],'\x1b[0m');
				console.log("\x1b[36m",eFormatted[1],'\x1b[0m');
			}
		}
	}
	
}

parse(lexer);