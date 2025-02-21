const { connectDB } = require('../config/database');
const { tryCatch } = require('../utils/tryCatch');

// Post Users
const postUser = tryCatch(async (req, res) => {
  const { email, displayName, photoURL } = req.body;

  const usersCol = await connectDB('users');

  let result;
  result = await usersCol.findOne({ email });

  if (!result) {
    result = await usersCol.insertOne({
      email,
      displayName,
      photoURL,
      date: Date.now(),
    });
    res.send(result);
  } else {
    res.send({ message: 'User already exists' });
  }
});

// Add Project
const addProject = tryCatch(async (req, res) => {
  const { user_email } = req.headers;
  const project = req.body;
  const doc = {
    user_email,
    ...project,
    date: Date.now(),
    task_categories: [
      { category: 'Todo', title: 'Todo', tasks: [] },
      { category: 'In-progress', title: 'In-progress', tasks: [] },
      { category: 'Done', title: 'Done', tasks: [] },
    ],
  };

  const projectsCol = await connectDB('projects');
  const result = await projectsCol.insertOne(doc);

  res.send(result);
});

module.exports = { postUser, addProject };
