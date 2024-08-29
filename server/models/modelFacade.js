class ModelFacade {
  constructor(model) {
    this.model = model;
  }
  async countDocuments(filter) {
    return await this.model.countDocuments(filter);
  }

  async create(data) {
    return await this.model.create(data);
  }
  
  async findList(filter, options = {}) {
    const { skip = 0, limit = 10, sort = "-ts" } = options;
    return await this.model.find(filter).skip(skip).limit(limit).sort(sort);
  }
  async findOne(filter, options = {}) {
    const { skip } = options;
    return await this.model.findOne(filter).skip(skip);
  }
  async updateOne(filter, update) {
    return await this.model.updateOne(filter, update);
  }
  async findOneAndUpdate(filter, update, options = { upsert: true }) {
    return await this.model.findOneAndUpdate(filter, update, options);
  }
  async deleteOne(filter) {
    return await this.model.deleteOne(filter);
  }
}

module.exports = ModelFacade;
