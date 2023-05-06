import {BrowserRouter, Route, Routes, Navigate} from 'react-router-dom'
import LandingPage from './beggining_pages/LandingPage';
import Login from './beggining_pages/Login';
import Register from './beggining_pages/Register';
import About from './beggining_pages/About';
import Contact from './beggining_pages/Contact';
import PaginaInicial from './beggining_pages/system_pages/PaginaInicial';
import CriarAgendas from './beggining_pages/system_pages/CriarAgendas';
import Teste from './beggining_pages/system_pages/Teste';

function AuthGuard({children}) {
  // Estaremos autenticados se tivermos um token gravado no localStorage
  if(window.localStorage.getItem('token')) return children
  else return <Navigate to="/login" replace />
}

function App() {

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path ="/" element={<LandingPage/>} />
          <Route path= "/login" element={<Login/>}/>
          <Route path= "/cadastro" element={<Register/>}/>
          <Route path= "/sobre" element={<About/>}/>
          <Route path= "/contato" element={<Contact/>}/>
          <Route path= "/pagina_inicial" element={<AuthGuard> <PaginaInicial/> </AuthGuard>}/>
          <Route path= "/criar_agenda" element={<AuthGuard> <CriarAgendas/> </AuthGuard>}/>
          <Route path= "/test" element={<Teste/>}/>
        </Routes>
      </BrowserRouter>
      
    </div>
  )
}

export default App
