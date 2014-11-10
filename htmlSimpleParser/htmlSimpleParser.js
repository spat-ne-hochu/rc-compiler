function parse(str) {
    "use strict";
    var tagRegexp = /(<(\/)?([^>]*)>)|([^<>]+)/g;
    var inTagRegexp = /([a-z1-9-]+)(=('([^']+)'|"([^"]+)"|([^\s]+)))?/g;
    var match;

    var rootTag = {
        type: 'root',
        child: []
    };

    var currentTag = rootTag;
    var tagStack = [];

    while ((match = tagRegexp.exec(str)) != null) {
        var isClosed = typeof match[2] !== 'undefined';
        var isText = typeof match[1] === 'undefined' && typeof match[2] === 'undefined' && typeof match[3] === 'undefined' && typeof match[4] !== 'undefined';
        var content = match[3];
        var text = match[4];
        var tag = {
            type: isText ? 'text' : 'html'
        };
        if (!isText) {
            tag.attrs = {};
            tag.child = [];
            var componentMatch;
            while ((componentMatch = inTagRegexp.exec(content)) != null) {
                var propertyName = componentMatch[1];
                if (!tag.name) {
                    tag.name = propertyName;
                } else {
                    tag.attrs[propertyName] = componentMatch[4] || componentMatch[5] || componentMatch[6] || propertyName;
                }
            }
        } else {
            tag.text = text;
            tag.name = '$TEXT';
        }

        if (!isClosed) {
            currentTag.child.push(tag);
            tag.parent = currentTag;
            if (tag.type != 'text') {
                currentTag = tag;
                tagStack.push(tag.name);
            }
        } else {
            while (tagStack[tagStack.length - 1] != tag.name) {
                //console.log('warning: ', tagStack[tagStack.length-1], ' <> ', tag.name, tagStack[tagStack.length-1] != tag.name);
                currentTag = currentTag.parent;
                tagStack.length--;
            }
            currentTag = currentTag.parent;
            tagStack.length--;
        }
    }

    return rootTag;
}

exports.parse = parse;
