import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import AddPackage from './components/AddPackage';
import ViewPackages from './components/ViewPackages';

const App: React.FC = () => {
  return (
    <Router>        
      <Navbar />
      <div className="container mx-auto mt-4">  
        <Routes> 
          <Route path="/" element={<AddPackage />} /> 
          <Route path="/add-new-package" element={<AddPackage />} />
          <Route path="/view-favorite-packages" element={<ViewPackages />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
