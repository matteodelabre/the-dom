'use strict';

const wrapClass = require('./class');
const wrapStyle = require('./style');
const split = require('./utils').split;

/**
 * Ensure a node is not wrapped before using it in native methods
 *
 * @param {Node|Object} node A node, wrapped or not
 * @return {Node} Unwrapped node
 */
const unwrap = node =>
    (typeof node !== 'object' || node === null || !node.node) ? node : node.node;

/**
 * Turn a NodeList/HTMLCollection into an array
 * for easy manipulation
 *
 * @param {NodeList|HTMLCollection} list Input collection
 * @return {Array} Wrapping array
 */
const wrapList = list => {
    const length = list.length;
    let result = [];

    for (let i = 0; i < length; i += 1) {
        result.push(wrapNode(list.item(i)));
    }

    return Object.assign(result, {
        on: (evts, handler) => {
            result.forEach(node => node.on(evts, handler));
        },

        off: (evts, handler) => {
            result.forEach(node => node.off(evts, handler));
        }
    });
};

/**
 * Create an object of shortcuts to manipulate
 * given node more easily
 *
 * @param {Node} Input node
 * @return {Object} DOM shortcuts
 */
const wrapNode = node => {
    if (node === null || typeof node !== 'object') {
        return null;
    }

    return {
        node,

        // search among children
        find: query => wrapNode(node.querySelector(query)),
        findAll: query => wrapList(node.querySelectorAll(query)),

        // access node's relative tree (parent, children, siblings)
        equal: el => unwrap(el) === node,

        get following() {
            return wrapNode(node.nextElementSibling);
        },

        get preceding() {
            return wrapNode(node.previousElementSibling);
        },

        get parent() {
            return wrapNode(node.parentNode);
        },

        get children() {
            return wrapList(node.children);
        },

        // check relative positions
        precedes: el => !!(unwrap(el).compareDocumentPosition(node) & 2),
        follows: el => !!(unwrap(el).compareDocumentPosition(node) & 4),
        contains: el => !!(unwrap(el).compareDocumentPosition(node) & 8),
        contained: el => !!(unwrap(el).compareDocumentPosition(node) & 16),

        // get and set element attributes
        get name() {
            return node.tagName.toLowerCase().trim();
        },

        get type() {
            switch (node.nodeType) {
            case 1: return 'element';
            case 3: return 'text';
            case 7: return 'processing-instruction';
            case 8: return 'comment';
            case 9: return 'document';
            case 10: return 'document-type';
            case 11: return 'document-fragment';
            default: return null;
            }
        },

        getAttr: attr => node.getAttribute(attr),
        setAttr: (attr, value) => node.setAttribute(attr, value),

        // place an element in the DOM tree
        append: subnode => node.appendChild(unwrap(subnode)),
        attach: parent => unwrap(parent).appendChild(node),
        remove: child => {
            if (child) {
                node.removeChild(unwrap(child));
                return;
            }

            node.parentNode.removeChild(node);
        },

        // manipulate element's CSS (see wrapClass, wrapStyle)
        class: wrapClass(node),
        style: wrapStyle(node),

        // change an element's content
        get text() {
            return node.textContent;
        },

        set text(val) {
            node.textContent = val;
        },

        get html() {
            return node.innerHTML;
        },

        set html(val) {
            node.innerHTML = val;
        },

        // listen to events
        on: (evts, handler) => {
            split(evts).forEach(evt => {
                node.addEventListener(evt, handler);
            });
        },

        off: (evts, handler) => {
            split(evts).forEach(evt => {
                node.removeEventListener(evt, handler);
            });
        }
    };
};

module.exports = wrapNode;
