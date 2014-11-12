var fs = require('fs'),
    html = fs.readFileSync('../templates/simple.html'),
    rc = require('../../rc-compiler'),
    template, outHtml, startTime, i, limit;

var digits = [], count = getRandomInt(34,89);
for(i = 0; i < count ; ++i) {
    digits[i] = getRandomInt(0, 512);
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Compile test
limit = 1000;
startTime = Date.now();
for (i = 0; i < limit; ++i) {
    template = rc.compile(html);
}
console.log('test compile ' + limit + ' iterations: ' + (Date.now() - startTime) + 'ms');

// Render test
limit = 1E5;
startTime = Date.now();
for (i = 0; i < limit; ++i) {
    outHtml = template({
        title: 'Page title',
        users: [
            {name: 'Maria', age: 27},
            {name: 'Mike', age: 32}
        ],
        showUsers: true,
        numbers: digits
    });
}
console.log('test render ' + limit + ' iterations: ' + (Date.now() - startTime) + 'ms');

console.log('result html:\r\n', outHtml);
