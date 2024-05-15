import React, { useState } from 'react';

const Home = () => {
  const [rustCode, setRustCode] = useState('');
  const [compilerOutput, setCompilerOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState('easy');
  const [compileError, setCompileError] = useState('');
  const [executionOutput, setExecutionOutput] = useState('');

  const compileCode = async () => {
    setIsLoading(true);
    setCompilerOutput('');
    setCompileError('');
    setExecutionOutput('');

    try {
      const response = await fetch('http://localhost:5000/api/compile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code: rustCode })
      });
      const data = await response.json();
      if (data.output) {
        setCompilerOutput(data.output);
      }
      if (data.executionOutput) {
        setExecutionOutput(data.executionOutput);
      }
    } catch (error) {
      console.error('Error compiling code:', error);
      setCompileError('An error occurred while compiling the code.');
    }
    setIsLoading(false);
  };

  const fetchQuestions = async (difficulty) => {
    try {
      const response = await fetch(`http://localhost:5000/api/questions/${difficulty}`);
      const data = await response.json();
      setQuestions(data.questions);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const handleDifficultyChange = (event) => {
    const selectedDifficulty = event.target.value;
    setSelectedDifficulty(selectedDifficulty);
    fetchQuestions(selectedDifficulty);
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-gray-800 text-white p-4">
        <h1 className="text-2xl font-bold">Web-Based Rust Compiler</h1>
      </header>
      <main className="flex-grow p-4 flex">
        <div className="flex-grow mr-4">
          <textarea
            className="w-full h-full border border-gray-400 rounded-lg p-4 focus:outline-none text-yellow-50 bg-slate-900"
            placeholder="Enter your Rust code here"
            value={rustCode}
            onChange={(e) => setRustCode(e.target.value)}
            spellCheck={false}
          />
        </div>
        <div className="w-1/3">
          <div className="mb-4">
            <label className="block">Select Difficulty:</label>
            <select
              value={selectedDifficulty}
              onChange={handleDifficultyChange}
              className="bg-gray-200 rounded p-2"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          <div className="border border-gray-400 rounded-lg p-4 h-1/4 overflow-auto my-10">
            {questions.length > 0 ? (
              <ul>
                {questions.map((question) => (
                  <li key={question.id}>{question.text}</li>
                ))}
              </ul>
            ) : (
              <p>No questions available for the selected difficulty level.</p>
            )}
          </div>
          <button
            className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg mb-4 w-full"
            onClick={compileCode}
            disabled={isLoading}
          >
            {isLoading ? 'Compiling...' : 'Compile and Run'}
          </button>
          <div className="border border-gray-400 rounded-lg p-4   h-1/4 overflow-auto mb-4">
            {compileError && <div className="text-red-600 mb-2">{compileError}</div>}
            {compilerOutput && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Compiler Output:</h3>
                <pre>{compilerOutput}</pre>
              </div>
            )}
            {executionOutput && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Execution Output:</h3>
                <pre>{executionOutput}</pre>
              </div>
            )}
          </div>
         
        </div>
      </main>
      <footer className="bg-gray-800 text-white p-4 text-center">
        <p>&copy; 2024 Web-Based Rust Compiler</p>
      </footer>
    </div>
  );
};

export default Home;
