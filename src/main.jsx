import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import LoginPage from './pages/LoginPage.jsx'
import TodoListPage from './pages/TodoListPage.jsx'
import App from "./App.jsx";
import "./main.css";

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App/>
  </BrowserRouter>,
)
