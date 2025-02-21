const { ObjectId } = require('mongodb');
const { connectDB } = require('../config/database');
const { tryCatch } = require('../utils/tryCatch');

// Add Task
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

// Update Task
const updateTask = tryCatch(async (req, res) => {
  const { id } = req.params;
  const { title, description, category, order, time } = req.body;

  const projectsCol = await connectDB('projects');
  const result = await projectsCol.updateOne(
    {
      _id: new ObjectId(id),
    },
    {
      $set: {
        'task_categories.$[cat].tasks.$[task].title': title,
        'task_categories.$[cat].tasks.$[task].description': description,
        'task_categories.$[cat].tasks.$[task].order': order,
      },
    },
    {
      arrayFilters: [{ 'cat.category': category }, { 'task.time': time }],
    }
  );

  res.send(result);
});

module.exports = { addTask, updateTask };
