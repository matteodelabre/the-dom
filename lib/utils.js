'use strict';

const whitespace = /\s+/g;

/**
 * Split a list of whitespace separated tokens,
 * excluding empty ones
 *
 * @param {string} str Input string
 * @return {Array} Split tokens
 */
exports.split = str => str.split(whitespace).filter(el => el.trim().length);

/**
 * Create an iterator on an array
 *
 * @param {Array} arr Array to iterate on
 * @return {Object} Iterator for given array
 */
exports.iterateArray = (arr) => {
    let next = 0;

    return {
        next: () => next < arr.length ?
            {value: arr[next++], done: false} :
            {done: true}
    };
};
