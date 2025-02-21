const { ObjectId } = require('mongodb');
const { connectDB } = require('../config/database');
const { tryCatch } = require('../utils/tryCatch');

// Delete Task
const deleteTask = tryCatch(async (req, res) => {
  const { id } = req.params;
  const { category, time, order } = req.body;

  const projectsCol = await connectDB('projects');
  // Find project
  const doc = await projectsCol.findOne({ _id: new ObjectId(id) });
  // Category Index
  const categoryIndex = doc.task_categories.findIndex(
    cat => cat.category === category
  );
  // Filter task
  const updatedTasks = doc.task_categories[categoryIndex].tasks.filter(
    task => task.time !== time && task.order !== order
  );
  // Update task Order
  updatedTasks.forEach((task, index) => {
    task.order = index + 1;
  });
  // Set Tasks
  const result = await projectsCol.updateOne(
    {
      _id: new ObjectId(id),
    },
    {
      $set: {
        [`task_categories.${categoryIndex}.tasks`]: updatedTasks,
      },
    }
  );

  res.send(result);
});

// Delete Project
const deleteProject = tryCatch(async (req, res) => {
  const { id } = req.params;

  const projectsCol = await connectDB('projects');
  const result = await projectsCol.deleteOne({ _id: new ObjectId(id) });

  res.send(result);
});

module.exports = { deleteTask, deleteProject };
