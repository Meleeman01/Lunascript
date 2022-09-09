//the compiler for lunascript
const fs = require('fs');
const file = fs.readFileSync("example.luna","utf8");
//lexer init
const lexer = file.toString().split('\n') //produce an AST (abstract syntax tree)
const ast = {};
const globalVars = [];
let errorStack = {
	syntaxError:[],
	tokenError:[],
	assignmentError:[],
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
const types = ['number','nil','boolean','function','string','table']

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
	//might only work for global vars.
	function checkTokens(termToCheck,line) {
		let tokenized = termToCheck.split('');
		for(let t of tokenized) {
			if (tokens[t]) {
				errorStack.tokenError.push(`wtf is this token "${tokens[t]}" doing here dumbass?::  On Line ${findLine(lexer,line)+1} >> ${line}`);
				return false;
			}else return true;
		}
	}
	function checkVariableAssignment(termToCheck,line) {
		//check for valid assignments
		//console.log(typeof termToCheck,'at Term to check!');
		if (termToCheck[0] == '"' ) {
			//this means we have a string type now check if the string closes,
			if (termToCheck[termToCheck.length-1] != '"') {
				errorStack.assignmentError.push(`:: On line ${findLine(lexer,line)+1} >> ${line}`);
			}
			console.log('stringLength:',termToCheck[termToCheck.length-1]);
		}
		else if (termToCheck[0] == "'") {
			if (termToCheck[termToCheck.length-1] != "'") {
				errorStack.assignmentError.push(`:: On line ${findLine(lexer,line)+1} >> ${line}`)
			}
		}
		else if (termToCheck[0] == '{') {
			console.log('not supported yet!');
		}
		else if (termToCheck = 'function') {
			console.log('not supported yet!');
		}

		else if (isNan(Number(termToCheck))) {
			errorStack.assignmentError.push(`:: On line ${line}`);
		}
		else return true
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
				if (lx[parseInt(x+1)] == undefined) {
					errorStack.assignmentError.push(`missing assignment for a global variable:: On Line ${findLine(lexer,input[line])+1} >> ${input[line]}`);
				}
				if (typeof lx[parseInt(x+1)] == 'string'){
					//next should be a variable name.

					let firstTerm = lx[parseInt(x+1)];
					let secondTerm = lx[parseInt(x+2)];
					let thirdTerm = lx[parseInt(x+3)];
					
						//console.log(parseInt(x+2),'checking secondTerm');
					
					checkReservedWords(firstTerm,input[line]);
					checkVariableDeclaration(firstTerm,input[line]);
					checkTokens(firstTerm,input[line]);

					//if there are no errors, or "global varName"
					if (secondTerm != '=') {
						errorStack.assignmentError.push(`missing assignment for a global variable:: On Line ${findLine(lexer,input[line])+1} >> ${input[line]}`);
					}

					//next is to check the assignment of the variable.
					console.log(thirdTerm);
					checkVariableAssignment(thirdTerm,input[line]);



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