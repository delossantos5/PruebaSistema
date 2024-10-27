import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './GestionDeCuentas.css';
import { Helmet } from 'react-helmet';

function EliminarCuenta() {
  const [busqueda, setBusqueda] = useState(''); // Estado para el valor del buscador
  const [userRole, setUserRole] = useState('');
  const [nombreUsuario, setNombreUsuario] = useState(null);
  const navigate = useNavigate();
  const [activeLink, setActiveLink] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    codigo: '',
    tipo: '',
    descripcion: '',
    idPadre: '',
  });

  useEffect(() => {
    const storedNombreUsuario = localStorage.getItem('nombreUsuario');
    if (storedNombreUsuario) {
      setNombreUsuario(storedNombreUsuario);
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
            setUserRole(data.rol);
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
  }, []);

  const [cuentas, setCuentas] = useState([]);
  const [resultado, setResultado] = useState('');
  const [cuentaEncontrada, setCuentaEncontrada] = useState(null);

  useEffect(() => {
    const fetchCuentas = async () => {
      try {
        const response = await fetch('https://sistemacontableweb-enebcuhnc7gufggy.brazilsouth-01.azurewebsites.net/cuentas');
        if (!response.ok) {
          throw new Error('Error al obtener cuentas');
        }
        const data = await response.json();
        setCuentas(data);
      } catch (error) {
        console.error('Error al cargar cuentas:', error);
        setResultado('Error al cargar cuentas: ' + error.message);
      }
    };
    fetchCuentas();
  }, []);

  // Función para eliminar cuenta
  const eliminarCuenta = async (id) => {
    try {
      const response = await fetch(`https://sistemacontableweb-enebcuhnc7gufggy.brazilsouth-01.azurewebsites.net/cuentas/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
      }

      setResultado(`La cuenta con ID ${id} ha sido eliminada.`);
      setCuentas(cuentas.filter(cuenta => cuenta.id !== id));
      setCuentaEncontrada(null);
      setBusqueda(''); // Limpiar el campo de búsqueda
    } catch (error) {
      console.error('Error al eliminar cuenta:', error);
      setResultado(`Error al eliminar la cuenta: ${error.message}`);
    }
  };

  // Función para buscar la cuenta por código o nombre
  const buscarCuenta = async () => {
    if (busqueda.trim() === '') {
      alert('Por favor, ingrese un código o nombre válido.');
      return;
    }
    
    // Determinar si la búsqueda es por código o por nombre
    const esCodigo = /^\d+$/.test(busqueda); // Verificar si es solo números (código)
    const url = esCodigo
      ? `https://sistemacontableweb-enebcuhnc7gufggy.brazilsouth-01.azurewebsites.net/cuentas/codigo/${busqueda}`
      : `https://sistemacontableweb-enebcuhnc7gufggy.brazilsouth-01.azurewebsites.net/cuentas/nombre/${busqueda}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Cuenta no encontrada');
        } else {
          throw new Error('Error al buscar la cuenta');
        }
      }

      const cuenta = await response.json();
      setFormData(cuenta);
      setCuentaEncontrada(cuenta);
    } catch (error) {
      alert(error.message);
      setFormData({
        nombre: '',
        codigo: '',
        tipo: '',
        descripcion: '',
        idPadre: '',
      });
      setCuentaEncontrada(null);
    }
  };

  // Función para manejar la navegación
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
        <div className='Hola'>
          <h1>Eliminar Cuenta</h1>

          <div className="form-group">
            <label htmlFor="busqueda">Ingrese el código o nombre de la cuenta:</label>
            <input
              type="text"
              id="busqueda"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Código o nombre de cuenta"
            />
            <button onClick={buscarCuenta} className="button1">Buscar</button>
          </div>

          {cuentaEncontrada && (
            <div>
              <h2>Cuenta Encontrada:</h2>
              <p>
                {cuentaEncontrada.nombre} (Código: {cuentaEncontrada.codigo}, ID: {cuentaEncontrada.id})
              </p>
              <button onClick={() => eliminarCuenta(cuentaEncontrada.id)} className="button">
                Eliminar Cuenta
              </button>
            </div>
          )}

          <h2>Resultado:</h2>
          <pre>{resultado}</pre>
          <button onClick={() => navigate('/gestiondecuentas')} className="btn btn-secondary">Volver al Menú</button>
        </div>
      </div>
    </div>
  );
}

export default EliminarCuenta;
