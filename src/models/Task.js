const mongoose = require('mongoose');

const { Schema } = mongoose;

const taskSchema = new Schema(
    {
        title: String,
        description: String,
      },
      {
        timestamps: true,
      }

);

module.exports = mongoose.model('task', taskSchema);

