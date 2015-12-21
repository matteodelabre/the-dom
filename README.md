# the-dom

A lightweight module providing a clean API to work with DOM nodes.

[![npm version](https://img.shields.io/npm/v/the-dom.svg?style=flat-square)](https://www.npmjs.com/package/the-dom)
[![npm downloads](https://img.shields.io/npm/dm/the-dom.svg?style=flat-square)](https://www.npmjs.com/package/the-dom)
[![build status](https://img.shields.io/travis/matteodelabre/the-dom.svg?style=flat-square)](https://travis-ci.org/matteodelabre/the-dom)
[![dependencies status](http://img.shields.io/david/matteodelabre/the-dom.svg?style=flat-square)](https://david-dm.org/matteodelabre/the-dom)

The DOM is the result of years of implementation-specific inventions kept
for backwards compatibility and patterns that simply have no place in
Javascript. This makes **the DOM slow and ugly.**
While we can't easily solve the performance issues, this module attempts
to make the DOM API more usable.

## Install

```sh
npm install --save the-dom
```

## Usage

You can use this module in a browser (using [browserify](https://npmjs.com/package/browserify))
or with Node.JS. Use the `html()` method to import an HTML document and start working, or
the more generic `import()` method to import any kind of DOM node.

### Example

Consider the following HTML document:

```html
<!doctype html>
<head><!-- ... --></head>
<body>
    <div>
        <h1>Section 1</h1>

        <div class="clickable">Test</div>
    </div>
    <div>
        <h1>Section 2</h1>

        <div class="clickable">Test</div>
    </div>
</body>
```

The following script:

```js
const dom = require('the-dom').html(document);
const body = dom.body;

body.findAll('div')
    .filter(el => el.class.has('clickable'))
    .on('click', () => alert('clicked!'));
```

would alert every time you click on a div that has the `clickable` class.
The `findAll()` methods returns an augmented Array that makes it possible
to filter DOM nodes based on their attributes or contents.

### Reference

With `the-dom`, you can:

1. [Find children](#finding-children)
2. [Navigate in the tree](#navigating-in-the-tree)
3. [Change classes and styles](#changing-classes-and-styles)
4. [Listen to events](#listening-to-events)
5. [Add and remove elements](#adding-and-removing-elements)
6. [Change contents](#changing-contents)
7. [Something else?](#something-else)

#### Finding children

Given any node, you can search among its children elements using
the `find()` and `findAll()` methods.

```js
body.findAll('div'); // returns an Array[] of all divs inside the body
body.find('span'); // returns the first span element, or null if there is no span element
```

The fact that `find()` returns `null` when there is no
matches unlike other DOM modules like jQuery will throw
errors whenever you try to call a method on it:

```js
body.find('span').style.set('color', 'red');
// will throw if there is no span element
```

This enables you to identify problems right from the source,
rather than wondering why a statement has no effect.

#### Navigating in the tree

You can access the element's neighborhood easily without
needing to remember complex names like `nextElementSibling`.

```js
body.find('h1').following.children[0];
// you guessed it, this will return the first children of
// the element following the first h1 in the body
```

Use `following`, `preceding`, `parent` and `children` to
get to the element you want quickly. You can also check whether
two elements are at a given relative position:

```js
el1.follows(el2); // true if el2 is after el1 in the tree
body.contains(el1); // true if el1 is in the body
```

Use `precedes()`, `follows()`, `contains()` and `contained()`
to check relative positions.

#### Changing classes and styles

Classes and styles of an element are exposed through
a natural API that replicates `Set`s and `Map`s.
`element.style` is a `Map` of properties to their values,
so you can call
[any method that can be called on a `Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
on it. Similarly, `element.class` is a `Set` of classes
and you can call
[any method of `Set`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)
on it.

```js
if (body.class.has('landscape')) {
    body.style.set('background-image', 'images/landscape.jpg');
}
```

#### Listening to events

== TODO ==

#### Adding and removing elements

== TODO ==

#### Changing contents

== TODO ==

#### Something else?

This module is not in its stable state. We have probably
missed some features or added some that aren't necessary.
If you see one, please
[fill in an issue](https://github.com/matteodelabre/the-dom/issues/new)
(or maybe [fix it by yourself?](https://github.com/matteodelabre/the-dom/pulls/new/master))
so that we can try to fix that as soon as possible.

In the meantime, please consider that due to this module being
unstable, its API might change anytime. While we are in the
0.x.x series, a minor bump means that we added or removed a feature, or changed
the way a feature works. Please review this repo before upgrading.

## Contributing

Check out the [contribution guide.](https://github.com/matteodelabre/the-dom/blob/master/CONTRIBUTING.md)

## License

This module is dedicated to the public domain with hope that
it will be useful to others. **No rights reserved.** For more information,
see the [LICENSE.](https://github.com/matteodelabre/the-dom/blob/master/LICENSE)
