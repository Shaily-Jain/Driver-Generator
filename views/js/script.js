let availableTypes = new Array("Character","Integer","String","Character[]","Integer[]","String[]","Character[][]","Integer[][]","String[][]");
let availableTypesDimensions = new Array(0,0,0,1,1,1,2,2,2);

let availableReturnTypes = new Array("Character","Integer","String","Character[]","Integer[]","String[]","Character[][]","Integer[][]","String[][]","Void");
let availableReturnTypesDimensions = new Array(0,0,0,1,1,1,2,2,2,0);

let languageCode={0:"C++",1:"Java",2:"Python"};

async function getCode(obj)
{
	// console.log(obj);
  var u = "/generator?q="+encodeURIComponent(JSON.stringify(obj));
  const response = await fetch(u, {
    methods: "GET",
  });
  var data = await response.json();
  return data;
}


function beautifyCode(arr)
{
	let code="";
	for(let i=0;i<arr.length;i++)
	{
		for(let j=1;j<=arr[i]['tab'];j++)
		{
			code+="\t";
		}
		code+=arr[i]['s'];
		code+="\n";
	}
	return code;
}

async function generator()
{
	var myJSON = JSON.stringify(obj);
	var data = await getCode(obj);
	for(let i=0;i<1;i++)
	{
		let code = beautifyCode(data[i]);
		document.getElementById("editor").value = code;
		console.log(code);
	}
	console.log(data);
}
function paramTypeChange(e)
{
	console.log(e);
	console.log(e.attr);
	let id=parseInt(e.id);
	obj.paramaters[id].type=parseInt(e.selectedIndex);
	obj.paramaters[id].n=new Array(availableTypesDimensions[obj.paramaters[id].type]);
	obj.paramaters[id].n.fill(0);
	displayParameter();
}

function removeParameter(e)
{
	console.log(e);
	let id=parseInt(e.id);
	if(id<obj.paramaters.length){
		obj.paramaters.splice(id,1);
	}	
	displayParameter();
}

function paramSizeChange(e)
{
	console.log(e);
	
	let sz=parseInt(e.getAttribute("dimension"));
	console.log(sz);
	let id=parseInt(e.id);
	obj.paramaters[id].n[sz]=e.value;
	console.log(obj.paramaters[id].n[sz]);
}

function functionTypeChange(e)
{
	console.log(e);
	obj.returnType=parseInt(e.selectedIndex);
	console.log(obj.returnType);
}

function paramNameChange(e)
{
	let id=parseInt(e.id);
	obj.paramaters[id].name=e.value.slice();
	console.log(obj.paramaters[id].name);
}

function multipleTestCaseChange(e)
{
	obj.multipleTestCase=e.checked;
	console.log(obj.multipleTestCase);	
}


function commentChange(e)
{
	obj.comment=e.value.slice();
	console.log(obj.comment);
}

function functionNameChange(e)
{
	obj.functionName=e.value.slice();
	console.log(obj.functionName);
}


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
	generateHTMLCode(id)
	{
		let s=""
		s+="<tr>";

		s+="<td>";
		s+="<select class='custom-select' onchange='paramTypeChange(this)'  id='"+id+"'>";
		for(let i=0;i<availableTypes.length;i++)
		{
			s+="<option ";
				if(this.type==i)
					s+=" selected ";

			s+=" value="+i+">";
			s+=availableTypes[i];
			s+="</option>";
		}
		s+="</select>";
		s+="</td>"

		s+="<td>";
		s+="<input class='custom-select' type='text' placeholder='param name' onkeyup='paramNameChange(this)'  id='"+id+"'  value='"+this.name+"'>";
		s+="</td>"

		for(let i=0;i<availableTypesDimensions[this.type];i++)
		{
			s+="<td>";
			s+="<input class='form-control' aria-describedby='basic-addon1' type='text' onchange='paramSizeChange(this)' placeholder='length of the dimension "+i+"' id='"+id+"'  value='"+this.n[i]+"'  dimension='"+i+"'>";
			s+="</td>";
		}

		s+="<td>";
		s+="<button type='button' class='btn btn-secondary btn-sm' id='"+id+"' onclick='removeParameter(this)'>&#x274C;</button>";
		s+="</td>";

		s+="</tr>"
		return s;
	}
}

class Function{
	constructor()
	{
	//this.void=false;
	this.comment="";
	this.functionName="";
	this.multipleTestCase=false;
	this.returnType=0;
	this.paramaters=new Array();
	}
}
let obj = new Function();



function addParameter()
{
	let o = new Parameter();
	obj.paramaters.push(o);
	displayParameter();
}

function displayParameter()
{
	document.getElementById("param").textContent="";
		
	let s="<table>";
	for(let i=0;i<obj.paramaters.length;i++)
	{
		s+=obj.paramaters[i].generateHTMLCode(i);
	}
	s+="</table>";

	document.getElementById("param").innerHTML=s;

	console.log(s);
}

function displayReturnType()
{
	document.getElementById("returnType").textContent="";
		
	let s="";

	s+="<select onchange='functionTypeChange(this)' class='custom-select' id='inputGroupSelect01' >";
		for(let i=0;i<availableReturnTypes.length;i++)
		{
			s+="<option ";
				if(obj.returnType==i)
					s+=" selected ";

			s+=" value="+i+">";
			s+=availableReturnTypes[i];
			s+="</option>";
		}
	s+="</select>";
	document.getElementById("returnType").innerHTML=s;

	console.log(s);
}