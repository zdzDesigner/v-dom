
var _tmpl = (function() {

    var cache = {},

        // find variable names
        re_vars = /("|').+?[^\\]\1|\.\w*|\w*:|\b(?:this|true|false|null|new|typeof|Number|String|Object|Array|Math|Date)\b|([a-z_]\w*)/gi
        // [ 1            ][ 2  ][ 3 ][ 4                                                                         ][ 5       ]
        // 1. skip quoted strings: "a b", 'a b', 'a \'b\''
        // 2. skip object properties: .name
        // 3. skip object literals: name:
        // 4. skip reserved words
        // 5. match var name

    // build a template (or get it from cache), render with data

    return function(str, data) {
        // //////////////console.log(str, data)

        return str && (cache[str] = cache[str] || tmpl(str))(data)
    }


    // create a template instance

    function tmpl(s, p) {
        p = (s || '{}')

        // temporarily convert \{ and \} to a non-character
        .replace(/\\{/g, '\uFFF0')
            .replace(/\\}/g, '\uFFF1')

        // split string to expression and non-expresion parts
        .split(/({[\s\S]*?})/)

        return new Function('d', 'return ' + (

                // is it a single expression or a template? i.e. {x} or <b>{x}</b>
                !p[0] && !p[2]

                // if expression, evaluate it
                ? expr(p[1])

                // if template, evaluate all expressions in it
                : '[' + p.map(function(s, i) {
                    // //////////////console.log('p',s)
                    // is it an expression or a string (every second part is an expression)
                    return i % 2

                    // evaluate the expressions
                        ? expr(s, 1)

                    // process string parts of the template:
                    : '"' + s

                    // preserve new lines
                        .replace(/\n/g, '\\n')

                    // escape quotes
                    .replace(/"/g, '\\"')

                    + '"'

                }).join(',') + '].join("")'
            )

            // bring escaped { and } back
            .replace(/\uFFF0/g, '{')
            .replace(/\uFFF1/g, '}')

        )

    }


    // parse { ... } expression

    function expr(s, n) {
        s = s

        // convert new lines to spaces
            .replace(/\n/g, ' ')

        // trim whitespace, curly brackets, strip comments
        .replace(/^[{ ]+|[ }]+$|\/\*.+?\*\//g, '')

        // is it an object literal? i.e. { key : value }
        return /^\s*[\w-"']+ *:/.test(s)

        // if object literal, return trueish keys
        // e.g.: { show: isOpen(), done: item.done } -> "show done"
        ? '[' + s.replace(/\W*([\w-]+)\W*:([^,]+)/g, function(_, k, v) {

            // safely execute vars to prevent undefined value errors
            return v.replace(/\w[^,|& ]*/g, function(v) {
                return wrap(v, n)
            }) + '?"' + k + '":"",'

        }) + '].join(" ")'

        // if js expression, evaluate as javascript
        : wrap(s, n)

    }


    // execute js w/o breaking on errors or undefined vars

    function wrap(s, nonull) {
        return '(function(v){try{v='

        // prefix vars (name => data.name)
        +(s.replace(re_vars, function(s, _, v) {
                return v ? 'd.' + v : s
            })

            // break the expression if its empty (resulting in undefined value)
            || 'x')

        + '}finally{return '

        // default to empty string for falsy values except zero
        + (nonull ? '!v&&v!==0?"":v' : 'v')

        + '}}).call(d)'
    }

})()
module.exports = _tmpl