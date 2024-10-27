import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import MenuPrincipal from './components/MenuPrincipal';
import AsientoContable from './components/AsientoContable';
import GestionDeCuentas from './components/GestionDeCuentas';
import LibroDiario from './components/LibroDiario';
import LibroMayor from './components/LibroMayor';
import RegistrarCuentas from './components/RegistrarCuenta';
import EditarCuenta from './components/EditarCuenta';
import EliminarCuenta from './components/EliminarCuenta';
import GestionDeUsuarios from './components/GestionDeUsuarios';
import RegistrarUsuario from './components/RegistarUsuario';
import EliminarUsuario from'./components/EliminarUsuario';
import GestionarPerfiles from './components/GestionarPerfiles';
import PlanDeCuentas from './components/PlanDeCuentas';


function App() {
  return (
      <Router>
        <div>
          <h1>Sistema contable</h1>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/menu" element={<MenuPrincipal />} />
            <Route path="/asientocontable" element={<AsientoContable />} />
            <Route path="/gestiondecuentas" element={<GestionDeCuentas />} />
            <Route path="/libro-diario" element={<LibroDiario />} />
            <Route path="/libro-mayor" element={<LibroMayor />} />
            <Route path="/plandecuentas" element={<PlanDeCuentas/>}/>
            <Route path="/registrarcuenta" element={<RegistrarCuentas/>}/>
            <Route path="/editarcuenta" element={<EditarCuenta/>}/>
            <Route path="/eliminarcuenta" element={<EliminarCuenta/>}/>
            <Route path="/gestiondeusuarios" element={<GestionDeUsuarios/>}/>
            <Route path="/registrarusuario" element={<RegistrarUsuario/>}/>
            <Route path="/eliminarusuario" element={<EliminarUsuario/>}/>
            <Route path="/gestiondeperfiles" element={<GestionarPerfiles/>}/>
          </Routes>
        </div>
      </Router> 
  );
}

export default App;
