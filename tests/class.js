'use strict';

const test = require('tape');
const wrapClass = require('../lib/class');

const body = document.body;
const classes = wrapClass(body);

body.className = '';

test('should add, delete, clear and test for classes', assert => {
    assert.equal(classes.size, 0, 'initially empty');

    classes.add('test');
    assert.equal(body.classList[0], 'test', 'add class');
    assert.ok(classes.has('test'), 'has class');

    assert.equal(classes.size, 1, 'update length');

    body.className = '';
    assert.ok(!classes.has('test'), 'has class after dom emptied');
    body.className = 'test';
    assert.ok(classes.has('test'), 'has class after dom addition');

    classes.add('foo').add('bar');
    assert.ok(classes.has('foo'), 'prepare for deletion');
    assert.ok(classes.delete('foo'), 'delete foo');
    assert.ok(!classes.has('foo'), 'remove class');
    assert.ok(!classes.delete('foo'), 'no "foo" to delete');
    assert.ok(classes.has('bar'), 'keep other classes');

    classes.add('foo');
    const domlength = body.className.length, setlength = classes.size;
    classes.add('foo');
    assert.equal(domlength, body.className.length, 'do not add duplicates in DOM');
    assert.equal(setlength, classes.size, 'do not add duplicates in the set');

    classes.clear();
    assert.equal(body.className, '', 'clear classes');
    assert.equal(classes.size, 0, 'length := 0');

    assert.end();
});

test('should implement iterators', assert => {
    const classNames = ['a', 'b', 'c'];
    body.className = classNames.join(' ');

    const entries = classes.entries();

    assert.equal(typeof entries, 'object', 'entries() iterator');
    assert.same(entries.next().value, ['a', 'a']);
    assert.same(entries.next().value, ['b', 'b']);
    assert.same(entries.next().value, ['c', 'c']);
    assert.ok(entries.next().done, 'finished');

    const values = classes.values();

    assert.equal(typeof values, 'object', 'values() iterator');
    assert.same(values.next().value, 'a');
    assert.same(values.next().value, 'b');
    assert.same(values.next().value, 'c');
    assert.ok(values.next().done, 'finished');

    const keys = classes.keys();

    assert.equal(typeof keys, 'object', 'keys() iterator');
    assert.same(keys.next().value, 'a');
    assert.same(keys.next().value, 'b');
    assert.same(keys.next().value, 'c');
    assert.ok(keys.next().done, 'finished');

    let i = 0;

    for (let cls of classes) {
        assert.equal(cls, classNames[i], 'for - of iteration');
        i += 1;
    }

    i = 0;
    classes.forEach(cls => {
        assert.equal(cls, classNames[i], 'forEach iteration');
        i += 1;
    });

    assert.end();
});
