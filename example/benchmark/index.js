var fs = require('fs'),
    html = fs.readFileSync('../templates/simple.html'),
    rc = require('../../rc-compiler'),
    template, outHtml, startTime, i, limit;

// Compile test
limit = 1000;
startTime = Date.now();
for (i = 0; i < limit; ++i) {
    template = rc.compile(html);
}
console.log('test compile ' + limit + ' iterations: ' + (Date.now() - startTime) + 'ms');

// Render test
limit = 1E6;
startTime = Date.now();
for (i = 0; i < limit; ++i) {
    outHtml = template({
        title: 'Page title',
        users: [
            {name: 'Maria', age: 27},
            {name: 'Mike', age: 32}
        ]
    });
}
console.log('test render ' + limit + ' iterations: ' + (Date.now() - startTime) + 'ms');

console.log('result html:\r\n', outHtml);
