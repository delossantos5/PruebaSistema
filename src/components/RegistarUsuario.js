import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import './RegistrarUsuario.css';

function RegistrarUsuario() {
  const [username, setUsername] = useState('');
  const [perfil, setPerfil] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [activeLink, setActiveLink] = useState(0);
  const navigate = useNavigate();

  const handleNavigation = (path, index) => {
    setActiveLink(index);
    navigate(path);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevenir el comportamiento por defecto del formulario

    // Validación de contraseñas
    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    const usuario = {
      nombreUsuario: username,
      contrasenia: password,
      perfil: perfil,
    };

    try {
      const response = await fetch('https://sistemacontableweb-enebcuhnc7gufggy.brazilsouth-01.azurewebsites.net/usuarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(usuario),
      });

      if (response.ok) {
        alert("Usuario registrado exitosamente");
        navigate('/menu'); // Redirigir a la página de menú después del registro
      } else {
        const errorMessage = await response.text();
        alert(`Error al registrar usuario: ${errorMessage}`);
      }
    } catch (error) {
      alert("Error en la conexión: " + error.message);
    }
  };

  return (
    <div className="top-bar">
      <div className="container">
        <Helmet>
          <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
        </Helmet>
        {/* Sidebar Section */}
        <aside>
          <div className="toggle">
            <div className="logo">
              <img src={require('../assets/alt-de-deposito.png')} alt="Logo" />
              <h2>Sistema Contable</h2>
            </div>
            <div className="close" id="close-btn">
              <span className="material-icons">close</span>
            </div>
          </div>
          <div className="sidebar">
            <a href="/#" onClick={() => handleNavigation('/menu')}>
              <span className="material-icons">home</span>
              <h3>Menu principal</h3>
            </a>
            <a
              href="/#"
              className="active"
              onClick={() => handleNavigation('/gestiondeusuarios')}
            >
              <span className="material-icons">admin_panel_settings</span>
              <h3>Gestionar Usuarios</h3>
            </a>
            <a
              href="/#"
              className={activeLink === 1 ? 'active clicked' : ''}
              onClick={() => handleNavigation('/gestiondecuentas', 0)}
            >
              <span className="material-icons">book</span>
              <h3>Gestionar cuentas</h3>
            </a>
            <a href="/#" onClick={() => handleNavigation('/asientocontable')}>
              <span className="material-icons">person_outline</span>
              <h3>Gestionar asiento</h3>
            </a>
            <a
              href="/#"
              className={activeLink === 3 ? 'active clicked' : ''}
              onClick={() => handleNavigation('/libro-diario', 3)}
            >
              <span className="material-icons">receipt_long</span>
              <h3>Libro diario</h3>
            </a>
            <a
              href="/#"
              className={activeLink === 4 ? 'active clicked' : ''}
              onClick={() => handleNavigation('/libro-mayor', 4)}
            >
              <span className="material-icons">menu_book</span>
              <h3>Libro mayor</h3>
            </a>
            <a
              href="/#"
              className={activeLink === 5 ? 'active clicked' : ''}
              onClick={() => handleNavigation('/', 5)}
            >
              <span className="material-icons">logout</span>
              <h3>Cerrar Sesión</h3>
            </a>
          </div>
        </aside>
        <div className='Hola'>
          <h1>Formulario de Datos</h1>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Nombre de Usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Confirmar Contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          <div className="form-group">
              <label htmlFor="perfil">Perfil:</label>
              <select
                id="perfil"
                name="perfil"
                value={perfil}
                onChange={(e) => setPerfil(e.target.value)}
                required
              >
                <option value="">Seleccione un perfil</option>
                <option value="Administrador">Administrador</option>
                <option value="Contador">Contador</option>
              </select>
            </div>
            <button type="submit">Registrar</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RegistrarUsuario;
