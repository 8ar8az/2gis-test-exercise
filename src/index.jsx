import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import 'normalize.css';

import BooksWidget from './BooksWidget';

const startApp = () => {
  const app = (
    <React.StrictMode>
      <BrowserRouter>
        <BooksWidget />
      </BrowserRouter>
    </React.StrictMode>
  );

  ReactDOM.render(
    app,
    document.getElementById('root'),
  );
};

startApp();
