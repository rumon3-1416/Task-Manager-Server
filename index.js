require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

// Token
const { postJwtToken } = require('./controllers/jwtController');
const { verifyToken } = require('./middlewares/verifyToken');

// Get
const {
  getProjectsTitles,
  getAProject,
} = require('./controllers/getController');

// Post
const { postUser, addProject } = require('./controllers/postController');
const {
  addTask,
  updateTask,
  updateProject,
  sameReorder,
  catReorder,
} = require('./controllers/putController');
const { deleteTask, deleteProject } = require('./controllers/delController');

const app = express();
const port = process.env.PORT || 5000;

const corsOption = {
  origin: [
    'http://localhost:5173',
    'https://task-management-72c63.web.app',
    'https://task-management-72c63.firebaseapp.com',
  ],
  credentials: true,
};
// app use
app.use(cors(corsOption));
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.send('Hello');
});

(async () => {
  try {
    // Jwt Token
    app.post('/jwt', postJwtToken);

    // *** Get Starts ***
    app.get('/projects-titles', verifyToken, getProjectsTitles);
    app.get('/project/:id', verifyToken, getAProject);
    // *** Get Ends ***

    // *** Post Starts ***
    app.post('/users', postUser);
    app.post('/project', verifyToken, addProject);
    // *** Post Ends ***

    // *** Put Starts ***
    app.put('/task/:id', verifyToken, addTask);
    app.patch('/task/:id', verifyToken, updateTask);
    app.patch('/project/:id', verifyToken, updateProject);
    app.patch('/task_same_reorder/:id', verifyToken, sameReorder);
    app.patch('/task_cat_reorder/:id', verifyToken, catReorder);
    // *** Put Ends ***

    // *** Delete Starts ***
    app.delete('/task/:id', verifyToken, deleteTask);
    app.delete('/project/:id', verifyToken, deleteProject);
    // *** Delete Ends ***
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
})();

app.listen(port, () => {
  console.log(`App is listening at http://localhost:${port}`);
});
