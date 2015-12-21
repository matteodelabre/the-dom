'use strict';

const wrapNode = require('./lib/node');

/**
 * Import given node into `the-dom`
 *
 * @param {Node} node Node to import
 * @return {Object} Wrapped node
 */
exports.import = (node) => wrapNode(node);

/**
 * Import an HTML document into `the-dom`
 *
 * @param {HTMLDocument} doc Document to import
 * @return {Object} A hash with doctype, body, head, html props
 */
exports.html = doc => ({
    create: name => doc.createElement(name),
    body: wrapNode(doc.body),
    head: wrapNode(doc.head),
    html: wrapNode(doc.documentElement),
    doctype: wrapNode(doc.doctype)
});
