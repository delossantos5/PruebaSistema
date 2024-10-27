import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import './AsientoContable.css';
import { Helmet } from 'react-helmet';

const AsientoContable = () => {
  const [userRole, setUserRole] = useState(''); // Estado para el rol del usuario
  const [nombreUsuario, setNombreUsuario] = useState(null); // Estado para el nombre de usuario
  const navigate = useNavigate();
  const [activeLink, setActiveLink] = useState(null);
  
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

  const [asiento, setAsiento] = useState({
    fecha: '',
    descripcion: '',
    transacciones: [
      { cuentaId: '', debe: 0, haber: 0 }
    ],
    usuario: ''
  });

  const [mensaje, setMensaje] = useState('');
  const [cuentas, setCuentas] = useState([]);
  
  useEffect(() => {
    const usuarioLogeado = localStorage.getItem('nombreUsuario') || 'UsuarioEjemplo';
    
    const fechaActual = new Date();
    const fechaLocal = new Date(fechaActual.getTime() - (fechaActual.getTimezoneOffset() * 60000));
    const fechaString = fechaLocal.toISOString().split('T')[0]; // Esto será YYYY-MM-DD

    setAsiento(prevAsiento => ({
        ...prevAsiento,
        fecha: fechaString, // Asegúrate de que esto sea correcto
        usuario: usuarioLogeado 
    }));

    const fetchCuentas = async () => {
      try {
        const response = await fetch('https://sistemacontableweb-enebcuhnc7gufggy.brazilsouth-01.azurewebsites.net//cuentas/recibe-saldo?recibeSaldo=true');
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
  const handleNavigation = (path, index) => {
    setActiveLink(index);
    navigate(path);
  };

  const handleTransactionChange = (index, e) => {
    const { name, value } = e.target;
    const nuevasTransacciones = [...asiento.transacciones];

    if (name === 'cuenta') {
        // Aquí debes cambiar el value para almacenar el cuentaId, si lo tienes en el objeto cuenta
        const cuentaSeleccionada = cuentas.find(cuenta => cuenta.nombre === value);
        nuevasTransacciones[index] = {
            ...nuevasTransacciones[index],
            cuentaId: cuentaSeleccionada ? cuentaSeleccionada.id : '', // Asegúrate de tener el id correcto
        };
    } else {
        nuevasTransacciones[index] = {
            ...nuevasTransacciones[index],
            [name]: isNaN(value) ? value : parseFloat(value) // Asegura que debe/haber sean numéricos
        };
    }

    setAsiento({
        ...asiento,
        transacciones: nuevasTransacciones
    });
};

  const agregarTransaccion = () => {
    setAsiento({
      ...asiento,
      transacciones: [...asiento.transacciones, { cuentaId: '', debe: 0, haber: 0 }]
    });
  };

  const eliminarTransaccion = (index) => {
    const nuevasTransacciones = asiento.transacciones.filter((_, i) => i !== index);
    setAsiento({
      ...asiento,
      transacciones: nuevasTransacciones
    });
  };

  const handleChange = (e) => {
    setAsiento({
      ...asiento,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const totalDebe = asiento.transacciones.reduce((sum, transaccion) => sum + parseFloat(transaccion.debe || 0), 0);
    const totalHaber = asiento.transacciones.reduce((sum, transaccion) => sum + parseFloat(transaccion.haber || 0), 0);

    // Verificar que el asiento esté balanceado
    if (totalDebe !== totalHaber) {
        setMensaje('El asiento no está balanceado. Asegúrese de que la suma de Debe sea igual a la suma de Haber.');
        return; 
    }

    // Verificar cuentas duplicadas
    const cuentasSeleccionadas = asiento.transacciones.map(t => t.cuentaId);
    const cuentasDuplicadas = cuentasSeleccionadas.filter((cuenta, index) => cuentasSeleccionadas.indexOf(cuenta) !== index);
    
    if (cuentasDuplicadas.length > 0) {
        setMensaje('No se puede repetir cuentas en un asiento.');
        return;
    }

    try {
        const storedNombreUsuario = localStorage.getItem('nombreUsuario') || 'UsuarioEjemplo';

        const asientoData = {
            fecha: asiento.fecha,
            descripcion: asiento.descripcion,
            cuentaAsiento: asiento.transacciones.map(t => ({
                cuentaId: t.cuentaId,
                debe: t.debe,
                haber: t.haber
            }))
        };

        const response = await fetch(`https://sistemacontableweb-enebcuhnc7gufggy.brazilsouth-01.azurewebsites.net/asientos?nombreUsuario=${storedNombreUsuario}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(asientoData),
        });

        if (response.ok) {
            setMensaje('Asiento contable registrado con éxito.');
            setAsiento({
                fecha: '',
                descripcion: '',
                transacciones: [{ cuentaId: '', debe: 0, haber: 0 }],
            });
        } else {
            const errorMessage = await response.text();
            setMensaje(`Ocurrió un error: ${errorMessage}`);
        }
    } catch (error) {
        console.error('Error al registrar el asiento contable:', error);
        setMensaje('Ocurrió un error al registrar el asiento contable.');
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
        <div className="contenedor-asientoContable">
          <h2>Registro de Asiento Contable</h2>
          <form onSubmit={handleSubmit}>
          <div className="form-group">
              <label htmlFor="fecha">Fecha</label>
              <input
                type="date"
                name="fecha"
                value={asiento.fecha}
                onChange={handleChange} // Asegúrate de manejar el cambio de fecha
                required
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label htmlFor="descripcion">Descripción</label>
              <input
                type="text"
                name="descripcion"
                value={asiento.descripcion}
                onChange={handleChange}
                required
                className="form-control"
              />
            </div>
            <h3>Transacciones</h3>
            <div className="tabla-scroll">
              <table className="table">
                <thead>
                  <tr>
                    <th>Cuenta</th>
                    <th>Debe</th>
                    <th>Haber</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {asiento.transacciones.map((transaccion, index) => (
                    <tr key={index}>
                      <td>
                        <select
                          name="cuenta"
                          value={transaccion.cuenta}
                          onChange={(e) => handleTransactionChange(index, e)}
                          required
                          className="form-control"
                        >
                          <option value="">Seleccione una cuenta</option>
                          {cuentas.map((cuenta, idx) => (
                            <option key={idx} value={cuenta.nombre}>{cuenta.nombre}</option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <input type="number" name="debe" value={transaccion.debe} onChange={(e) => handleTransactionChange(index, e)} required className="form-control" />
                      </td>
                      <td>
                        <input type="number" name="haber" value={transaccion.haber} onChange={(e) => handleTransactionChange(index, e)} required className="form-control"/>
                      </td>
                      <td>
                        <button type="button" className="btn btn-danger" onClick={() => eliminarTransaccion(index)}>
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button type="button" className="btn btn-secondary" onClick={agregarTransaccion}>
              Agregar Transacción
            </button>
            <div className="form-group mt-3">
              <label htmlFor="usuario">Usuario</label>
              <input
                type="text"
                name="usuario"
                value={asiento.usuario}
                onChange={handleChange}
                required
                className="form-control"
                readOnly
              />
            </div>
            <button type="submit" className="btn btn-primary">Registrar Asiento</button>
          </form>
          {mensaje && <p>{mensaje}</p>}
        </div>
      </div>
    </div>
  );
};

export default AsientoContable;
