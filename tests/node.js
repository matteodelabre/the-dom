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
    assert.ok(node(body).find('div').equal(div), 'find div in body');
    assert.ok(node(head).find('title').equal(title), 'find title in head');
    assert.equal(node(body).find('undef'), null, 'don\'t wrap null');
    assert.equal(node(body).findAll('div').length, 2, 'find all divs');
    assert.ok(node(body).findAll('div')[1].equal(node(div).following), 'find all divs');

    assert.end();
});

test('should move in the DOM tree', assert => {
    assert.ok(node(body).find('div').parent.equal(body), 'div parent');
    assert.ok(node(head).children[1].equal(title), 'head children');
    assert.equal(node(title).preceding.name, 'meta', 'before title');
    assert.ok(node(div).following.class.has('test2'), 'after div');

    assert.end();
});

test('should perform position checks', assert => {
    assert.ok(!node(body).precedes(head), 'body does not precede head');
    assert.ok(node(body).follows(head), 'body follows head');
    assert.ok(!node(head).follows(body), 'head does not follow body');
    assert.ok(node(head).precedes(body), 'head precedes body');
    assert.ok(!node(div).contains(body), 'div does not contain body');
    assert.ok(node(body).contains(div), 'body contains div');
    assert.ok(node(div).contained(body), 'div is contained in body');
    assert.ok(!node(body).contained(div), 'body is not contained in div');

    assert.end();
});

test('should access and set els properties and attributes', assert => {
    assert.equal(node(body).name, 'body', 'body name');
    assert.equal(node(body).type, 'element', 'body type');
    assert.equal(node(document).type, 'document', 'doc type');
    assert.equal(node(head).find('meta').getAttr('charset'), 'utf-8', 'get charset attribute');

    node(div).setAttr('data-test', 'true');
    assert.equal(node(div).getAttr('data-test'), 'true', 'set test attribute');

    assert.end();
});

test('should change content', assert => {
    let subnode = node(document.createElement('span'));

    assert.equal(subnode.content, '', 'get content');
    subnode.content = 'This is a test';
    assert.equal(subnode.content, 'This is a test', 'change content');

    assert.equal(subnode.html, 'This is a test', 'get html');
    subnode.html = '<span>subtest</span>';
    assert.equal(subnode.content, 'subtest', 'get content inside html');
    assert.equal(subnode.html, '<span>subtest</span>', 'change html contents');

    assert.end();
});

test('should change tree', assert => {
    let subnode = node(document.createElement('span'));

    assert.equal(subnode.parent, null, 'new node has no parent');
    node(div).append(subnode);
    assert.ok(subnode.parent.equal(div), 'append node');
    subnode.attach(node(body));
    assert.ok(subnode.parent.equal(body), 'attach node');

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
