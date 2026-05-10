import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import KeyGeneration from './pages/KeyGeneration';
import SignMessage from './pages/SignMessage';
import VerifyMessage from './pages/VerifyMessage';
import History from './pages/History';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<KeyGeneration />} />
          <Route path="sign" element={<SignMessage />} />
          <Route path="verify" element={<VerifyMessage />} />
          <Route path="history" element={<History />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
