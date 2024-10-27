import React, { useState, useEffect } from 'react'; // Añadir useEffect
import { useNavigate } from 'react-router-dom';
import './GestionDeCuentas.css';
import { Helmet } from 'react-helmet';

function GestionDeCuentas() {
 
  const [userRole, setUserRole] = useState(''); // Estado para el rol del usuario
  const [nombreUsuario, setNombreUsuario] = useState(null); // Estado para el nombre de usuario
  const [cuentas, setCuentas] = useState([]); // Estado para el plan de cuentas
  const [mostrarTabla, setMostrarTabla] = useState(false); // Estado para controlar si se muestra la tabla
  const navigate = useNavigate();
  const [activeLink, setActiveLink] = useState(null);

  useEffect(() => {
    // Obtener el nombre de usuario desde localStorage
    const storedNombreUsuario = localStorage.getItem('nombreUsuario');
    
    if (storedNombreUsuario) {
      setNombreUsuario(storedNombreUsuario); // Actualiza el estado con el nombre de usuario

      const fetchUserProfile = async () => {
        try {
          const response = await fetch(`https://sistemacontableweb-enebcuhnc7gufggy.brazilsouth-01.azurewebsites.net/usuarios/nombre-usuario/${storedNombreUsuario}/perfil`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          if (response.ok) {
            const data = await response.json();
            setUserRole(data.rol);  // Actualiza el estado con el rol del usuario
          } else {
            console.error('Error al obtener el perfil del usuario');
          }
        } catch (error) {
          console.error('Error en la solicitud:', error);
        }
      };

      fetchUserProfile();
    } else {
      console.error('Nombre de usuario no disponible en localStorage');
    }
  }, []);  // Se ejecuta solo al montar el componente

 
 const irARegistrarCuentas = () => {
  navigate('/registrarcuenta'); // Redirige a RegistrarAsiento.js
};
const irAPlanDeCuentas = () => {
  navigate('/plandecuentas'); // Redirige a RegistrarAsiento.js
};

const irAEditarCuentas = () => {
  navigate('/editarcuenta'); // Redirige a EditarAsiento.js
};

const irAEliminarCuentas = () => {
  navigate('/eliminarcuenta'); // Redirige a BorrarAsiento.js
};
  // Función de navegación
  const handleNavigation = (path) => {
    navigate(path);
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
           {/* Menú para el administrador */}
           {nombreUsuario === 'Administrador' ? (  // Compara directamente con 'Administrador', despues arreglar esto
              <div className="tabla-scroll">
                <a href="/#" onClick={() => handleNavigation('/menu')}>
                    <span className="material-icons">home</span>
                    <h3>Menu principal</h3>
                </a>
                <a
                  href="/#"
                  className={activeLink === 0 ? 'active clicked' : ''} 
                  onClick={() => handleNavigation('/gestiondeusuarios', 0)}
                >
                  <span className="material-icons">admin_panel_settings</span>
                  <h3>Gestionar Usuarios</h3>
                </a>
                <a
                  href="/#"
                  className={activeLink === 1 ? 'active clicked' : ''}
                  onClick={() => handleNavigation('/gestiondeperfiles', 1)}
                >
                  <span className="material-icons">supervised_user_circle</span>
                  <h3>Gestionar Perfiles</h3>
                </a>
                <a
                  href="/#"
                  className={activeLink === 2 ? 'active clicked' : ''}
                  onClick={() => handleNavigation('/gestiondecuentas', 2)}
                >
                  <span className="material-icons">book</span>
                  <h3>Gestionar Cuentas</h3>
                </a>
                <a
                  href="/#"
                  className={activeLink === 3 ? 'active clicked' : ''} 
                  onClick={() => handleNavigation('/asientocontable', 3)}
                >
                  <span className="material-icons">person_outline</span>
                  <h3>Gestionar Asientos</h3>
                </a>
                <a
                  href="/#"
                  className={activeLink === 4 ? 'active clicked' : ''} 
                  onClick={() => handleNavigation('/libro-diario', 4)}
                >
                  <span className="material-icons">receipt_long</span>
                  <h3>Libro Diario</h3>
                </a>
                <a
                  href="/#"
                  className={activeLink === 5 ? 'active clicked' : ''} 
                  onClick={() => handleNavigation('/libro-mayor', 5)}
                >
                  <span className="material-icons">menu_book</span>
                  <h3>Libro Mayor</h3>
                </a>
                <a
                  href="/#"
                  className={activeLink === 6 ? 'active clicked' : ''} 
                  onClick={() => handleNavigation('/', 6)}
                >
                  <span className="material-icons">logout</span>
                  <h3>Cerrar Sesión</h3>
                </a>
              </div>
            ) : (
              // Menú para usuarios comunes
              <div>
                <a href="/#" onClick={() => handleNavigation('/menu')}>
                    <span className="material-icons">home</span>
                    <h3>Menu principal</h3>
                </a>
                <a
                  href="/#"
                  className={activeLink === 0 ? 'active clicked' : ''} 
                  onClick={() => handleNavigation('/gestiondecuentas', 0)}
                >
                  <span className="material-icons">book</span>
                  <h3>Gestionar Cuentas</h3>
                </a>
                <a
                  href="/#"
                  className={activeLink === 1 ? 'active clicked' : ''} 
                  onClick={() => handleNavigation('/asientocontable', 1)}
                >
                  <span className="material-icons">person_outline</span>
                  <h3>Gestionar Asientos</h3>
                </a>
                <a
                  href="/#"
                  className={activeLink === 2 ? 'active clicked' : ''} 
                  onClick={() => handleNavigation('/libro-diario', 2)}
                >
                  <span className="material-icons">receipt_long</span>
                  <h3>Libro Diario</h3>
                </a>
                <a
                  href="/#"
                  className={activeLink === 3 ? 'active clicked' : ''} 
                  onClick={() => handleNavigation('/libro-mayor', 3)}
                >
                  <span className="material-icons">menu_book</span>
                  <h3>Libro Mayor</h3>
                </a>
                <a
                  href="/#"
                  className={activeLink === 4 ? 'active clicked' : ''} 
                  onClick={() => handleNavigation('/', 4)}
                >
                  <span className="material-icons">logout</span>
                  <h3>Cerrar Sesión</h3>
                </a>
              </div>
            )}
          </div>
        </aside>

        {/* Contenedor principal */}
        <div className="main-container">
          <h2>Elige la acción que deseas realizar</h2>
            <div class="button-container">
              <button onClick={irAPlanDeCuentas}>Mostrar plan de cuentas</button> {/* Nuevo botón */}
              <button onClick={irARegistrarCuentas}>Registrar nueva cuenta</button>
              <button onClick={irAEditarCuentas}> Editar cuenta</button>
              <button onClick={irAEliminarCuentas}>Eliminar cuenta</button>
            </div>
        </div>
      </div>
    </div>
  );
}

export default GestionDeCuentas;
