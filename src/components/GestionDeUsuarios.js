import React, { useState } from 'react'; // Importar useState para gestionar el rol de usuario localmente.
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import './GestionDeCuentas.css'
function GestionDeUsuarios() {
    const navigate = useNavigate();
    const [activeLink, setActiveLink] = useState(null); // Definición del estado activo del menú.
    const irARegistrarUsuario = () => {
        navigate('/registrarUsuario'); // Redirige a registrar usuario
      };
      
      const irAEliminarUsuario = () => {
        navigate('/eliminarusuario'); // Redirige a eliminar usuario
      };
  
    const handleNavigation = (path, index) => {
      setActiveLink(index); // Cambiar el estado del enlace activo.
      navigate(path); // Navegar a la ruta deseada.
    };
    return(
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
                    href="/#" className="active"
                    onClick={() => handleNavigation('/gestiondeusuarios')}
                    >
                    <span className="material-icons">admin_panel_settings</span>
                    <h3>Gestionar Usuarios</h3>
                    </a>
                    <a href="/#"  onClick={() => navigate('/gestiondeperfiles')}>
                    <span className="material-icons">supervised_user_circle</span>
                    <h3>Gestionar Perfiles</h3>
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
                        <h3>Gestionar asiento </h3>
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
                {/*Menu*/}
                <div className="main-container">
                    <h2>Elige la acción que deseas realizar</h2>
                    <div class="button-container">
                        <button onClick={irARegistrarUsuario}>Registrar usuario</button>
                        <button onClick={irAEliminarUsuario}>Eliminar usuario</button>
                    </div>
                </div>
            </div>
       </div>
    )
};
export default GestionDeUsuarios;
