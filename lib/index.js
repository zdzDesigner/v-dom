/**
 * Vdom.js
 */
var virtual_dom = require('virtual-dom/'),
	diff = virtual_dom.diff,
	patch = virtual_dom.patch,
	createElement = virtual_dom.create

var virtual_dom_bind_data = require('./virtual-dom-bind-data')

function Vdom (elemt,tpl,data_fn) {

	data_fn.prototype = this
	this.tpl = tpl
	var data = new data_fn()
	data.constructor = data_fn
	
	var virtual_dom = virtual_dom_bind_data(data)
	this.rootNode = createElement(virtual_dom)
	this.old_virtual_dom = virtual_dom
	elemt.appendChild(this.rootNode)
	
}


module.exports = function (elemt,tpl,data) {
	return new Vdom(elemt,tpl,data)
}
if(window) window.vdom = module.exports



Vdom.prototype.update = function () {
	
	var new_virtual_dom= virtual_dom_bind_data(this)
	var patches = diff(this.old_virtual_dom,new_virtual_dom)
	this.rootNode = patch(this.rootNode, patches)
	this.old_virtual_dom = new_virtual_dom
}
