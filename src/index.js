import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/style.scss';
import './styles/font.css';
import { HashRouter } from 'react-router-dom';
import WrapComponent from './components/WrapComponent';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  
  <HashRouter>
    <WrapComponent/>
  </HashRouter>
);