import React from 'react';
import Gallery from './components/Gallery';
import { images } from './data/images';
import './App.css';

function App() {
  return (
    <div className="App">
      <Gallery images={images} />
    </div>
  );
}

export default App;
