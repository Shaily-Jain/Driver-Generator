const express=require('express');
const app=express();
const ejs = require('ejs');

/**Added Code for deployment on back4app ***/


/*****/

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/views'));

app.get('/',(req,res)=>{
	res.render('generator');
});


app.get('/generator',(req,res)=>{
	myJSON_query = decodeURIComponent(req.query.q);
	obj_query = JSON.parse(myJSON_query); 
	console.log(obj_query);


	let o = new CPlusPlus(obj_query['functionName'],obj_query['multipleTestCase'],obj_query['returnType'],obj_query['paramaters'],obj_query['comment']);
	console.log(o.get_code());
	var obj={};
	obj[0]=o.get_code(); //0 for C++
	var myJSON = JSON.stringify(obj);
	res.send(myJSON);
});



app.listen(process.env.PORT || 8001, () => {
    console.log('Hi!, server started at http://localhost:8001');
});

function displayQuery()
{
			//hello world
}

class line
{
	constructor(tab,s)
	{
		this.tab=tab;
		this.s=s;
	}
}



class CPlusPlus
{
	header_file()
	{
		let code = new Array();
		code.push(new line(0,"#include <bits/stdc++.h>"));
		code.push(new line(0,"using namespace std;"));
		return code;
	}
	user_function_comment()
	{
		let code = new Array();
		code.push(new line(0,"// "+this.comment));
		return code;
	}
	user_function()
	{
		let code = new Array();
		let parameterPassing = "";
		for(let i=0;i<this.parameters.length;i++)
		{
			console.log(this.parameters[i]['type']);
			parameterPassing+=CPlusPlusAvailableTypes[this.parameters[i]['type']]+" "+this.parameters[i]['name'];
			if(i+1<this.parameters.length)
				parameterPassing+=", ";
		}
		let s = CPlusPlusReturnTypes[this.returnType]+" "+this.functionName+"("+parameterPassing+")";
		code.push(new line(0,s));
		code.push(new line(0,"{"));
		
		let c = this.user_function_comment();
		this.add_x_tab(c,1);
		this.merge(code,c);

		code.push(new line(0,"}"));
		return code;		
	}

	user_class()
	{
		let code = new Array();
		code.push(new line(0,"class Solution{"));
		code.push(new line(0,"public:"));
		let c = this.user_function();
		this.add_x_tab(c,1);
		this.merge(code,c);
		code.push(new line(0,"};"));
		return code;	
	}

	input_inside_main()
	{
		let code = new Array();
		
		for(let i=0;i<this.parameters.length;i++)
		{
			//console.log(this.parameters[i]);
			let name=this.parameters[i]['name'];
			let type = this.parameters[i]['type'];
			let n = this.parameters[i]['n'];
			//console.log(n);
			//console.log("this."+availableTypesFunctions[type]+"("+"this.parameters[i]"+")");
			let c = eval("this."+availableTypesFunctions[type]+"("+"this.parameters[i]"+");");
			this.merge(code,c);
		}

		let parameterPassing="";
		for(let i=0;i<this.parameters.length;i++)
		{
			parameterPassing+=this.parameters[i]['name'];
			if(i+1<this.parameters.length)
				parameterPassing+=", ";
		}

		code.push(new line(0,"Solution obj;"));

		let s = "";

		if(this.returnType != availableReturnTypes.length-1){
			// if return type is not void 
			s+=CPlusPlusReturnTypes[this.returnType] + " answer = ";
		}
		s+="obj."+this.functionName+"("+parameterPassing+");";
		code.push(new line(0,s));

		if(this.returnType != availableReturnTypes.length-1)
		{
			let c = eval("this."+CPlusPlusPrintFunctions[this.returnType]+"();");
			console.log("this."+CPlusPlusPrintFunctions[this.returnType]+"();");
			this.merge(code,c);
		}

		return code;
	}

	add_x_tab(a,x)
	{	
		for(let i=0;i<a.length;i++)
			a[i].tab+=x;
	}	

	input_integer(obj)
	{
		let code = new Array();
		code.push(new line(0,"int "+obj.name+";"));
		code.push(new line(0,"cin>>"+obj.name+";"));
		return code;
	}

	input_string(obj)
	{
		let code = new Array();
		code.push(new line(0,"string "+obj.name+";"));
		code.push(new line(0,"cin>>"+obj.name+";"));
		return code;
	}

	input_character(obj)
	{
		let code = new Array();
		code.push(new line(0,"char "+obj.name+";"));
		code.push(new line(0,"cin>>"+obj.name+";"));
		return code;	
	}


	input_integer_1d(obj)
	{
		let code = new Array();
		code.push(new line(0,"vector<int> "+obj.name+"("+obj.n[0]+");"));
		code.push(new line(0,"for(int i=0;i<"+obj.n[0]+";i++){"));	
		code.push(new line(1,"cin>>"+obj.name+"[i];"));
		code.push(new line(0,"}"));
		return code;	
	}

	input_character_1d(obj)
	{
		let code = new Array();
		code.push(new line(0,"vector<char> "+obj.name+"("+obj.n[0]+");"));
		code.push(new line(0,"for(int i=0;i<"+obj.n[0]+";i++){"));	
		code.push(new line(1,"cin>>"+obj.name+"[i];"));
		code.push(new line(0,"}"));
		return code;	
	}

	input_string_1d(obj)
	{
		let code = new Array();
		code.push(new line(0,"vector<string> "+obj.name+"("+obj.n[0]+");"));
		code.push(new line(0,"for(int i=0;i<"+obj.n[0]+";i++){"));	
		code.push(new line(1,"cin>>"+obj.name+"[i];"));
		code.push(new line(0,"}"));
		return code;	
	}


	input_integer_2d(obj)
	{
		let code = new Array();
		code.push(new line(0,"vector<vector<int>> "+obj.name+"("+obj.n[0]+",vector<int>("+obj.n[1]+"));"));
		code.push(new line(0,"for(int i = 0; i < "+obj.n[0]+"; i++){"));
		code.push(new line(1,"for(int j = 0; j < "+obj.n[1]+"; j++){"));
		code.push(new line(2,"cin>>"+obj.name+"[i][j];"));
		code.push(new line(1,"}"));
		code.push(new line(0,"}"));
		return code;	
	}

	input_character_2d(obj)
	{
		let code = new Array();
		code.push(new line(0,"vector<vector<char>> "+obj.name+"("+obj.n[0]+",vector<char>("+obj.n[1]+"));"));
		code.push(new line(0,"for(int i = 0; i < "+obj.n[0]+"; i++){"));
		code.push(new line(1,"for(int j = 0; j < "+obj.n[1]+"; j++){"));
		code.push(new line(2,"cin>>"+obj.name+"[i][j];"));
		code.push(new line(1,"}"));
		code.push(new line(0,"}"));
		return code;	
	}

	input_string_2d(obj)
	{
		let code = new Array();
		code.push(new line(0,"vector<vector<string>> "+obj.name+"("+obj.n[0]+",vector<string>("+obj.n[1]+"));"));
		code.push(new line(0,"for(int i = 0; i < "+obj.n[0]+"; i++){"));
		code.push(new line(1,"for(int j = 0; j < "+obj.n[1]+"; j++){"));
		code.push(new line(2,"cin>>"+obj.name+"[i][j];"));
		code.push(new line(1,"}"));
		code.push(new line(0,"}"));
		return code;
	}	


	print_integer()
	{
		let code = new Array();
		code.push(new line(0,"cout << answer << endl;"));
		return code;
	}

	print_string()
	{
		console.log("Inside string");
		let code = new Array();
		code.push(new line(0,"cout << answer << endl;"));
		return code;
	}
	
	print_character()
	{
		let code = new Array();
		code.push(new line(0,"cout << answer << endl;"));
		return code;
	}


	print_integer_1d()
	{
		let code = new Array();
		code.push(new line(0,"for(int i = 0; i < answer.size(); i++){"));	
		code.push(new line(1,"cout << answer[i] << ' ';"));
		code.push(new line(1,"cout << endl;"));
		code.push(new line(0,"}"));
		return code;	
	}

	print_character_1d()
	{
		let code = new Array();
		code.push(new line(0,"for(int i = 0; i < answer.size(); i++){"));	
		code.push(new line(1,"cout << answer[i] << ' ';"));
		code.push(new line(1,"cout << endl;"));
		code.push(new line(0,"}"));
		return code;	
	}

	print_string_1d()
	{
		let code = new Array();
		code.push(new line(0,"for(int i = 0; i < answer.size(); i++){"));	
		code.push(new line(1,"cout << answer[i] << ' ';"));
		code.push(new line(1,"cout << endl;"));
		code.push(new line(0,"}"));
		return code;
	}


	print_integer_2d()
	{
		let code = new Array();
		code.push(new line(0,"for(int i = 0; i < answer.size(); i++){"));	
		code.push(new line(1,"for(int j = 0; j < answer[i].size(); j++){"));
		code.push(new line(2,"cout << answer[i][j] << ' ';"));
		code.push(new line(1,"}"));
		code.push(new line(1,"cout << endl;"));
		code.push(new line(0,"}"));
		return code;	
	}

	print_character_2d()
	{
		let code = new Array();
		code.push(new line(0,"for(int i = 0; i < answer.size(); i++){"));	
		code.push(new line(1,"for(int j = 0; j < answer[i].size(); j++){"));
		code.push(new line(2,"cout << answer[i][j] << ' ';"));
		code.push(new line(1,"}"));
		code.push(new line(1,"cout << endl;"));
		code.push(new line(0,"}"));
		return code;
	}

	print_string_2d()
	{
		let code = new Array();
		code.push(new line(0,"for(int i = 0; i < answer.size(); i++){"));	
		code.push(new line(1,"for(int j = 0; j < answer[i].size(); j++){"));
		code.push(new line(2,"cout << answer[i][j] << ' ';"));
		code.push(new line(1,"}"));
		code.push(new line(1,"cout << endl;"));
		code.push(new line(0,"}"));
		return code;
	}	


	multiple_test_case()
	{
		let code=new Array();
		code.push(new line(0,"int t;"));
		code.push(new line(0,"cin>>t;"));
		code.push(new line(0,"while(t--)"));
		code.push(new line(0,"{"));
		
		let c = this.input_inside_main();
		this.add_x_tab(c,1);
		this.merge(code,c);

		code.push(new line(0,"}"));

		return code;
	}

	main_function()
	{
		let code = new Array();
		code.push(new line(0,"int main()"));
		code.push(new line(0,"{"));

		if(this.multipleTestCase)
		{
			let c = this.multiple_test_case();
			this.add_x_tab(c,1);
			this.merge(code,c);
		}
		else{
			let c = this.input_inside_main();
			this.add_x_tab(c,1);
			this.merge(code,c);
		}

		code.push(new line(0,"}"));
		return code;
	}
	constructor(functionName,multipleTestCase,returnType,parameters,comment)
	{
		// console.log(multipleTestCase);
		// console.log(returnType);
		this.functionName = functionName;
		this.multipleTestCase = multipleTestCase;
		this.returnType = returnType;
		this.parameters=parameters;
		this.comment  = comment;
		console.log(parameters);
	}

	merge(a,b)
	{
		for(const e of b)
		{
			a.push(e);
		}
	}

	get_code()
	{
		let ans = new Array();

		let header = this.header_file();
		this.merge(ans,header);

		let userclass = this.user_class();
		this.merge(ans,userclass);

		let main = this.main_function();
	//	console.log(body);
		this.merge(ans,main);  

		return ans;
	}
};



/*
	Parameter
*/

let availableTypes = new Array("Character","Integer","String","Character[]","Integer[]","String[]","Character[][]","Integer[][]","String[][]");
let availableTypesDimensions = new Array(0,0,0,1,1,1,2,2,2);
let availableReturnTypes = new Array("Character","Integer","String","Character[]","Integer[]","String[]","Character[][]","Integer[][]","String[][]","Void");
let availableReturnTypesDimensions = new Array(0,0,0,1,1,1,2,2,2,0);


let CPlusPlusAvailableTypes = new Array("char","int","string","vector<char>","vector<int>","vector<string>","vector<vector<char>>","vector<vector<int>>","vector<vector<string>>");
let CPlusPlusReturnTypes =  new Array("char","int","string","vector<char>","vector<int>","vector<string>","vector<vector<char>>","vector<vector<int>>","vector<vector<string>>","void");
let availableTypesFunctions = new Array("input_character","input_integer","input_string","input_character_1d","input_integer_1d","input_string_1d","input_character_2d","input_integer_2d","input_string_2d");
let CPlusPlusPrintFunctions = new Array("print_character","print_integer","print_string","print_character_1d","print_integer_1d","print_string_1d","print_character_2d","print_integer_2d","print_string_2d");




class Parameter
{
	constructor()
	{
		this.type=1; 	// it will store the type of parameter
		this.name="";	// it will store the name of the parameter
		this.n=new Array();	// ith value will store the length of the ith dimension
		// size of the array will define the dimension of variable
		// e.g if this.n.length==0 then it is a single variable
	}	
	display()
	{
		console.log(this.type+" "+this.name+" "+this.n1+" "+this.n2);
	}
}

