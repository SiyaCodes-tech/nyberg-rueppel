import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import KeyGeneration from './pages/KeyGeneration';
import SignMessage from './pages/SignMessage';
import VerifyMessage from './pages/VerifyMessage';
import History from './pages/History';
import HowItWorks from './pages/HowItWorks';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="keys" element={<KeyGeneration />} />
          <Route path="sign" element={<SignMessage />} />
          <Route path="verify" element={<VerifyMessage />} />
          <Route path="history" element={<History />} />
          <Route path="how-it-works" element={<HowItWorks />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
