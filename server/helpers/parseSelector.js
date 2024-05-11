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
}

module.exports = ParseSelector;
