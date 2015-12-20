'use strict';

const test = require('tape');
const node = require('../lib/node');

const body = document.body;
const head = document.head;

// inject test elements
head.innerHTML = `
<meta charset="utf-8">
<title>This is a test title</title>
`;

body.innerHTML = `
<div class="test" style="color: red"></div>
<div class="test2" style="color: red"></div>
`;

const div = document.getElementsByTagName('div')[0];
const title = document.getElementsByTagName('title')[0];

test('should wrap any node', assert => {
    assert.equal(typeof node(body), 'object', 'wrap body');
    assert.equal(typeof node(head), 'object', 'wrap head');

    assert.end();
});

test('should provide access to the unwrapped node', assert => {
    assert.equal(node(body).node, body, 'unwrap body');
    assert.equal(node(head).node, head, 'unwrap head');

    assert.end();
});

test('should traverse children', assert => {
    assert.equal(node(body).find('div').node, div, 'find div in body');
    assert.equal(node(head).find('title').node, title, 'find title in head');
    assert.equal(node(body).find('undef'), null, 'don\'t wrap null');

    // assert.equal(node(body).findAll('div').length, 2, 'find all divs');

    assert.end();
});

test('should move in the DOM tree', assert => {
    assert.equal(node(body).find('div').parent().node, body, 'div parent');
    // assert.equal(node(head).children()[1], node(title), 'head children');



    assert.end();
});

test('should access and set els properties and attributes', assert => {
    assert.equal(node(body).getType(), 'body', 'body type');
    assert.equal(node(body).getKind(), 'element', 'body kind');
    assert.equal(node(document).getKind(), 'document', 'doc kind');
    assert.equal(node(head).find('meta').getAttr('charset'), 'utf-8', 'get charset attribute');

    node(div).setAttr('data-test', 'true');
    assert.equal(node(div).getAttr('data-test'), 'true', 'set test attribute');

    assert.end();
});

test('should manipulate class names as a set', assert => {
    let divNode = node(div);

    assert.ok(divNode.class.has('test'), 'div has `test` class');
    assert.equal(divNode.class.size, 1, 'div has 1 class');

    divNode.class.add('added-class');
    assert.ok(divNode.class.has('added-class'), 'add class');
    assert.equal(div.classList[1], 'added-class', 'add class in dom');

    divNode.class.delete('test');
    assert.ok(!divNode.class.has('test'), 'remove class');
    assert.equal(div.classList[1], undefined, 'remove class from dom');

    divNode.class.clear();
    assert.equal(divNode.class.size, 0, 'empty class');

    div.className = 'update';
    assert.ok(divNode.class.has('update'), 'update additions from dom');

    div.className = '';
    assert.ok(!divNode.class.has('update'), 'update removals from dom');

    assert.end();
});

test('should manpulate styles as a map', assert => {
    let divNode = node(div);

    assert.ok(divNode.style.has('color'), 'div has `color` style');
    assert.equal(divNode.style.get('color'), 'red', 'color is red');

    divNode.style.set('color', 'yellow');
    assert.equal(divNode.style.get('color'), 'yellow', 'set color to yellow');
    assert.equal(div.style.color, 'yellow', 'set color in DOM');

    divNode.style.delete('color');
    assert.equal(divNode.style.get('color'), null, 'remove color');
    assert.equal(divNode.style.size, 0, 'update styles length');
    assert.equal(div.style.color, '', 'remove color from DOM');

    divNode.style.set('font-size', '2em');
    assert.equal(divNode.style.get('font-size'), '2em', 'add new style');
    assert.equal(divNode.style.size, 1, 'update styles length');
    assert.equal(div.style.fontSize, '2em', 'add style in DOM');

    div.style.fontSize = '';
    assert.equal(divNode.style.get('font-size'), null, 'update removals from DOM');

    div.style.color = 'black';
    assert.equal(divNode.style.get('color'), 'black', 'update additions from DOM');

    divNode.style.clear();
    assert.equal(divNode.style.size, 0, 'empty styles');
    assert.equal(div.style.length, 0, 'empty styles in DOM');

    assert.end();
});

test('should change content', assert => {
    let subnode = node(document.createElement('span'));

    assert.equal(subnode.getContent(), '', 'get content');
    subnode.setContent('This is a test');
    assert.equal(subnode.getContent(), 'This is a test', 'change content');

    assert.equal(subnode.getHTML(), 'This is a test', 'get html');
    subnode.setHTML('<span>subtest</span>');
    assert.equal(subnode.getContent(), 'subtest', 'get content inside html');
    assert.equal(subnode.getHTML(), '<span>subtest</span>', 'change html contents');

    assert.equal(subnode.parent(), null, 'new node has no parent');
    node(div).append(subnode);
    assert.equal(subnode.parent().node, div, 'append node');
    subnode.attach(node(body));
    assert.equal(subnode.parent().node, body, 'attach node');

    assert.end();
});

test('should subscribe to events', assert => {
    const handler = e => {
        assert.equal(e.clientX, 100, 'keep event data');
        assert.end();

        node(div).off('click', handler);
    };

    node(div).on('click', handler);

    div.dispatchEvent(new MouseEvent('click', {
        clientX: 100
    }));
});

test('should subscribe to multiple events', assert => {
    const handler = e => {
        assert.equal(e.deltaX, 10, 'keep event data');
        assert.end();

        node(div).off('click wheel', handler);
    };

    node(div).on('click wheel', handler);

    div.dispatchEvent(new WheelEvent('wheel', {
        deltaX: 10
    }));
});

test('should unsubscribe to events', assert => {
    let handler = () => {
        assert.error(new Error('Should not trigger a click'), 'this should not be called');
    };

    node(div).on('click', handler);
    node(div).off('click', handler);

    div.dispatchEvent(new MouseEvent('click'));

    process.nextTick(() => assert.end());
});
