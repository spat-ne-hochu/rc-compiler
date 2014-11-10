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
<div rc-if="showUsers">
	<ul>
		<li rc-repeat="users[user]">
			<span rc-repeat-obj="user{prop}">
				<b>{{$key}}:</b>
				{{prop}}
			</span>
		</li>
	</ul>
</div>
```

js:
> ```javascript
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
```

result:
> ```html
<h3>Page title</h3>
<div>
	<ul>
		<li>
			<span>
				<b>name:</b>
				Maria
			</span><span>
				<b>age:</b>
				27
			</span>
		</li><li>
			<span>
				<b>name:</b>
				Mike
			</span><span>
				<b>age:</b>
				32
			</span>
		</li>
	</ul>
</div>
```

bechmark:
---------
this small example render **1 000 000** itterations by **~800ms**

support directives:
-------------------

### rc-out
> desc: put variable in this tag.<br/><br/>
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
> desc: show/hide node and childs<br/>
</br>warn! now support **only simple expression** (no this: `a + d.x && b.prop || c.f()`)<br/><br/>
example:
```html
<div rc-if="isAccessible"> ... </div>
```
result: if variable isAccessible is true put this node

---

### rc-repeat
> desc: repeat node by data array<br/><br/>
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

### rc-repeat-obj
> desc: repeat node by data object fields<br/><br/>
example:
```html
<li rc-repeat="users[user]">
	<span rc-repeat-obj="user{prop}">
		<b>{{$key}}:</b>
		{{prop}}
	</span>
</li>
```
result: 
```html
<li>
	<span>
		<b>name:</b>
		Maria
	</span>
	<span>
		<b>age:</b>
		27
	</span>
</li>
<li>
	<span>
		<b>name:</b>
		Mike
	</span>
	<span>
		<b>age:</b>
		32
	</span>
</li>
```
