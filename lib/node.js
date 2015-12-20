'use strict';

const whitespace = /\s+/g;

/**
 * Transform a hyphenated property such as `align-self`
 * to camelcase style, `alignSelf` for use with CSS `style` hashes
 *
 * @param {string} prop Property to transform
 * @return {string} Camelcase-style property
 */
const dehyphenate = prop => {
    const length = prop.length;
    let result = '';

    for (let i = 0; i < length; i += 1) {
        if (prop[i] === '-') {
            result += prop[i + 1].toUpperCase();
            i += 1;
        } else {
            result += prop[i];
        }
    }

    return prop;
};

/**
 * Ensure a node is not wrapped before using it in native methods
 *
 * @param {Node|Object} node A node, wrapped or not
 * @return {Node} Unwrapped node
 */
const unwrap = node =>
    (typeof node !== 'object' || node === null || !node.node) ? node : node.node;

/**
 * Create an object to manipulate given node's CSS classes
 *
 * @param {HTMLElement} node Input element
 * @see `Set` documentation for behaviour information
 * @return {Object} Set-like object
 */
const wrapClass = (node) => ({
    add: function (el) {
        if (!this.has(el)) {
            const split = node.className.split(whitespace);

            split.push(el);
            node.className = split.join(' ');
        }
    },

    delete: el => {
        const split = node.className.split(whitespace),
            pos = split.indexOf(el);

        if (pos > -1) {
            split.splice(pos, 1);
            node.className = split.join(' ');
        }
    },

    has: el => node.className.split(whitespace).indexOf(el) !== -1,
    clear: () => node.className = '',

    get size() {
        if (node.className.trim() === '') {
            return 0;
        }

        return node.className.split(whitespace).length;
    }

    // TODO: implement forEach, entries, keys, values, @@iterator
});

/**
 * Create an object to manipulate given node's CSS styles
 *
 * @param {HTMLElement} node Input element
 * @see `Map` documentation for behaviour information
 * @return {Object} Map-like object
 */
const wrapStyle = (node) => ({
    set: (prop, value) => node.style[dehyphenate(prop)] = value,
    delete: prop => node.style[dehyphenate(prop)] = '',
    has: prop => node.style[dehyphenate(prop)].trim() !== '',

    get: prop => {
        const result = node.style[dehyphenate(prop)];

        if (result.trim() === '') {
            return null;
        }

        return result;
    },

    clear: () => {
        const length = node.style.length;

        for (let i = 0; i < length; i += 1) {
            node.style[node.style[i]] = '';
        }
    },

    get size() {
        return node.style.length;
    }

    // TODO: implement forEach, entries, keys, values, @@iterator
});

/**
 * Create an object of shortcuts to manipulate
 * given node more easily
 *
 * @param {Node} Input node
 * @return {Object} DOM shortcuts
 */
const wrapNode = (node) => {
    if (node === null || typeof node !== 'object') {
        return null;
    }

    return {
        node,

        // search among children
        find: query => wrapNode(node.querySelector(query)),
        // findAll

        // access node's relative tree (parent, children, siblings)
        equal: el => unwrap(el) === node,
        get parent() {
            return wrapNode(node.parentNode);
        },

        // children

        // get and set element attributes
        get type() {
            return node.tagName.toLowerCase().trim();
        },

        get kind() {
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

        // manipulate element's CSS (see wrapClass, wrapStyle)
        class: wrapClass(node),
        style: wrapStyle(node),

        // change an element's content
        get content() {
            return node.textContent;
        },

        set content(val) {
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
            evts.split(whitespace).forEach(evt => {
                node.addEventListener(evt, handler);
            });
        },

        off: (evts, handler) => {
            evts.split(whitespace).forEach(evt => {
                node.removeEventListener(evt, handler);
            });
        }
    };
};

module.exports = wrapNode;
