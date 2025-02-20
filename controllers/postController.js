const { connectDB } = require('../config/database');
const { tryCatch } = require('../utils/tryCatch');

// Post Users
const postUser = tryCatch(async (req, res) => {
  const { email, displayName, photoURL } = req.body;

  const usersCollection = await connectDB('users');

  let result;
  result = await usersCollection.findOne({ email });

  if (!result) {
    result = await usersCollection.insertOne({
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
    tasks: { todo: [], inprogress: [], done: [] },
  };

  const projectsCollection = await connectDB('projects');
  const result = await projectsCollection.insertOne(doc);

  res.send(result);
});

module.exports = { postUser, addProject };
