function generateDigits() {
    var digits = [], count = getRandomInt(34, 89), i;
    for (i = 0; i < count; ++i) {
        digits[i] = getRandomInt(0, 512);
    }
    return digits;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// compile template
var fs = require('fs');
var template = require('../rc-compiler').compile(fs.readFileSync('./templates/simple.html'));

// template variables
var view = {
    title: 'Page title',
    users: [
        {name: 'Maria', age: 27},
        {name: 'Mike', age: 32}
    ],
    showUsers: true
};


var http = require('http');
http.createServer(function(request, response) {
    response.setHeader("Content-Type", "text/html");
    response.writeHead(200);
    view.numbers = generateDigits();
    response.write(template(view));
    response.end();
}).listen(80);
