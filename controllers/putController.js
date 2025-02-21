const { ObjectId } = require('mongodb');
const { connectDB } = require('../config/database');
const { tryCatch } = require('../utils/tryCatch');

const addTask = tryCatch(async (req, res) => {
  const doc = req.body;
  const { id } = req.params;

  const projectsCol = await connectDB('projects');

  const result = await projectsCol.updateOne(
    {
      _id: new ObjectId(id),
      'task_categories.category': doc.category,
    },
    { $push: { 'task_categories.$.tasks': doc } }
  );

  res.send(result);
});

module.exports = { addTask };
