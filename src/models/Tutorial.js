const mongoose = require('mongoose');

const { Schema } = mongoose;

const tutorialSchema = new Schema(
    {
        title: String,
        description: String,
      },
      {
        timestamps: true,
      }

);
tutorialSchema.method("toJSON", function() {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});
module.exports = mongoose.model('tutorial', tutorialSchema);
