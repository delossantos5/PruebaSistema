import React, { useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom';
import './GestionDeCuentas.css';
import { Helmet } from 'react-helmet';

function EditarCuenta() {
  const [userRole, setUserRole] = useState('');
  const [nombreUsuario, setNombreUsuario] = useState(null);
  const navigate = useNavigate()
  const [activeLink, setActiveLink] = useState(null);

  useEffect(() => {
    const storedNombreUsuario = localStorage.getItem('nombreUsuario');
    
    if (storedNombreUsuario) {
      setNombreUsuario(storedNombreUsuario);
      const fetchUserProfile = async () => {
        try {
          const response = await fetch(`https://sistemacontableweb-enebcuhnc7gufggy.brazilsouth-01.azurewebsites.net/usuarios/nombre-usuario/${storedNombreUsuario}/perfil`);
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

  const [formData, setFormData] = useState({
    nombre: '',
    codigo: '',
    tipo: '',
    descripcion: '',
    idPadre: '',
    id: null,
  });

  const [busqueda, setBusqueda] = useState('');
  const [cuentaEncontrada, setCuentaEncontrada] = useState(null);

  const buscarCuenta = async () => {
    if (busqueda.trim() === '') {
      alert('Por favor, ingrese un código o nombre de cuenta válido.');
      return;
    }
    try {
      let response;
      
      // Verificamos si el valor ingresado es numérico para decidir si buscar por código o por nombre.
      if (!isNaN(busqueda)) {
        // Si es numérico, asumimos que es un código.
        response = await fetch(`https://sistemacontableweb-enebcuhnc7gufggy.brazilsouth-01.azurewebsites.net/cuentas/codigo/${busqueda}`);
      } else {
        // Si no es numérico, asumimos que es un nombre.
        response = await fetch(`https://sistemacontableweb-enebcuhnc7gufggy.brazilsouth-01.azurewebsites.net/cuentas/nombre/${busqueda}`);
      }

      if (!response.ok) {
        throw new Error('Cuenta no encontrada');
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
        id: null,
      });
      setCuentaEncontrada(null);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const editarCuenta = async () => {
    try {
        const response = await fetch(`https://sistemacontableweb-enebcuhnc7gufggy.brazilsouth-01.azurewebsites.net/cuentas/${cuentaEncontrada.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
              nombre: formData.nombre,
              descripcion: formData.descripcion,
          }),
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            console.error('Respuesta de error:', errorMessage);
            throw new Error(errorMessage);
        }
        alert('Cuenta actualizada exitosamente.');
        localStorage.setItem('cuentaRegistrada', JSON.stringify(formData));
    } catch (error) {
        console.error('Error al editar cuenta:', error);
        alert('Error al actualizar la cuenta: ' + error.message);
    }
};

  const handleSubmit = (e) => {
    e.preventDefault();
    editarCuenta();
  };

  const handleCancel = () => {
    if (window.confirm('¿Estás seguro de que quieres cancelar? Se perderán los cambios no guardados.')) {
      setFormData({
        nombre: '',
        codigo: '',
        tipo: '',
        descripcion: '',
        idPadre: '',
        id: null,
      });
      alert('Edición cancelada.');
    }
  };

  const handleNavigation = (ruta, linkIndex) => {
    setActiveLink(linkIndex);
    navigate(ruta);
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
                  <h1>Editar Cuenta</h1>
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

                  <form onSubmit={handleSubmit}>
                    <div className="form-group">
                      <label htmlFor="nombre">Nombre:</label>
                      <input
                        type="text"
                        id="nombre"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="descripcion">Descripción:</label>
                      <input
                        type="text"
                        id="descripcion"
                        name="descripcion"
                        value={formData.descripcion}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="button-group">
                      <button type="submit">Guardar</button>
                      <button type="button" className="cancel-btn" onClick={handleCancel}>Cancelar</button>
                      <button onClick={() => handleNavigation('/gestiondecuentas')} className="btn btn-secondary">Volver al Menú</button>
                    </div>
                  </form>
                </div>
            </div>
        </div>
    );
}

export default EditarCuenta;
