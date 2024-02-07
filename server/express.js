const express = require("express");

class ExpressJs {
  constructor() {
    this.app = express;
  }
  setRoute(route) {
    this.app.use(route);
  }
}

export default ExpressJs;