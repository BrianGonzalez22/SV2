import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // Importa useNavigate
import { jwtDecode } from 'jwt-decode'; // ✅ Esto es lo correcto

const Login = ({ setIsAuthenticated }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
  
    const handleLogin = async (e) => {
      e.preventDefault();
      try {
        const response = await axios.post('http://localhost:8000/login/', {
          username,
          password
        });

        const access = response.data.access;
        const refresh = response.data.refresh;

        // Decodifica el token para extraer el rol
        const decoded = jwtDecode(access);
        const role = decoded.role;

        console.log("Token decodificado:", decoded);
        console.log("Respuesta del backend:", response.data);

        // Guarda en localStorage
        localStorage.setItem('access', access);
        localStorage.setItem('refresh', refresh);
        localStorage.setItem('role', role);

        setIsAuthenticated(true);
        alert('Login exitoso');
        navigate('/');
      } catch (error) {
        alert('Error en el login. Verifique sus credenciales.');
      }
    };

  
    return (
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Iniciar Sesión</button>
      </form>
    );
  };
  
  export default Login;
