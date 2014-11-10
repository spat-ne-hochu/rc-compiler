rc-compiler
===========

**very fast** js compiler angular-way style<br/>
version **0.1.1**<br/>
**warning! must be bugs!**

usage:
------

template.html:
> ```html
<h3 rc-out="title"></h3>
<ul>
	<li rc-repeat="users[user]">{{user.name}} ({{user.age}})</li>
</ul>
```

js:
> ```javascript
// template is a fast js function;
var template = require('rc-compiler').compile(fs.readFileSync('template.html'));
// render template
var html = template({
	title: 'Page title',
	users: [
    		{name: 'Maria', age: 27},
    		{name: 'Mike', age: 32}
  	]
});
```

result:
> ```html
<h3>Page title</h3>
<ul>
	<li>Maria (27)</li>
	<li>Mike (32)</li>
</ul>
```

bechmark:
---------
this small example render **1 000 000** itterations by **~500ms**

support directives:
-------------------

### rc-out
> desc: put variable in this tag.

example: 
```html
<title rc-out="title"></title>
```
result: 
```html
<title>Page title</title>
```

---

### rc-if
> desc: show/hide node and childs</br>
</br>warn! now support **only simple expression** (no this: `a + d.x && b.prop || c.f()`)</br>
example:
```html
<div rc-if="isAccessible"> ... </div>
```
result: if variable isAccessible is true put this node

---

### rc-repeat
> desc: repeat node by data array</br>
example:
```html
<li rc-repeat="users[user]">{{user.name}} ({{user.age}})</li>
```
result: 
```html
<li>Maria (27)</li>
<li>Mike (32)</li>
```

---
