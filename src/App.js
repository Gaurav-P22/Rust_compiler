import { BrowserRouter, Routes, Route } from 'react-router-dom'; // Import Routes instead of Router
import Home from './component/Home';
import Main from './component/Main';
import Solidity from './component/Solidity';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes> {/* Use Routes instead of Router */}
          <Route path='/' element={<Main/>}/> {/* Define your routes inside Routes */}
          <Route path='/rust' element={<Home/>}/>
          <Route path='/solidity' element={<Solidity/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
