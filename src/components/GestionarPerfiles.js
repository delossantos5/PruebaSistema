import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './GestionDeUsuarios.css';
import { Helmet } from 'react-helmet';

function GestionarPerfiles() {
    const [activeLink, setActiveLink] = useState(0);
    const navigate = useNavigate();
    const [perfiles, setPerfiles] = useState([]);
    const [tareas, setTareas] = useState([]);
    const [resultado, setResultado] = useState('');

    useEffect(() => {
        const obtenerPerfilesYTareas = async () => {
            try {
                const responsePerfiles = await fetch('https://sistemacontableweb-enebcuhnc7gufggy.brazilsouth-01.azurewebsites.net/perfiles');
                if (!responsePerfiles.ok) throw new Error('Error al obtener perfiles');
                
                const dataPerfiles = await responsePerfiles.json();
                console.log('Perfiles obtenidos:', dataPerfiles);
                setPerfiles(Array.isArray(dataPerfiles) ? dataPerfiles : []);
                
                const responseTareas = await fetch('https://sistemacontableweb-enebcuhnc7gufggy.brazilsouth-01.azurewebsites.net/tareas');
                if (!responseTareas.ok) throw new Error('Error al obtener tareas');

                const dataTareas = await responseTareas.json();
                console.log('Tareas obtenidas:', dataTareas);
                setTareas(Array.isArray(dataTareas) ? dataTareas : []);
            } catch (error) {
                console.error('Error al obtener perfiles y tareas:', error);
                setResultado('No se pudo cargar la información.');
            }
        };

        obtenerPerfilesYTareas();
    }, []);

    const asignarTareas = async (perfilId, nuevasTareas) => {
        try {
            const response = await fetch(`https://sistemacontableweb-enebcuhnc7gufggy.brazilsouth-01.azurewebsites.net/perfiles/${perfilId}/tareas`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(nuevasTareas),
            });

            if (response.ok) {
                setResultado('Tareas asignadas correctamente.');
                setPerfiles(prevPerfiles =>
                    prevPerfiles.map(perfil =>
                        perfil.id === perfilId ? { ...perfil, tareas: nuevasTareas } : perfil
                    )
                );
            } else {
                setResultado('Error al asignar las tareas.');
            }
        } catch (error) {
            console.error('Error al asignar tareas:', error);
            setResultado('Error en la asignación.');
        }
    };

    const handleNavigation = (path, index) => {
        setActiveLink(index);
        navigate(path);
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
                        <div className="tabla-scroll">
                            <a href="/#" onClick={() => handleNavigation('/menu')}>
                                <span className="material-icons">home</span>
                                <h3>Menu principal</h3>
                            </a>
                            <a href="/#" onClick={() => navigate('/gestiondeusuarios')}>
                                <span className="material-icons">admin_panel_settings</span>
                                <h3>Gestionar Usuarios</h3>
                            </a>
                            <a href="/#" className="active clicked" onClick={() => navigate('/gestiondeperfiles')}>
                                <span className="material-icons">supervised_user_circle</span>
                                <h3>Gestionar Perfiles</h3>
                            </a>
                            <a href="/#" className={activeLink === 1 ? 'active clicked' : ''} onClick={() => handleNavigation('/gestiondecuentas', 1)}>
                                <span className="material-icons">book</span>
                                <h3>Gestionar cuentas</h3>
                            </a>
                            <a href="/#" className={activeLink === 2 ? 'active clicked' : ''} onClick={() => handleNavigation('/asientocontable', 2)}>
                                <span className="material-icons">person_outline</span>
                                <h3>Gestionar asientos</h3>
                            </a>
                            <a href="/#" className={activeLink === 3 ? 'active clicked' : ''} onClick={() => handleNavigation('/libro-diario', 3)}>
                                <span className="material-icons">receipt_long</span>
                                <h3>Libro diario</h3>
                            </a>
                            <a href="/#" className={activeLink === 4 ? 'active clicked' : ''} onClick={() => handleNavigation('/libro-mayor', 4)}>
                                <span className="material-icons">menu_book</span>
                                <h3>Libro mayor</h3>
                            </a>
                            <a href="/#" className={activeLink === 5 ? 'active clicked' : ''} onClick={() => handleNavigation('/', 5)}>
                                <span className="material-icons">logout</span>
                                <h3>Cerrar Sesión</h3>
                            </a>
                        </div>
                    </div>
                </aside>

                {/* Contenedor principal */}
                <div className="Hola">
                    <h1>Gestionar Perfiles de Usuarios</h1>
                    <p>{resultado}</p>
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre Perfil</th>
                                <th>Asignar Nuevas Tareas</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(perfiles) && perfiles.length > 0 ? (
                                perfiles.map((perfil) => (
                                    <tr key={perfil.id}>
                                        <td>{perfil.id}</td>
                                        <td>{perfil.nombre}</td>
                                        <td>
                                            <select
                                                value={perfil.tareas || []}
                                                onChange={(e) => asignarTareas(perfil.id, Array.from(e.target.selectedOptions, option => option.value))}
                                                multiple
                                            >
                                                {tareas.map((tarea) => (
                                                    <option
                                                        key={tarea.id} // Asegúrate de usar tarea.id
                                                        value={tarea.id} // Asegúrate de usar tarea.id
                                                        selected={perfil.tareas && perfil.tareas.includes(tarea.id)} // Comparar correctamente
                                                    >
                                                        {tarea.nombre} // Asegúrate de usar tarea.nombre
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3">No hay perfiles disponibles.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default GestionarPerfiles;
