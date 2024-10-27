import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import './Libros.css';

function LibroDiario() {
  const [userRole, setUserRole] = useState(''); 
  const [nombreUsuario, setNombreUsuario] = useState(null); 
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const [activeLink, setActiveLink] = useState(null);
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  const [previsualizacion, setPrevisualizacion] = useState([]);

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
    setFechaDesde('');
    setFechaHasta('');
    setPrevisualizacion([]);
  };

  const handlePrevisualizar = async () => {
    if (!fechaDesde || !fechaHasta) {
        setErrorMessage('Por favor, selecciona ambas fechas.');
        return;
    }
    if (new Date(fechaDesde) > new Date(fechaHasta)) {
        setErrorMessage('La fecha de inicio debe ser anterior o igual a la fecha de fin.');
        return;
    }

    setErrorMessage('');
    try {
        const url = `https://sistemacontableweb-enebcuhnc7gufggy.brazilsouth-01.azurewebsites.net/asientos/libro-diario?fechaInicio=${fechaDesde}&fechaFin=${fechaHasta}`;
        console.log(`URL de la solicitud: ${url}`);
        const response = await fetch(url);

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error de API:', errorData);
            throw new Error(`Error en la solicitud: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Datos obtenidos:", data);

        if (data.asientos && Array.isArray(data.asientos)) {
            const previsualizacionData = await Promise.all(data.asientos.map(async (asiento) => {
                const { id, fecha, descripcion, cuentaAsiento } = asiento;

                // Aquí puedes modificar para obtener el nombre de la cuenta
                const cuentasOrdenadas = cuentaAsiento.sort((a, b) => (b.debe - a.debe));

                // Mapear cada cuenta con su información respectiva
                return cuentasOrdenadas.map((cuenta) => ({
                    fecha,
                    numeroAsiento: id,
                    descripcion,
                    nombreCuenta: cuenta.nombreCuenta, // Asegúrate de que `nombre` sea el campo correcto
                    debe: cuenta.debe,
                    haber: cuenta.haber,
                }));
            })).then(res => res.flat());

            setPrevisualizacion(previsualizacionData);
        } else {
            setPrevisualizacion([]);
            setErrorMessage('Los datos recibidos no son válidos.');
        }
    } catch (error) {
        setPrevisualizacion([]);
        setErrorMessage(`Error al obtener el libro diario: ${error.message}`);
    }
};

const handleGenerar = () => {
    if (!Array.isArray(previsualizacion) || previsualizacion.length === 0) {
        setErrorMessage('No hay datos para generar el PDF.');
        return;
    }

    const doc = new jsPDF();
    doc.text("Libro Diario", 20, 20);

    const tableColumn = ["Fecha", "Número de Asiento", "Descripción", "Número de Cuenta", "Debe", "Haber"];
    const tableRows = previsualizacion.map(mov => [
        formatearFecha(mov.fecha), // Formatear la fecha
        mov.numeroAsiento,
        mov.descripcion,
        mov.cuentaNombre,
        mov.debe,
        mov.haber,
    ]);

    doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 30,
    });

    doc.save("libro-diario.pdf");
};

const formatearFecha = (fecha) => {
  const dateObj = new Date(fecha);
  const dia = String(dateObj.getUTCDate()).padStart(2, '0');
  const mes = String(dateObj.getUTCMonth() + 1).padStart(2, '0'); // Los meses son de 0 a 11
  const año = dateObj.getUTCFullYear();
  return `${dia}-${mes}-${año}`;
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
            {nombreUsuario === 'Administrador' ? (
              <div className="tabla-scroll">
                <a href="/#" onClick={() => handleNavigation('/menu')}>
                    <span className="material-icons">home</span>
                    <h3>Menu principal</h3>
                </a>
                <a href="/#" className={activeLink === 0 ? 'active clicked' : ''} onClick={() => handleNavigation('/gestiondeusuarios', 0)}>
                  <span className="material-icons">admin_panel_settings</span>
                  <h3>Gestionar Usuarios</h3>
                </a>
                <a href="/#" className={activeLink === 1 ? 'active clicked' : ''} onClick={() => handleNavigation('/gestiondeperfiles', 1)}>
                  <span className="material-icons">supervised_user_circle</span>
                  <h3>Gestionar Perfiles</h3>
                </a>
                <a href="/#" className={activeLink === 2 ? 'active clicked' : ''} onClick={() => handleNavigation('/gestiondecuentas', 2)}>
                  <span className="material-icons">book</span>
                  <h3>Gestionar Cuentas</h3>
                </a>
                <a href="/#" className={activeLink === 3 ? 'active clicked' : ''} onClick={() => handleNavigation('/asientocontable', 3)}>
                  <span className="material-icons">person_outline</span>
                  <h3>Gestionar Asientos</h3>
                </a>
                <a href="/#" className={activeLink === 4 ? 'active clicked' : ''} onClick={() => handleNavigation('/libro-diario', 4)}>
                  <span className="material-icons">receipt_long</span>
                  <h3>Libro Diario</h3>
                </a>
                <a href="/#" className={activeLink === 5 ? 'active clicked' : ''} onClick={() => handleNavigation('/libro-mayor', 5)}>
                  <span className="material-icons">menu_book</span>
                  <h3>Libro Mayor</h3>
                </a>
                <a href="/#" className={activeLink === 6 ? 'active clicked' : ''} onClick={() => handleNavigation('/', 6)}>
                  <span className="material-icons">logout</span>
                  <h3>Cerrar Sesión</h3>
                </a>
              </div>
            ) : (
              <div>
                <a href="/#" onClick={() => handleNavigation('/menu')}>
                    <span className="material-icons">home</span>
                    <h3>Menu principal</h3>
                </a>
                <a href="/#" className={activeLink === 0 ? 'active clicked' : ''} onClick={() => handleNavigation('/gestiondecuentas', 0)}>
                  <span className="material-icons">book</span>
                  <h3>Gestionar Cuentas</h3>
                </a>
                <a href="/#" className={activeLink === 1 ? 'active clicked' : ''} onClick={() => handleNavigation('/asientocontable', 1)}>
                  <span className="material-icons">person_outline</span>
                  <h3>Gestionar Asientos</h3>
                </a>
                <a href="/#" className={activeLink === 2 ? 'active clicked' : ''} onClick={() => handleNavigation('/libro-diario', 2)}>
                  <span className="material-icons">receipt_long</span>
                  <h3>Libro Diario</h3>
                </a>
                <a href="/#" className={activeLink === 3 ? 'active clicked' : ''} onClick={() => handleNavigation('/libro-mayor', 3)}>
                  <span className="material-icons">menu_book</span>
                  <h3>Libro Mayor</h3>
                </a>
                <a href="/#" className={activeLink === 4 ? 'active clicked' : ''} onClick={() => handleNavigation('/', 4)}>
                  <span className="material-icons">logout</span>
                  <h3>Cerrar Sesión</h3>
                </a>
              </div>
            )}
          </div>
        </aside>

        <div className='Libro'>
          <h1>Generar libro diario</h1>
          <div className="form-group">
            <label htmlFor="fechaDesde">Fecha Desde:</label>
            <input type="date" id="fechaDesde" value={fechaDesde} onChange={(e) => setFechaDesde(e.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="fechaHasta">Fecha Hasta:</label>
            <input type="date" id="fechaHasta" value={fechaHasta} onChange={(e) => setFechaHasta(e.target.value)} />
          </div>
          <div style={{ marginTop: '20px' }}>
            <div className="button-group">
            <button className="limpiar-btn" onClick={handleLimpiar}>Limpiar</button>
            <button className="download-button" onClick={handleGenerar}>
    <div className="docs">
      <svg
        viewBox="0 0 24 24"
        width="20"
        height="20"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="css-i6dzq1"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
        <polyline points="10 9 9 9 8 9"></polyline>
      </svg>
      Generar pdf
    </div>
    <div className="download">
      <svg
        viewBox="0 0 24 24"
        width="24"
        height="24"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="css-i6dzq1"
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="7 10 12 15 17 10"></polyline>
        <line x1="12" y1="15" x2="12" y2="3"></line>
      </svg>
    </div>
  </button>
              <button className="buscar" onClick={handlePrevisualizar}>Previsualizar</button>
            </div>
            </div>
           {errorMessage && <p className="error">{errorMessage}</p>}

          {previsualizacion.length > 0 && (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>N° de asiento</th>
                    <th>Descripción</th>
                    <th>Nombre de cuenta</th> {/* Cambiado de <tx> a <th> */}
                    <th>Debe</th>
                    <th>Haber</th>
                  </tr>
                </thead>
                <tbody>
                    {previsualizacion.map((mov, index) => (
                        <tr key={index}>
                            <td>{formatearFecha(mov.fecha)}</td>
                            <td>{mov.numeroAsiento}</td>
                            <td>{mov.descripcion}</td>
                            <td>{mov.nombreCuenta}</td> {/* Aquí se muestra el nombre de la cuenta */}
                            <td>{mov.debe}</td>
                            <td>{mov.haber}</td>
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

export default LibroDiario;
