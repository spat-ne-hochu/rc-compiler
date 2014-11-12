function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var view = {};

var digits = [], count = getRandomInt(34,89), i;
for(i = 0; i < count ; ++i) {
    digits[i] = getRandomInt(0, 512);
}

view.numbers = digits;

view.numbers = (view.numbers instanceof Array) ? view.numbers : [];
var length = view.numbers.length;
var limit = Math.ceil(length/7), $itr_1;
for ($itr_1=0; $itr_1 < length; $itr_1+=limit) {
    view.part = view.numbers.slice($itr_1, $itr_1 + limit);
    console.log($itr_1, limit, view.part.length);
}
