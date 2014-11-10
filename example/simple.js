// compile template
var fs = require('fs');
var template = require('../rc-compiler').compile(fs.readFileSync('./templates/simple.html'));

// render template
var html = template({
    title: 'Page title',
    users: [
        {name: 'Maria', age: 27},
        {name: 'Mike', age: 32}
    ],
    showUsers: true
});

console.log(html);
