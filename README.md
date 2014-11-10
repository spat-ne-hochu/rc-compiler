rc-compiler
===========

very fast js compiler angular-way style
version 0.1.1
warning! must be bugs!

usage:
======

template.html:
<h3 rc-out="title"></h3>
<ul>
	<li rc-repeat="users[user]">
		{{user.name}} ({{user.age}})
	</li>
</ul>

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

result:
<h3>Page title</h3>
<ul>
	<li>Maria (27)</li>
	<li>Mike (32)</li>
</ul>

bechmark:
=========
this small example render 1 000 000 itteration by ~500ms

support directives:
===================

rc-out
======
desc: put variable in this tag.
example: <title rc-out="title"></title>
result: <title>Page title</title>

rc-if
======
desc: show/hide tag (& childs)
example: <div rc-if="isAccessible"> ... </div>
result: if variable isAccessible==true put this node

rc-repeat
======
desc: repeat tag for date
example: <li rc-repeat="users[user]">{{user.name}} ({{user.age}})</li>
result: <li>Maria (27)</li><li>Mike (32)</li> ...

