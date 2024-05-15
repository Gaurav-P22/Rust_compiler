const express = require('express');
const { exec } = require('child_process');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Mock questions data
const questionsByDifficulty = {
    easy: [
      { id: 1, text: "What is a variable?", points: 1 },
      { id: 2, text: "What is a loop?", points: 1 }
    ],
    medium: [
      { id: 1, text: "Explain the concept of recursion.", points: 2 },
      { id: 2, text: "What are higher-order functions?", points: 2 }
    ],
    hard: [
      { id: 1, text: "Implement a binary search algorithm.", points: 3 },
      { id: 2, text: "Write a function to reverse a linked list.", points: 3 }
    ]
  };
  
  // Route to fetch questions based on difficulty level
  app.get('/api/questions/:difficulty', (req, res) => {
    const { difficulty } = req.params;
    const questions = questionsByDifficulty[difficulty];
    if (!questions) {
      return res.status(404).json({ error: 'Difficulty level not found' });
    }
    res.json({ questions });
  });


  const questionsByDifficulty_solc = {
    easy: [
      { id: 1, text: "What is a variable?", reward: 1 },
      { id: 2, text: "What is a loop?", reward: 1 }
    ],
    medium: [
      { id: 1, text: "Explain the concept of recursion.", reward: 2 },
      { id: 2, text: "What are higher-order functions?", reward: 2 }
    ],
    hard: [
      { id: 1, text: "Implement a binary search algorithm.", reward: 3 },
      { id: 2, text: "Write a function to reverse a linked list.", reward: 3 }
    ]
  };
  
  app.get('/api/questions/:difficulty', (req, res) => {
    const { difficulty } = req.params;
    const questions = questionsByDifficulty_solc[difficulty];
    if (!questions) {
      return res.status(404).json({ error: 'Difficulty level not found' });
    }
    res.json({ questions });
  });
  
  app.post('/api/compile-solidity', (req, res) => {
    const solidityCode = req.body.code;
    const difficultyLevel = req.body.difficulty;
  
    // Define rewards based on difficulty level
    let rewardPoints = 0;
    switch (difficultyLevel) {
      case 'easy':
        rewardPoints = 1;
        break;
      case 'medium':
        rewardPoints = 2;
        break;
      case 'hard':
        rewardPoints = 3;
        break;
      default:
        break;
    }
  
    // Write the Solidity code to a temporary file
    const tempFilePath = path.join(__dirname, 'temp.sol');
    fs.writeFileSync(tempFilePath, solidityCode);
  
    // Run the Solidity compiler command (replace 'solc' with the actual command)
    exec(`"C:\\Users\\DELL\\AppData\\Roaming\\npm\\node_modules\\solc\\solc.cmd" ${tempFilePath}`, (error, stdout, stderr) => {
      // Remove the temporary file
      fs.unlinkSync(tempFilePath);
  
      if (error) {
        console.error(`Compilation error: ${stderr}`);
        res.status(500).json({ output: `Compilation error: ${stderr}`, reward: 0 });
        return;
      }
  
      // Return the compiler output along with the reward points
      res.json({ output: stdout, reward: rewardPoints });
    });
  });
  
// Route to compile Rust code
app.post('/api/compile', (req, res) => {
    const rustCode = req.body.code;
  
    // Write the Rust code to a temporary file
    const tempFilePath = path.join(__dirname, 'temp.rs');
    fs.writeFileSync(tempFilePath, rustCode);
  
    // Run the Rust compiler command
    exec(`C:\\Users\\DELL\\.cargo\\bin\\rustc ${tempFilePath}`, (error, stdout, stderr) => {
      // Remove the temporary file
      fs.unlinkSync(tempFilePath);
  
      if (error) {
        console.error(`Compilation error: ${stderr}`);
        res.status(500).json({ output: `Compilation error: ${stderr}` });
        return;
      }
  
      // Execute the compiled Rust code
      exec(`"${tempFilePath.replace('.rs', '')}"`, (runError, runStdout, runStderr) => {
        if (runError) {
          console.error(`Execution error: ${runStderr}`);
          res.status(500).json({ output: `Execution error: ${runStderr}` });
          return;
        }
  
        // Return the compiler output and execution output
        res.json({ compilerOutput: stdout, executionOutput: runStdout });
      });
    });
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
