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
        .replace(/\r/g, '')
        .replace(/\n/g, '')
        .replace(/\t/g, '');
    return "html += " + code + ";" + "\r\n";
}

function _printNodeStart(node, shared) {
    "use strict";
    var code = "html += '<" + node.name + "';" + "\r\n", i;
    for (i in node.attrs) if (node.attrs.hasOwnProperty(i)) {
        code += "html += ' " + i + "=\"';" + "\r\n";
        code += interpolate(node.attrs[i], shared);
        code += "html += '\"';" + "\r\n";
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

function rcDiv(node, value, shared) {
    "use strict";
    ++shared.repeatStack;
    var code = '';
    var repeatValue = value;
    var repeatRegexp = /^(.*)\/([^\s]+)\sas\s(.*)$/;
    var match = repeatValue.match(repeatRegexp);
    var items = match[1];
    var count = match[2];
    var partName = match[3];
    var iterator = '$itr_' + shared.repeatStack;
    var length = '$len_' + shared.repeatStack;
    code += "view." + items + " = (view." + items + " instanceof Array) ? view." + items + " : [];" + "\r\n";
    code += "var " + length + " = view." + items + ".length;" + "\r\n";
    code += "var limit = Math.ceil(" + length + "/" + count + "), " + iterator + ";" + "\r\n";
    code += "for (" + iterator + "=0;" + iterator + " < " + length + "; " + iterator + "+=limit) {" + "\r\n";
    code += "view." + partName + " = view." + items + ".slice(" + iterator + ", " + iterator + " + limit);" + "\r\n";
    code += compileNode(node, shared);
    code += "}" + "\r\n";
    --shared.repeatStack;
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
    var length = '$len_' + shared.repeatStack;
    code += "view." + items + " = (view." + items + " instanceof Array) ? view." + items + " : [];" + "\r\n";
    code += "var " + iterator + ", " + length + " = view." + items + ".length;" + "\r\n";
    code += "for (" + iterator + "=0; " + iterator + "<" + length + "; ++" + iterator + ") {" + "\r\n";
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
        if (htmlNode.attrs['rc-if']) {
            val = htmlNode.attrs['rc-if'];
            delete htmlNode.attrs['rc-if'];
            code += rcIf(htmlNode, val, shared);
            return code;
        }
        if (htmlNode.attrs['rc-div']) {
            val = htmlNode.attrs['rc-div'];
            delete htmlNode.attrs['rc-div'];
            code += rcDiv(htmlNode, val, shared);
            return code;
        }
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
    code = optimizeCode(code);
    //console.log(code);
    return new Function('view', code);
}

function optimizeCode(code) {

    function isText (line) {
        return line.indexOf('html +=') === 0;
    }

    var arr = code.split(/\r\n/g), i, k=-1;
    var result = [], length = arr.length;
    for (i=0;i<length;++i) {
        if (isText(arr[i])) {
            if (i>0 && isText(arr[i-1])) {
                result[k] += ' + ' + arr[i].substring(8, arr[i].length-1);
            } else {
                ++k;
                result[k] = arr[i].substr(0, arr[i].length-1);
            }
        } else {
            if (i>0 && isText(arr[i-1])) {
                result[k] += ';';
            }
            ++k;
            result[k] = arr[i];
        }
    }
    length = result.length;
    for (i=0;i<length;++i) {
        result[i] = result[i].replace(/'\s\+\s'/g, '');
    }
    return result.join("\r\n");
}

exports.compile = compile;
