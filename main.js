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
  	glob.customFunc(inp)
  }
  document.querySelector('#loadbtn').addEventListener('click',() => loadinput(viewinput))
  
/*
  let not_used_datatypes = {
  	'form' : [ 'string','number','integer','boolean','null','enum','object','array']
  }
*/
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
/*
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
*/
  
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
  
  function convert_to_form_elem(inp, title = 'root'){
  	//let results = []
  	let t = get_type(inp)
  	let ft = type_to_form_types[t]
  	
  	let result = {
  		'title': title,
  		'description': 'Example value: ' + inp.toString().split('\n')[0],
  		'type' : ft
  	}
  	if (['integer', 'string'].includes(t) &&
  	    window.confirm("Is field '" + title + "' an enum?"))
  	    result.enum = [inp]
  	if (t === 'date'){
  		result.type = 'string'
  		//result["$ref"] = "#/definitions/date"
  		result.format = 'date'
  		return result
  	}
    if (t === 'object'){
      result.description = 'Example value: ' + JSON.stringify(inp).substr(0,30)
      let keys = Object.keys(inp),
  	      q1 = "Are all the elements of object '" +
  	           title + "' have the same (nested) data structure? (" +
  	           keys + ")",
  	      a1 = true
  	  let previous_type
  	  for (let k in inp) {
  	    let t = typeof inp[k]
  	    if (!previous_type) previous_type = t
  	    if (previous_type !== t) a1 = false
  	  }
  	  if (Object.keys(inp).length === 1) a1 = true
  	  else if (a1) a1 = window.confirm(q1)
  	  let q2 = "Are the keys for object '" +
  	           title + "' expendable? (" +
  	           keys + ")"
  	  let a2
  	  if (q1) a2 = window.confirm(q2)
  	  else a2 = false
  	  
  		result.properties = []
  		let sameobj
  		
  		for (const [key, value] of Object.entries(inp)) {
  		  let prop
  		  if (a1 && sameobj) prop = sameobj
  		  else {
  		    prop = convert_to_form_elem(value, key)
  		    if (a1) sameobj = prop
  		  }
  		  result.properties.push(prop)
  		  if (a2) {
  		    result.additionalProperties = prop
  		    return result
  		  }
  	  }
  	}
  	if (t === 'array'){
  		let arrayitem
  		if (inp.length) arrayitem = convert_to_form_elem(inp[0],title)
  		else arrayitem = 'examplestring'
  		result.items = arrayitem
  	}
  	return result
  }

  function render_form(schema, to_render_in_id = 'preview', callback) {
    let p = document.querySelector('#' + to_render_in_id)
  	const Form = JSONSchemaForm.default

    p.innerHTML = ''
  /*
    ReactDOM.render((
  	  <Form schema={schema} />
  	), q)
  */
    ReactDOM.render( /*#__PURE__*/React.createElement(Form, {
      schema: schema
    }), p,callback)
  } 
  
  window.customFunc = function (inp) {
    let o = document.querySelector('#output'),
  	    schema = convert_to_form_elem(inp)
  	render_form(schema)
  	o.value = JSON.stringify(schema,null,2)
  }


}(typeof window !== 'undefined' ? window : global))
