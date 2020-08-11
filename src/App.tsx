import React from 'react';
import logo from './logo.svg';
import './App.css';
import VideoEditor from './components/VideoEditor';
import ScrollTop from './components/ScrollTop';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a className="App-link" href="#video-section" rel="noopener noreferrer">
          Video Editor
        </a>
      </header>
      <VideoEditor />
      <ScrollTop />
    </div>
  );
}

export default App;
