/*
 * RC-compiler
 * very fast js compiler angular-way style
 *
 * short example:
 * html:<h3 rc-out="title"></h3> -->
 * return '<h3>' + view.title + '</h3>';
 *
 * https://github.com/spat-ne-hochu/rc-compiler
 *
 * Copyright (c) 2014 spat.ne.hochu <spat.ne.hochu@gmail.com>
 * Licensed under the MIT license.
 */

function interpolate(text) {
    "use strict";
    var code = "'" + text + "'";
    code = code
        .replace(/\{\{/g, "' + view.")
        .replace(/}}/g, " + '")
        .replace(/\r/g, '\\r')
        .replace(/\n/g, '\\n')
        .replace(/\t/g, '\\t');
    return "html += " + code + ";" + "\r\n";
}

function _printNodeStart(node, shared) {
    "use strict";
    var code = "html += '<" + node.name + "';" + "\r\n", i;
    for (i in node.attrs) if (node.attrs.hasOwnProperty(i)) {
        code += "html += ' " + i + "=\"';" + "\r\n";
        code += interpolate(node.attrs[i], shared);
        code += "html += '\"'" + "\r\n";
    }
    code += "html += '>';" + "\r\n";
    return code;
}

function _printNodeEnd(node) {
    "use strict";
    var str = '</' + node.name + '>';
    return "html += '" + str + "';" + "\r\n";
}

function rcOut(node, value, shared) {
    "use strict";
    var code = '';
    code += _printNodeStart(node, shared);
    code += "html += view." + value + ";" + "\r\n";
    code += _printNodeEnd(node, shared);
    return code;
}

function rcIf(node, value, shared) {
    "use strict";
    var code = '';
    code += "if (view." + value + ") {" + "\r\n";
    code += compileNode(node, shared);
    code += "}" + "\r\n";
    return code;
}

function rcRepeat(node, value, shared) {
    "use strict";
    ++shared.repeatStack;
    var code = '';
    var repeatValue = value;
    var repeatRegexp = /^(.*)\[(.*)]$/;
    var match = repeatValue.match(repeatRegexp);
    var items = match[1];
    var item = match[2];
    var iterator = '$itr_' + shared.repeatStack;
    code += "var " + iterator + ", length = view." + items + ".length;" + "\r\n";
    code += "for (" + iterator + "=0; " + iterator + "<length; ++" + iterator + ") {" + "\r\n";
    code += "view.$index = " + iterator + ";" + "\r\n";
    code += "view." + item +" = view." + items + "[" + iterator + "];" + "\r\n";
    code += compileNode(node, shared);
    code += "}" + "\r\n";
    --shared.repeatStack;
    return code;
}

function rcRepeatObj(node, value, shared) {
    "use strict";
    ++shared.repeatStack;
    var code = '';
    var repeatValue = value;
    var repeatRegexp = /^(.*)\{(.*)}$/;
    var match = repeatValue.match(repeatRegexp);
    var items = match[1];
    var item = match[2];
    var iterator = '$itr_' + shared.repeatStack;
    code += "var " + iterator + ";" + "\r\n";
    code += "for (" + iterator + " in view." + items + ") {" + "\r\n";
    code += "view.$key = " + iterator + ";" + "\r\n";
    code += "view." + item +" = view." + items + "[" + iterator + "];" + "\r\n";
    code += compileNode(node, shared);
    code += "}" + "\r\n";
    --shared.repeatStack;
    return code;
}

function simple(node, shared) {
    "use strict";
    var code = '';
    code += _printNodeStart(node, shared);
    code += children(node, shared);
    code += _printNodeEnd(node, shared);
    return code;
}

function children(node, shared) {
    "use strict";
    var i, length = node.child.length, code = '';
    for (i = 0; i < length; ++i) {
        code += compileNode(node.child[i], shared);
    }
    return code;
}

function compileNode(htmlNode, shared) {
    "use strict";
    var code = '', val;
    if (htmlNode.type === 'html') {
        if (htmlNode.attrs['rc-repeat']) {
            val = htmlNode.attrs['rc-repeat'];
            delete htmlNode.attrs['rc-repeat'];
            code += rcRepeat(htmlNode, val, shared);
            return code;
        }
        if (htmlNode.attrs['rc-repeat-obj']) {
            val = htmlNode.attrs['rc-repeat-obj'];
            delete htmlNode.attrs['rc-repeat-obj'];
            code += rcRepeatObj(htmlNode, val, shared);
            return code;
        }
        if (htmlNode.attrs['rc-if']) {
            val = htmlNode.attrs['rc-if'];
            delete htmlNode.attrs['rc-if'];
            code += rcIf(htmlNode, val, shared);
            return code;
        }
        if (htmlNode.attrs['rc-out']) {
            val = htmlNode.attrs['rc-out'];
            delete htmlNode.attrs['rc-out'];
            code += rcOut(htmlNode, val, shared);
            return code;
        }
        code += simple(htmlNode, shared);
        return code;
    }
    if (htmlNode.type === 'text') {
        code += interpolate(htmlNode.text, shared);
        return code;
    }
    if (htmlNode.type === 'root') {
        return children(htmlNode, shared);
    }
}

function compile(html) {
    "use strict";
    var parser = require('./rc-parser/rc-parser');
    var htmlRoot = parser.parse(html);
    var shared = {
        repeatStack: 0
    };
    var code = "var html = '';" + "\r\n";
    code += compileNode(htmlRoot, shared);
    code += "return html;";
    //console.log(code);
    return new Function('view', code);
}

exports.compile = compile;
