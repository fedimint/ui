import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useAppContext, useAppInit } from './hooks';
import { Wrapper } from './components/Wrapper';
import HomePage from './pages/Home';

export default function App() {
  const { dispatch } = useAppContext();

  const url =
    process.env.REACT_APP_FM_CONFIG_API || process.env.REACT_APP_FM_GATEWAY_API;
  useAppInit(dispatch, url);

  return (
    <Router>
      <Wrapper>
        <Routes>
          <Route path='/' element={<HomePage />} />
        </Routes>
      </Wrapper>
    </Router>
  );
}
