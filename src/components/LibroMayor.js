import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import './Libros.css';

function LibroMayor() {
  const [userRole, setUserRole] = useState('');
  const [nombreUsuario, setNombreUsuario] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const [activeLink, setActiveLink] = useState(null);
  const [cuentaId, setCuentaId] = useState('');
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  const [previsualizacion, setPrevisualizacion] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [nombreCuenta, setNombreCuenta] = useState('');
  const [cuentaEncontrada,setCuentaEncontrada]=useState('');


  useEffect(() => {
    const storedNombreUsuario = localStorage.getItem('nombreUsuario');
    if (storedNombreUsuario) {
      setNombreUsuario(storedNombreUsuario);
      const fetchUserProfile = async () => {
        try {
          const response = await fetch(`https://sistemacontableweb-enebcuhnc7gufggy.brazilsouth-01.azurewebsites.net/usuarios/nombre-usuario/${storedNombreUsuario}/perfil`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
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

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLimpiar = () => {
    setCuentaId('');
    setFechaDesde('');
    setFechaHasta('');
    setPrevisualizacion([]);
  };

  

  const formatearFecha = (fecha) => {
    const dateObj = new Date(fecha);
    const dia = String(dateObj.getUTCDate()).padStart(2, '0');
    const mes = String(dateObj.getUTCMonth() + 1).padStart(2, '0');
    const año = dateObj.getUTCFullYear();
    return `${dia}-${mes}-${año}`;
  };
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
        setCuentaId(cuenta.id); // Asegúrate de que cuenta.id tenga un valor válido
        setNombreCuenta(cuenta.nombre);
        setCuentaEncontrada(cuenta);

        // Puedes añadir aquí más lógica si necesitas actualizar otros estados relacionados con el libro mayor.

    } catch (error) {
        alert(error.message);
        // Reinicia los estados si hay un error
        setCuentaId(null);
        setNombreCuenta('');
        setCuentaEncontrada(null);
    }
};
  
  const handlePrevisualizar = async () => {
    if (!cuentaId || !fechaDesde || !fechaHasta) {
        setErrorMessage('Por favor, completa todos los campos.');
        return;
    }

    if (new Date(fechaDesde) > new Date(fechaHasta)) {
        setErrorMessage('La fecha de inicio debe ser anterior o igual a la fecha de fin.');
        return;
    }

    setErrorMessage('');
    try {
        const url = `https://sistemacontableweb-enebcuhnc7gufggy.brazilsouth-01.azurewebsites.net/cuentas/${cuentaId}/libro-mayor?fechaInicio=${fechaDesde}&fechaFin=${fechaHasta}`;
        const response = await fetch(url);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error en la solicitud');
        }

        const data = await response.json();
        if (data.movimientos && data.movimientos.length > 0) {
            const previsualizacionData = data.movimientos.map(movimiento => ({
                fecha: movimiento.fecha,
                descripcion: movimiento.descripcion,
                nombreCuenta: nombreCuenta || 'Nombre no disponible',
                debe: movimiento.debe,
                haber: movimiento.haber,
                saldo: movimiento.saldo,
            }));
            setPrevisualizacion(previsualizacionData);
        } else {
            setPrevisualizacion([]);
            setErrorMessage('No se encontraron movimientos para esta cuenta.');
        }
    } catch (error) {
        setPrevisualizacion([]);
        setErrorMessage(`Error al obtener el libro mayor: ${error.message}`);
    }
};
  
  const handleGenerar = () => {
    const doc = new jsPDF();
    doc.autoTable({
        head: [['Fecha','Descripcion', 'Nombre de Cuenta', 'Debe', 'Haber', 'Saldo']],
        body: previsualizacion.map(item => [
            formatearFecha(item.fecha),
            item.descripcion,
            item.nombreCuenta,
            item.debe,
            item.haber,
            item.saldo
        ]),
    });
    doc.save('libro_mayor.pdf');
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
            {nombreUsuario === 'Administrador' ? (
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
                  onClick={() => handleNavigation('/reportes', 6)}
                >
                  <span className="material-icons">bar_chart</span>
                  <h3>Reportes</h3>
                </a>
              </div>
            ) : (
              <div className="tabla-scroll">
                <a href="/#" onClick={() => handleNavigation('/menu')}>
                  <span className="material-icons">home</span>
                  <h3>Menu principal</h3>
                </a>
                <a
                  href="/#"
                  className={activeLink === 5 ? 'active clicked' : ''}
                  onClick={() => handleNavigation('/libro-mayor', 5)}
                >
                  <span className="material-icons">menu_book</span>
                  <h3>Libro Mayor</h3>
                </a>
              </div>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <div className='Libro'>
          <h1>Libro Mayor</h1>
          <label htmlFor="busqueda">Ingrese el código o nombre de la cuenta:</label>
                    <input
                      type="text"
                      id="busqueda"
                      value={busqueda}
                      onChange={(e) => setBusqueda(e.target.value)}
                      placeholder="Código o nombre de cuenta"
                    />
                    <button onClick={buscarCuenta} className="button1">Buscar</button>
                  
            <input
              type="date"
              placeholder="Fecha desde"
              value={fechaDesde}
              onChange={(e) => setFechaDesde(e.target.value)}
            />
            <input
              type="date"
              placeholder="Fecha hasta"
              value={fechaHasta}
              onChange={(e) => setFechaHasta(e.target.value)}
            />
         
          <button onClick={handlePrevisualizar}>Previsualizar</button>
          <button onClick={handleGenerar}>Generar PDF</button>
          <button onClick={handleLimpiar}>Limpiar</button>
          {cuentaEncontrada && (
                <div>
                    <h2>Cuenta Encontrada:</h2>
                    <p>ID: {cuentaEncontrada.id}</p>
                    <p>Nombre: {cuentaEncontrada.nombre}</p>
                </div>
            )}
          {errorMessage && <div className="error">{errorMessage}</div>}
          {previsualizacion.length > 0 && (
            <div className="resultado-previsualizacion">
              <h2>Previsualización de resultados</h2>
              <table>
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Nombre de Cuenta</th>
                    <th>Debe</th>
                    <th>Haber</th>
                    <th>Saldo</th>
                  </tr>
                </thead>
                <tbody>
                  {previsualizacion.map((item, index) => (
                    <tr key={index}>
                      <td>{formatearFecha(item.fecha)}</td>
                      <td>{item.nombreCuenta}</td>
                      <td>{item.debe}</td>
                      <td>{item.haber}</td>
                      <td>{item.saldo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
           </div>
        </div>
      </div>
  );
}

export default LibroMayor;
