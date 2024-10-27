import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './RegistrarUsuario.css';
import { Helmet } from 'react-helmet';

function EliminarUsuario() {
    const navigate = useNavigate();
    const [activeLink, setActiveLink] = useState(null); // Estado del enlace activo
    const [usuarios, setUsuarios] = useState([]); // Estado para los usuarios
    const [resultado, setResultado] = useState(''); // Estado para mostrar mensajes

    useEffect(() => {
        // Llama a la API para obtener usuarios
        const obtenerUsuarios = async () => {
            try {
                const response = await fetch('https://sistemacontableweb-enebcuhnc7gufggy.brazilsouth-01.azurewebsites.net/usuarios'); // Endpoint para obtener usuarios
                const data = await response.json();
                setUsuarios(data);
            } catch (error) {
                console.error('Error al obtener usuarios:', error);
            }
        };

        obtenerUsuarios();
    }, []);

    const handleNavigation = (path, index) => {
        setActiveLink(index);
        navigate(path);
    };

    const eliminarUsuario = async (usuarioId) => {
      try {
          const response = await fetch(`https://sistemacontableweb-enebcuhnc7gufggy.brazilsouth-01.azurewebsites.net/usuarios/${usuarioId}`, {
              method: 'DELETE',
              headers: {
                  'Content-Type': 'application/json',
              },
          });
  
          if (response.ok) {
              // Eliminar usuario de la lista local
              setUsuarios(usuarios.filter(usuario => usuario.id !== usuarioId));
              setResultado('Usuario eliminado con éxito.');
          } else {
              const errorMessage = await response.text(); // Obtener el mensaje de error
              setResultado(`Error al eliminar el usuario: ${errorMessage}`);
              console.error('Error en la eliminación:', errorMessage);
          }
      } catch (error) {
          console.error('Error al eliminar usuario:', error);
          setResultado('Error en la eliminación.');
      }
  };
    return (
      <div className="top-bar">
          <div className="container">
              <Helmet>
                  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
              </Helmet>
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
              <div className="Hola">
                  <h1>Eliminar Usuario</h1>
                  <p>{resultado}</p>
                  <table>
                      <thead>
                          <tr>
                              <th>ID</th>
                              <th>Nombre</th>
                              <th>Correo</th>
                              <th>Acciones</th>
                          </tr>
                      </thead>
                      <tbody>
                          {usuarios.map((usuario) => (
                              <tr key={usuario.id}>
                                  <td>{usuario.id}</td>
                                  <td>{usuario.nombre}</td>
                                  <td>{usuario.correo}</td>
                                  <td>
                                      <button className="btn-eliminar" onClick={() => eliminarUsuario(usuario.id)}>
                                          Eliminar
                                      </button>
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
          </div>
      </div>
  );
}

export default EliminarUsuario;
