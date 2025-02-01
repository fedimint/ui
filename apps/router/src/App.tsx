import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useAppContext, useAppInit } from './hooks';
import { Wrapper } from './components/Wrapper';
import { HomePage } from './home/HomePage';

export default function App() {
  const { dispatch } = useAppContext();
  useAppInit(
    dispatch,
    process.env.REACT_APP_FM_CONFIG_API || process.env.REACT_APP_FM_GATEWAY_API
  );

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
