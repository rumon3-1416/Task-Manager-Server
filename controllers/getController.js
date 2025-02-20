const { connectDB } = require('../config/database');
const { tryCatch } = require('../utils/tryCatch');

const getProjects = tryCatch(async (req, res) => {
  const { user_email } = req.headers;

  const projectsCol = await connectDB('projects');
  const result = await projectsCol
    .find({ user_email }, { projection: { _id: 1, title: 1 } })
    .toArray();

  res.send(result);
});

module.exports = { getProjects };
