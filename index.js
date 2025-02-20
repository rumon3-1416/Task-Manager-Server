require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

// Token
const { postJwtToken } = require('./controllers/jwtController');
const { verifyToken } = require('./middlewares/verifyToken');

// Get
const { getProjects } = require('./controllers/getController');

// Post
const { postUser, addProject } = require('./controllers/postController');

const app = express();
const port = process.env.PORT || 5000;

const corsOption = {
  origin: ['http://localhost:5173'],
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
    app.get('/projects', verifyToken, getProjects);
    // *** Get Ends ***

    // *** Post Starts ***
    app.post('/users', postUser);
    app.post('/project', verifyToken, addProject);
    // *** Post Ends ***

    // *** Put Starts ***
    // *** Put Ends ***

    // *** Delete Starts ***
    // *** Delete Ends ***
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
})();

app.listen(port, () => {
  console.log(`App is listening at http://localhost:${port}`);
});
