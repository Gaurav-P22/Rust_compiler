import React, { useState, useEffect } from 'react';

function Solidity() {
  const [solidityCode, setSolidityCode] = useState('');
  const [compilerOutput, setCompilerOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState('easy');
  const [rewardPoints, setRewardPoints] = useState(0);
  const [question, setQuestion] = useState('');

  useEffect(() => {
    fetchQuestion(selectedDifficulty);
  }, [selectedDifficulty]);

  const compileCode = async () => {
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/compile-solidity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code: solidityCode, difficulty: selectedDifficulty })
      });

      const data = await response.json();
      setCompilerOutput(data.output);
      setRewardPoints(data.reward);
    } catch (error) {
      console.error('Error compiling code:', error);
      setCompilerOutput('An error occurred while compiling the code.');
    }

    setIsLoading(false);
  };

  const fetchQuestion = async (difficulty) => {
    try {
      const response = await fetch(`http://localhost:5000/api/questions/${difficulty}`);
      const data = await response.json();
      if (data.questions && data.questions.length > 0) {
        setQuestion(data.questions[0].text);
      } else {
        setQuestion('No question available for the selected difficulty level.');
      }
    } catch (error) {
      console.error('Error fetching question:', error);
      setQuestion('An error occurred while fetching the question.');
    }
  };

  const handleDifficultyChange = (event) => {
    const selectedDifficulty = event.target.value;
    setSelectedDifficulty(selectedDifficulty);
  };

  return (
    <div className="container mx-auto px-4">
      <div className="py-8">
        <h1 className="text-2xl font-bold mb-4">Solidity Compiler</h1>
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="mb-4">
            <h2 className="text-lg font-bold mb-2">Question:</h2>
            <p>{question}</p>
          </div>
          <textarea
            className="w-full h-40 bg-slate-900 text-white border border-gray-300 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:border-blue-500"
            placeholder="Enter your Solidity code here"
            value={solidityCode}
            spellCheck={false}
            onChange={(e) => setSolidityCode(e.target.value)}
          ></textarea>
          <div className="flex mb-4">
            <label className="mr-2">Select Difficulty:</label>
            <select value={selectedDifficulty} onChange={handleDifficultyChange} className="bg-white border border-gray-300 rounded-lg px-2 py-1">
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          <button
            className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg"
            onClick={compileCode}
            disabled={isLoading}
          >
            {isLoading ? 'Compiling...' : 'Compile'}
          </button>
          <div className="border border-gray-400 rounded-lg p-4 mt-4">
            <h2 className="text-xl font-bold mb-2">Compiler Output</h2>
            <pre className="whitespace-pre-wrap">{compilerOutput}</pre>
            <div className="mt-2">Reward Points: {rewardPoints}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Solidity;
