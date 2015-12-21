'use strict';

const utils = require('./utils');

const split = utils.split;
const iterateArray = utils.iterateArray;

/**
 * Create an object to manipulate given node's CSS classes
 *
 * @param {HTMLElement} node Input element
 * @see `Set` documentation for behaviour information
 * @return {Object} Set-like object
 */
const wrapClass = node => {
    const res = {
        add: function (el) {
            if (!this.has(el)) {
                const classes = split(node.className);

                classes.push(el);
                node.className = classes.join(' ');
            }

            return this;
        },

        delete: el => {
            const classes = split(node.className), pos = classes.indexOf(el);

            if (pos > -1) {
                classes.splice(pos, 1);
                node.className = classes.join(' ');
                return true;
            }

            return false;
        },

        has: el => split(node.className).indexOf(el) !== -1,
        clear: () => node.className = '',

        get size() {
            return split(node.className).length;
        },

        keys: () => iterateArray(split(node.className)),
        values: () => iterateArray(split(node.className)),
        entries: () => iterateArray(split(node.className).map(el => [el, el])),

        forEach: function (callback, thisArg) {
            for (let cls of this) {
                callback.call(thisArg, cls, cls, this);
            }
        }
    };

    res[Symbol.iterator] = res.values;
    return res;
};

module.exports = wrapClass;
