/* @license GPLv3 */
import YAML from 'yamljs';

(function (glob) { // IIFE pattern
  'use strict';

  function loadinput(callback) {
    var yamlinp = document.querySelector('#input').value
    glob.data = YAML.parse(yamlinp)
    if (callback) callback(glob.data)
  }
  function viewinput(inp) {
  	let q = document.querySelector('#questions'),
  	    o = document.querySelector('#output')
  	let msg = 'FIXME not implemented yet, pleas see window.data'
  	q.value = msg
  	glob.customFunc(inp,q,o)
  }
  document.querySelector('#loadbtn').addEventListener('click',() => loadinput(viewinput))
  
  
  let not_used_datatypes = {
  	'form' : [ 'string','number','integer','boolean','null','enum','object','array']
  }
  let type_to_form_types = {
  	'boolean' : 'boolean',
  	'null' : 'null', //not sure what to do with this
  	'float' : 'integer', //'number', // the number field are named numbers
  	'integer' : 'integer',
  	'array' : 'array',
  	'object' : 'object',
  	'date' : 'data',
  	'string' : 'string'
  }
  let not_used_formdef =   {"definitions": {
      "address": {
        "type": "object",
        "properties": {
          "street_address": {
            "type": "string"
          },
          "city": {
            "type": "string"
          },
          "state": {
            "type": "string"
          }
        },
        "required": [
          "street_address",
          "city",
          "state"
        ]
      }}}
  
  function get_type(inp) {
  	let t = typeof inp
  	if ( ['boolean','null'].includes(t) ) return t
  	if ( ['undefined','function','symbol','bigint'].includes(t) )
  	  throw 'cannot get type ' + t + ' from JSON'
  	if (t === 'number') {
  		if (! isNaN(parseFloat(inp)) && parseInt(inp).toString() !== inp.toString()) return 'float'
  		if (! isNaN(parseInt(inp))) return 'integer'
  		return t
  	}
  	if (t === 'object') {
  		if (Array.isArray(inp)) return 'array'
  		return t
  	}
  	if (t === 'string') {
  		if (! isNaN(Date.parse(inp)) && inp.length >= 8) return 'date'
  		return t
  	}
  	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof
  	throw 'unknown type ' + t
  }
  
  
  function convert_to_form_elem(inp, title = 'title'){
  	//let results = []
  	let t = get_type(inp)
  	let ft = type_to_form_types[t]
  	let result = {
  		'title': title,
  		'description': 'Example value: ' + inp.toString().split('\n')[0],
  		'type' : ft
  	}
  	if (['integer', 'string'].includes(t)) result.enum = [inp]
  	if (t === 'date'){
  		result.type = 'string'
  		//result["$ref"] = "#/definitions/date"
  		result.format = 'date'
  		return result
  	}
  	if (t === 'object'){
  		result.properties = []
  		for (const [key, value] of Object.entries(inp)) {
  		  let prop = convert_to_form_elem(value, key)
  		  result.properties.push(prop)
  	  }
  	}
  	if (t === 'array'){
  		let arrayitem
  		if (inp.length) arrayitem = convert_to_form_elem(inp[0])
  		else arrayitem = 'examplestring'
  		result.items = arrayitem
  	}
  	return result
  }
  
  window.customFunc = function (inp,q,o) {
  	let schema = convert_to_form_elem(inp)
  	//let str = JSON.stringify(schema)
  	console.log(schema)
  	//console.log(str)
  	const Form = JSONSchemaForm.default
  	
  	q.innerHTML = ''
  /*
    ReactDOM.render((
  	  <Form schema={schema} />
  	), q)
  */
    ReactDOM.render( /*#__PURE__*/React.createElement(Form, {
      schema: schema
    }), q)
  }



}(typeof window !== 'undefined' ? window : global))
