function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var view = {};

var digits = {}, count = 1000000, i;
for(i = 0; i < count ; ++i) {
    digits[i + '_' + getRandomInt(0, 1000000)] = getRandomInt(0, 512);
}

/*view.numbers = digits;

view.numbers = (view.numbers instanceof Array) ? view.numbers : [];
var length = view.numbers.length;
var limit = Math.ceil(length/7), $itr_1;
for ($itr_1=0; $itr_1 < length; $itr_1+=limit) {
    view.part = view.numbers.slice($itr_1, $itr_1 + limit);
    console.log($itr_1, limit, view.part.length);
}*/

var key, sum= 0, start = Date.now();
for(key in digits) {
    sum += digits[key];
}
console.log(sum);
console.log('test 1: ', Date.now()-start);

start1 = Date.now();
var keys = Object.keys(digits);
//console.log('test 2 / part 1: ', Date.now()-start1);
start2 = Date.now();
var length = keys.length;
for (i=0;i<length;++i) {
    sum += digits[keys[i]];
}
console.log('test 2 / part 2: ', Date.now()-start1);

