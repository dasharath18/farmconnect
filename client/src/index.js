import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthProvider } from "./context/AuthContext";
import axios from "axios";

const token = localStorage.getItem("token");
if (token) 
{
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
} 
else 
{
  delete axios.defaults.headers.common["Authorization"];
}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthProvider>
    <App />
  </AuthProvider>
);