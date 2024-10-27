import React, { useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom';
import './GestionDeCuentas.css';
import { Helmet } from 'react-helmet';

function RegistrarCuentas() {
    const [userRole, setUserRole] = useState('');
    const [nombreUsuario, setNombreUsuario] = useState(null);
    const [formData, setFormData] = useState({
        cuentaPadreId: "",
        codigo: '',
        tipo: '',
        nombre: '',
        descripcion: '',
    });
  
    const [cuentasPadre, setCuentas] = useState([]);
    const [output, setOutput] = useState(null);
    const [error, setError] = useState(null);
    const [activeLink, setActiveLink] = useState(0);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const storedNombreUsuario = localStorage.getItem('nombreUsuario');
        if (storedNombreUsuario) {
            setNombreUsuario(storedNombreUsuario);
            fetchUserProfile(storedNombreUsuario);
        } else {
            console.error('Nombre de usuario no disponible en localStorage');
        }
    }, []);

    const fetchUserProfile = async (nombre) => {
        try {
            const response = await fetch(`https://sistemacontableweb-enebcuhnc7gufggy.brazilsouth-01.azurewebsites.net/usuarios/nombre-usuario/${nombre}/perfil`);
            if (response.ok) {
                const data = await response.json();
                setUserRole(data.rol);
            } else {
                throw new Error('Error al obtener el perfil del usuario');
            }
        } catch (error) {
            setError('No se pudo cargar el perfil del usuario.');
            console.error('Error en la solicitud:', error);
        }
    };

    useEffect(() => {
      const fetchCuentas = async () => {
        try {
          const response = await fetch('https://sistemacontableweb-enebcuhnc7gufggy.brazilsouth-01.azurewebsites.net/cuentas');
          if (response.ok) {
            const data = await response.json();
            setCuentas(data);
          } else {
            console.error('Error al obtener las cuentas');
          }
        } catch (error) {
          console.error('Error en la solicitud de cuentas:', error);
        }
      };
  
      fetchCuentas();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }));
    };

    const crearCuenta = async (cuenta) => {
      // Verifica si se ha seleccionado una cuenta padre o un tipo
      const cuentaData = { 
          cuentaPadreId: cuenta.cuentaPadreId ? parseInt(cuenta.cuentaPadreId) : null,
          codigo: parseInt(cuenta.codigo),
          tipo: cuenta.cuentaPadreId ? null : cuenta.tipo,  // Asigna null a tipo si hay cuentaPadreId
          nombre: cuenta.nombre,
          descripcion: cuenta.descripcion,
      };
  
      setLoading(true); 
  
      try {
          const response = await fetch('https://sistemacontableweb-enebcuhnc7gufggy.brazilsouth-01.azurewebsites.net/cuentas', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(cuentaData),
          });
  
          const responseText = await response.text();
  
          if (!response.ok) {
              throw new Error(responseText || 'Error al crear la cuenta');
          }
  
          setOutput(responseText); 
          setError(null); 
  
      } catch (error) {
          console.error('Request failed:', error.message);
          setError(error.message); 
      } finally {
          setLoading(false);
      }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validar que solo una de las dos opciones esté seleccionada
    if (!formData.cuentaPadreId && !formData.tipo) {
        setError('Debe seleccionar una cuenta padre o un tipo.');
        return;
    }

    // Llama a crearCuenta solo si hay una opción seleccionada
    crearCuenta(formData);
};

    const handleNavigation = (path, link) => {
        setActiveLink(link); 
        navigate(path);
    };

    const handleCuentaPadreChange = (e) => {
        const selectedCuentaPadreId = e.target.value;
        setFormData(prevFormData => ({
            ...prevFormData,
            cuentaPadreId: selectedCuentaPadreId
        }));

        const selectedCuentaPadre = cuentasPadre.find(cuenta => cuenta.id === parseInt(selectedCuentaPadreId));
        if (selectedCuentaPadre) {
            setFormData(prevFormData => ({
                ...prevFormData,
                tipo: selectedCuentaPadre.tipo
            }));
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
                    <h1>Formulario de Datos</h1>
                    <form onSubmit={handleSubmit}>  {/* La etiqueta <form> ahora está correctamente cerrada */}
                        {loading && <div>Loading...</div>}
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
                            <label htmlFor="codigo">Codigo:</label>
                            <input
                                type="number"
                                id="codigo"
                                name="codigo"
                                value={formData.codigo}
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
                        <div className="form-group">
                            <label htmlFor="cuentaPadreId">Cuenta Padre:</label>
                            <select
                                id="cuentaPadreId"
                                name="cuentaPadreId"
                                value={formData.cuentaPadreId || ''}
                                onChange={handleCuentaPadreChange} 
                            >
                                <option value="">Seleccione una cuenta padre (opcional)</option>
                                {cuentasPadre.map((cuenta) => (
                                    <option key={cuenta.id} value={cuenta.id}>{cuenta.nombre}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="tipo">Tipo:</label>
                            <select
                                        id="tipo"
                                        name="tipo"
                                        value={formData.tipo}
                                        onChange={handleChange}
                                        required
                                        disabled={!!formData.cuentaPadreId} // Este campo se habilita si no se selecciona una cuenta padre
                                    >
                                        <option value="">Seleccione un tipo</option>
                                        <option value="ACTIVO">Activo</option>
                                        <option value="PASIVO">Pasivo</option>
                                        <option value="PATRIMONIO">Patrimonio neto</option>
                                        <option value="RESULTADO_POSITIVO">Resultado positivo</option>
                                        <option value="RESULTADO_NEGATIVO">Resultado negativo</option>
                                    </select>
                        </div>
                        <button type="submit" disabled={loading}>Registrar Cuenta</button>
                        {output && <div className="success-message">{output}</div>}
                        {error && <div className="error-message">{error}</div>}
                    </form> {/* <form> ahora correctamente cerrada */}
                </div>
            </div>
        </div>
    );
}

export default RegistrarCuentas;
