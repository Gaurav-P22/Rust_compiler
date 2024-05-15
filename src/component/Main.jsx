import React from 'react';
import { Link } from 'react-router-dom';

function Main() {
  return (
    <div className="min-h-screen flex items-center justify-center">
     
        <div className="flex space-x-4">
          <Link to="/rust" className="btn bg-blue-950 text-6xl text-white rounded p-3 hover:bg-fuchsia-900 ">Rust</Link>
          <Link to="/solidity" className="btn bg-blue-950 text-6xl text-white rounded p-3 hover:bg-fuchsia-900">Solidity</Link>
        
      </div>
    </div>
  );
}

export default Main;
