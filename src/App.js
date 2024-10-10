import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Registro from './Componentes/Registro';
import Login from './Componentes/Login';
import Dashboard from './Componentes/Dashboard';
import { Provider } from 'react-redux';
import store from './store/store';

const App = () => {
  const usuarioLogueado = !!localStorage.getItem('token') && !!localStorage.getItem('userId');

  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={usuarioLogueado ? <Dashboard /> : <Navigate to="/Login" />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Registro" element={<Registro />} />
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;
