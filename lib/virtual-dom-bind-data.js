/**
 * author zdzDesigner on 16.01.03
 * [bind-data.js 抽象html模板为json对象并绑定数据]
 * return virtual dom 
 */
var virtual_dom = require('virtual-dom/'),
    createVNode = virtual_dom.h,
    html_to_js = require("./html-to-js"),
    exp_tmpl = require('./exp-tmpl'),
    camel = require('./word-camel'),
    clone = require('./clone.js')




module.exports = virtual_dom_bind_data


function virtual_dom_bind_data(data) {
    var res = null
    if (!data.html_tree_tpl) {
        html_to_js(data.tpl, function(err, dom) {
            if (err) return callback(err)
            data.constructor.prototype.html_tree_tpl = dom.root[0]
        });
    }

    res = vnode(clone(data.html_tree_tpl), data)
    return res
}

function vnode(parent, data) {
    if (parent.type == "text") return parent.data
    
    if (parent.type != "tag") return

    var children,
        child,
        len,
        i,
        each_itmes

    if (parent.children.length) {
        children = []
        len = parent.children.length
        i = -1

        while (++i < len) {
           
            if (parent.children[i].attributes && parent.children[i].attributes.each) {
           
                each_itmes = parent.children[i].attributes.each.replace(/^[{ ]+|[ }]+$|\/\*.+?\*\//g, '').split(/\s+in\s+/)
           
                data[each_itmes[1]] && data[each_itmes[1]].forEach(function(t, k) {
                        t.t_each_z = true
                        t.index = k

                        child = vnode(parent.children[i], {
                            item: t,
                            i: k,
                            parent: data
                        });
                        if (k < data[each_itmes[1]].length - 1) {
                            children.push(child)
                        }
                    })
              

            } else {
                child = vnode(parent.children[i], data)
            }
            
            if (typeof child === 'string') {

              
                if (data.item && data.item.t_each_z) {

                
                    child = exp_tmpl(child, data)

                } else {
                  
                    child = exp_tmpl(child, data)
                  
                }

            }
            

            if (!child) continue
            
            children.push(child)
        }
    }
    var attributes = parent.attributes

    if (attributes.style) {
       
        if (typeof attributes.style === 'string') {
            attributes.style = compile_style(attributes.style)
        }
    }
    if (attributes['class']){
        attributes.className = attributes['class']
        delete attributes['class']
    }
    
    if (attributes['for']) {
        attributes.htmlFor = attributes['for']
        delete attributes['for']
    }
    if(Object.keys(attributes).length >= 1) {
        
        attributes = compile_exp(attributes, data)
       
    }
  

    return createVNode(parent.name, attributes, children)
}

/** 
 * compile 替换 { %d } 表达式中的站位符号
 * @param  {[type]} attributes [属性集合]
 * @param  {[type]} data       [数据]
 * 遍历属性值中的表达式并用数据替换
 *     如果值为function（方法）则调用通用dom事件 @-1
 *     如果值为style集合对象则再次循环 @-2
 */
var compile_exp = function(attributes, data) {
  
    var fn
    var attrs = clone(attributes)

    for (var key in attrs) {

        if (attrs[key] !='' && typeof attrs[key] === 'string') {
            
            
            if (!/^[{ ]+|[ }]+$|\/\*.+?\*\//g.test(attrs[key])) {
                continue
            }
                
            if (data.item) {
                var attr = attrs[key].replace(/^[{ ]+|[ }]+$|\/\*.+?\*\//g, '')
                attrs[key] = data.item[attr]
                if (!attrs[key]) attrs[key] = data.parent[attr]
            } else {
                
                attrs[key] = exp_tmpl(attrs[key],data)
            }
            
            // @-1
            if (typeof attrs[key] === 'function') {
                
                fn = attrs[key]
                
                attrs[key] = function(e) {
                    
                    e = e || window.event
                    e.which = e.which || e.charCode || e.keyCode
                    e.target = e.target || e.srcElement
                    e.currentTarget = this
                    
                    if (fn.call(data, e ) !== true) {
                        e.preventDefault && e.preventDefault()
                        e.returnValue = false
                    } else {
                        
                        e.stopPropagation()
                        e.cancelBubble = true;
                        return true
                    }

                }
                

            }
            
        }
        // @-2
        if (key === 'style') {
           
            attrs['style'] = compile_exp(attrs['style'], data)
        }
    }
    
    return attrs
}


function compile_style(raw) {
    if (!raw) return {}
    

    var result = {},
        fields = raw.split(/;\s?/),
        len = fields.length,
        i = -1,
        s

    while (++i < len) {
        s = fields[i].indexOf(':')
        result[fields[i].slice(0, s)] = fields[i].slice(s + 1).trim()
    }
   

    return result
}

function createDataSet(props) {
    var dataset
    var key

    for (key in props) {
       
        if (key.slice(0, 5) == 'data-') {
            dataset || (dataset = {})
            dataset[camel(key.slice(5))] = props[key]
        
        }
    }
   

    return dataset
}


