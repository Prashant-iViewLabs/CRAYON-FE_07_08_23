import React from 'react';
import './index.css';
import '@fontsource/nunito/300.css';
import '@fontsource/nunito/400.css';
import '@fontsource/nunito/500.css';
import '@fontsource/nunito/700.css';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { IntlProvider } from "react-intl";
import locale from './i18n/locale'
import App from './App';
import { store } from './store'
import reportWebVitals from './reportWebVitals';
import { ThemeProvider } from '@mui/material/styles';
import theme from './utils/Theme'

const root = ReactDOM.createRoot(document.getElementById('root'));
const defaultLocale = 'en'

root.render(
  // <React.StrictMode>
  <IntlProvider locale={defaultLocale} defaultLocale={defaultLocale} messages={locale.en}>
    <Provider store={store}>
      <BrowserRouter >
        <ThemeProvider theme={theme}>
          <App />
        </ThemeProvider>
      </BrowserRouter >
    </Provider>
  </IntlProvider>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
