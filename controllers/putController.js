const { ObjectId } = require('mongodb');
const { connectDB } = require('../config/database');
const { tryCatch } = require('../utils/tryCatch');

// Update Project
const updateProject = tryCatch(async (req, res) => {
  const { id } = req.params;
  const doc = req.body;

  const projectsCol = await connectDB('projects');

  const result = await projectsCol.updateOne(
    { _id: new ObjectId(id) },
    { $set: doc }
  );

  res.send(result);
});

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

// Update same Category Order
const sameReorder = tryCatch(async (req, res) => {
  const { id } = req.params;
  const tasks = req.body;

  const projectsCol = await connectDB('projects');
  const result = await projectsCol.updateOne(
    { _id: new ObjectId(id), 'task_categories.category': tasks[0].category },
    {
      $set: {
        'task_categories.$.tasks': tasks,
      },
    }
  );

  res.send(result);
});

// Update diff Category Order
const catReorder = tryCatch(async (req, res) => {
  const { id } = req.params;
  const { source, destination } = req.body;

  const projectsCol = await connectDB('projects');

  const result1 = await projectsCol.updateOne(
    { _id: new ObjectId(id), 'task_categories.category': source.category },
    {
      $set: {
        'task_categories.$.tasks': source.tasks,
      },
    }
  );
  const result2 = await projectsCol.updateOne(
    { _id: new ObjectId(id), 'task_categories.category': destination.category },
    {
      $set: {
        'task_categories.$.tasks': destination.tasks,
      },
    }
  );

  res.send({ result1, result2 });
});

module.exports = {
  updateProject,
  addTask,
  updateTask,
  sameReorder,
  catReorder,
};
