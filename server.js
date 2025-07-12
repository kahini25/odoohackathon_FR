const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const Question = require('./models/Question');


// Import Mongoose model
const User = require('./models/User');

const app = express();
const PORT = 3000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(bodyParser.json());

// ✅ Serve static files (like login.html) from the current folder
app.use(express.static(__dirname));

// ✅ Redirect root path to login.html
app.get('/', (req, res) => {
  res.redirect('/login.html');
});

// ✅ Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/stackit', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// ✅ Register API route
app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Create and save user
    const user = new User({ username, email, password });
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    if (err.code === 11000) {
      res.status(400).json({ message: 'Email already exists' });
    } else {
      console.error(err);
      res.status(500).json({ message: 'Error registering user' });
    }
  }
});

// ✅ Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

// Create a new question
app.post('/api/questions', async (req, res) => {
  try {
    const q = new Question(req.body);
    await q.save();
    res.status(201).json({ message: 'Question saved' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to save question' });
  }
});

// Get all questions
app.get('/api/questions', async (req, res) => {
  const questions = await Question.find().sort({ createdAt: -1 });
  res.json(questions);
});

// Add an answer to a question
app.post('/api/questions/:id/answers', async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ message: 'Not found' });

    question.answers.push(req.body);
    await question.save();
    res.status(201).json({ message: 'Answer saved' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to save answer' });
  }
});

// Get answers for a question
app.get('/api/questions/:id/answers', async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ message: 'Not found' });

    res.json(question.answers);
  } catch (err) {
    res.status(500).json({ message: 'Error loading answers' });
  }
});

app.post('/api/questions/:id/answers', async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ message: 'Question not found' });

    question.answers.push({
      content: req.body.content,
      author: req.body.author,
      createdAt: new Date(),
      votes: 0,
      accepted: false
    });

    await question.save();
    res.status(201).json({ message: 'Answer saved' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error saving answer' });
  }
});
