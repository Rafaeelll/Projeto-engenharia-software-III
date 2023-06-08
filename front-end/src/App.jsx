import {BrowserRouter, Route, Routes, Navigate} from 'react-router-dom'
import React from 'react';
import LandingPage from './beggining_pages/LandingPage';
import Login from './beggining_pages/Login';
import Register from './beggining_pages/Register';
import About from './beggining_pages/About';
import Contact from './beggining_pages/Contact';
import PaginaInicial from './beggining_pages/system_pages/PaginaInicial';
import CriarAgendas from './beggining_pages/system_pages/system_pages_forms/AgendaForm';
import Agendas from './beggining_pages/system_pages/Agendas'
import VerificarAgendas from './beggining_pages/system_pages/VerificarAgendas';
import Perfil from './beggining_pages/system_pages/Perfil';
import PerfilForm from './beggining_pages/system_pages/system_pages_forms/PerfilForm';
import Jogos from './beggining_pages/system_pages/system_pages_jogos/Jogos';
import JogoForm from './beggining_pages/system_pages/system_pages_forms/JogoForm';
import Configuracoes from './beggining_pages/system_pages/Configuracoes';
import HistoricoJogos from './beggining_pages/system_pages/system_pages_jogos/HistoricoJogos';
import HistoricoJogosForm from './beggining_pages/system_pages/system_pages_forms/HistoricoJogosForm'
import Visualizacoes from './beggining_pages/system_pages/Visualizacoes';
import VisualizacaoForm from './beggining_pages/system_pages/system_pages_forms/VisualizacaoForm';
import Notificacoes from './beggining_pages/system_pages/Notificacoes';
import HeaderBar from './components/ui/HeaderBar';


function App() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false)

  function AuthGuard({ children }) {
    // Estaremos autenticados se tivermos um token gravado no localStorage
    if (isLoggedIn) return (
      <>
        <HeaderBar isLoggedIn={isLoggedIn} onLoginLogout={onLoginLogout} />
        {children}
      </>
    );
    else return <Navigate to="/login" replace />;
  }
  

  function onLoginLogout(loggedIn) {
    setIsLoggedIn(loggedIn)
  }

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path ="/" element={<LandingPage/>} />
          <Route path= "/login" element={<Login onLoginLogout={onLoginLogout}/>}/>
          <Route path= "/cadastro" element={<Register/>}/>
          <Route path= "/sobre" element={<About/>}/>
          <Route path= "/contato" element={<Contact/>}/>
          <Route path= "/pagina_inicial" element={<AuthGuard> <PaginaInicial/> </AuthGuard>}/>
          <Route path= "/agenda" element={<AuthGuard> <Agendas/> </AuthGuard>}/>
          <Route path= "/criar_agenda" element={<AuthGuard> <CriarAgendas/> </AuthGuard>}/>
          <Route path= "/criar_agenda/:id" element={<AuthGuard> <CriarAgendas/> </AuthGuard>}/>
          <Route path= "/verificar_agenda" element={<AuthGuard> <VerificarAgendas/> </AuthGuard>}/>
          <Route path= "/perfil" element={<AuthGuard> <Perfil/> </AuthGuard>}/>
          <Route path= "/perfil/:id" element={<AuthGuard> <PerfilForm/> </AuthGuard>}/>
          <Route path= "/configuracao" element={<AuthGuard> <Configuracoes/> </AuthGuard>}/>
          <Route path= "/jogo" element={<AuthGuard> <Jogos/> </AuthGuard>}/>
          <Route path= "/jogo/new" element={<AuthGuard> <JogoForm/> </AuthGuard>}/>
          <Route path= "/jogo/:id" element={<AuthGuard> <JogoForm/> </AuthGuard>}/>
          <Route path= "/historico_jogo" element={<AuthGuard> <HistoricoJogos/> </AuthGuard>}/>
          <Route path= "/historico_jogo/new" element={<AuthGuard> <HistoricoJogosForm/> </AuthGuard>}/>
          <Route path= "/historico_jogo/:id" element={<AuthGuard> <HistoricoJogosForm/> </AuthGuard>}/>
          <Route path= "/visualizacao" element={<AuthGuard> <Visualizacoes/> </AuthGuard>}/>
          <Route path= "/visualizacao/new" element={<AuthGuard> <VisualizacaoForm/> </AuthGuard>}/>
          <Route path= "/visualizacao/:id" element={<AuthGuard> <VisualizacaoForm/> </AuthGuard>}/>
          <Route path= "/notificacao" element={<AuthGuard> <Notificacoes/> </AuthGuard>}/>
        </Routes>
      </BrowserRouter>
      
    </div>
  )
}

export default App
