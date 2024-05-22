class ParseSelector {
  constructor(selector) {
    this.selector = selector;
  }

  getNode(tag) {
    return this.selector(tag);
  }

  getNodeText(tag) {
    return this.selector(tag).text();
  }

  getAttr(tag, attr) {
    return this.selector(tag).attr(attr);
  }

  getChildNodes(node, tag) {
    return node.find(tag);
  }

  /**
   * return text of give node child element tag
   * @param {object} node
   * @param {string} tag
   * @return {string}
   */
  getNodeChildText(node, tag) {
    return node.find(tag).text();
  }

  getNodeChildAttr(node, tag, attr) {
    return node.find(tag).attr(attr);
  }
}

module.exports = ParseSelector;
