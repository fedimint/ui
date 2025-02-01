import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { HomePage } from './home/HomePage';

import { Wrapper } from './components/Wrapper';
import { useAppContext, useAppInit } from './hooks';

export default function App() {
  const { dispatch } = useAppContext();
  useAppInit(dispatch);

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
