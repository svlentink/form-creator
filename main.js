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

}(typeof window !== 'undefined' ? window : global))
