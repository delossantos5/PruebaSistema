import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import './Login.css';

function Login() {
  const [nombreUsuario, setnombreUsuario] = useState('');
  const [contrasenia, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(''); // Estado para manejar el mensaje de error
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return; // Evitar múltiples envíos
    setLoading(true);

    try {
      const response = await fetch(`https://sistemacontableweb-enebcuhnc7gufggy.brazilsouth-01.azurewebsites.net/usuarios/autenticar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          nombreUsuario,
          contrasenia,
        }),
      });
  
      if (response.ok) {
        const token = await response.text(); // O el nombre del usuario autenticado
        console.log('Autenticación exitosa:', token);

        // Guarda el nombre de usuario en localStorage
        localStorage.setItem('nombreUsuario', nombreUsuario);

        // Navega al menú principal
        navigate('/menu');
      } else {
        setError('Usuario o contraseña incorrectos'); // Mostrar mensaje de error
      }
    } catch (error) {
      console.error('Error al autenticar:', error);
      setError('Error en la conexión. Inténtalo nuevamente.');
    } finally {
      setLoading(false); // Restaurar el estado de carga
    }
  };
    
  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-container">
      <Helmet>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
      </Helmet>
      
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Sistema Contable</h2>

        {error && <p className="error-message">{error}</p>} {/* Mostrar error si lo hay */}

        <div className="input-group">
          <input 
            type="text" 
            id="username" 
            placeholder="Usuario" 
            value={nombreUsuario}
            onChange={(e) => setnombreUsuario(e.target.value)}
            required
          />
        </div>

        <div className="input-group password-group">
          <input 
            type={showPassword ? "text" : "password"} 
            id="password" 
            value={contrasenia} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="Ingresa tu contraseña"
            required
          />
          {/* Ícono para mostrar/ocultar la contraseña */}
          <span className="password-toggle" onClick={togglePassword}>
            <span className="material-icons">{showPassword ? 'visibility_off' : 'visibility'}</span>
          </span>
        </div>

        <button type="submit" className="btn-login" disabled={loading}>
          {loading ? 'Cargando...' : 'Iniciar Sesión'}
        </button>
      </form>
    </div>
  );
}

export default Login;
