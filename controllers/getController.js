const { ObjectId } = require('mongodb');
const { connectDB } = require('../config/database');
const { tryCatch } = require('../utils/tryCatch');

// get Titles
const getProjectsTitles = tryCatch(async (req, res) => {
  const { user_email } = req.headers;

  const projectsCol = await connectDB('projects');
  const result = await projectsCol
    .find({ user_email }, { projection: { _id: 1, title: 1 } })
    .toArray();

  res.send(result);
});

// get A Project
const getAProject = tryCatch(async (req, res) => {
  const { user_email } = req.headers;
  const { id } = req.params;
  const filter = { _id: new ObjectId(id), user_email };

  const projectsCol = await connectDB('projects');
  const result = await projectsCol.findOne(filter);

  res.send(result);
});

module.exports = { getProjectsTitles, getAProject };
