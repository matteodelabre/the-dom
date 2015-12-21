'use strict';

const test = require('tape');
const wrapStyle = require('../lib/style');

const body = document.body;
const styles = wrapStyle(body);

body.setAttribute('style', 'color: red');

test('should add, delete, clear and test for styles', assert => {
    assert.ok(styles.has('color'), 'check already defined style');
    assert.equal(styles.get('color'), 'red', 'already defined style value');

    styles.set('color', 'yellow').set('color', 'green');
    assert.equal(styles.get('color'), 'green', 'set styles');
    assert.equal(body.style.color, 'green', 'set styles in DOM');

    assert.ok(styles.delete('color'), 'delete style');
    assert.equal(styles.get('color'), undefined, 'return undefined with deleted style');
    assert.equal(styles.size, 0, 'update styles length');
    assert.equal(body.style.color, '', 'delete style from DOM');
    assert.ok(!styles.delete('color'), 'cannot delete twice');

    styles.set('font-size', '2em');
    assert.equal(styles.get('font-size'), '2em', 'add new style');
    assert.equal(styles.size, 1, 'update styles length');
    assert.equal(body.style.fontSize, '2em', 'add style in DOM');

    body.style.fontSize = '';
    assert.equal(styles.get('font-size'), undefined, 'update removals from DOM');

    body.style.color = 'black';
    assert.equal(styles.get('color'), 'black', 'update additions from DOM');

    styles.clear();
    assert.equal(styles.size, 0, 'empty styles');
    assert.equal(body.style.length, 0, 'empty styles in DOM');

    assert.end();
});

test('should implement iterators in styles', assert => {
    const stylesList = [
        ['color', 'blue'],
        ['font-size', '2em'],
        ['font-family', 'Helvetica']
    ];

    body.setAttribute('style', stylesList.map(prop => prop.join(': ')).join(';'));
    const entries = styles.entries();

    assert.equal(typeof entries, 'object', 'entries() iterator');
    assert.same(entries.next().value, stylesList[0]);
    assert.same(entries.next().value, stylesList[1]);
    assert.same(entries.next().value, stylesList[2]);
    assert.ok(entries.next().done, 'finished');

    const values = styles.values();

    assert.equal(typeof values, 'object', 'values() iterator');
    assert.same(values.next().value, stylesList[0][1]);
    assert.same(values.next().value, stylesList[1][1]);
    assert.same(values.next().value, stylesList[2][1]);
    assert.ok(values.next().done, 'finished');

    const keys = styles.keys();

    assert.equal(typeof keys, 'object', 'keys() iterator');
    assert.same(keys.next().value, stylesList[0][0]);
    assert.same(keys.next().value, stylesList[1][0]);
    assert.same(keys.next().value, stylesList[2][0]);
    assert.ok(keys.next().done, 'finished');

    let i = 0;

    for (let stl of styles) {
        assert.equal(stl, stylesList[i][1], 'for - of iteration');
        i += 1;
    }

    i = 0;
    styles.forEach(stl => {
        assert.equal(stl, stylesList[i][1], 'forEach iteration');
        i += 1;
    });

    assert.end();
});
