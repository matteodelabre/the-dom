'use strict';

const iterateArray = require('./utils').iterateArray;

/**
 * Create an object to manipulate given node's CSS styles
 *
 * @param {HTMLElement} node Input element
 * @see `Map` documentation for behaviour information
 * @return {Object} Map-like object
 */
const wrapStyle = node => {
    const res = {
        set: function (prop, value) {
            node.style.setProperty(prop, value);
            return this;
        },

        delete: prop => node.style.removeProperty(prop) !== '',
        has: prop => [].slice.call(node.style).indexOf(prop) > -1,

        get: prop => {
            const result = node.style.getPropertyValue(prop);

            if (result.trim() === '') {
                return undefined;
            }

            return result;
        },

        clear: () => {
            const length = node.style.length;

            for (let i = 0; i < length; i += 1) {
                node.style.removeProperty(node.style[i]);
            }
        },

        get size() {
            return node.style.length;
        },

        keys: () => iterateArray([].slice.call(node.style)),
        values: () => iterateArray([].slice.call(node.style).map(
            prop => node.style.getPropertyValue(prop))),
        entries: () => iterateArray([].slice.call(node.style).map(
            prop => [prop, node.style.getPropertyValue(prop)])),

        forEach: function (callback, thisArg) {
            for (let cls of this) {
                callback.call(thisArg, cls, cls, this);
            }
        }
    };

    res[Symbol.iterator] = res.values;
    return res;
};

module.exports = wrapStyle;
