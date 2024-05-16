class ModelFacade {
  constructor(model) {
    this.model = model;
  }
  async countDocuments(filter) {
    return await this.model.countDocuments(filter);
  }
  async findList(filter, options = {}) {
    const { skip = 0, limit = 10, sort = "-ts" } = options;
    return await this.model.find(filter).skip(skip).limit(limit).sort(sort);
  }
  async findOne(filter, options = {}) {
    const { skip } = options;
    return await this.model.findOne(filter).skip(skip);
  }
}

module.exports = ModelFacade;
