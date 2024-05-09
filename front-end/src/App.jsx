import {BrowserRouter, Route, Routes, Navigate} from 'react-router-dom'
import React from 'react';
import LandingPage from './pages/home/LandingPage';
import Login from './pages/login/register/Login';
import Register from './pages/login/register/Register';
import About from './pages/home/About';
import Contact from './pages/home/Contact';
import PaginaInicial from './pages/main_pages/PaginaInicial';
import CriarAgendas from './pages/main_pages/forms/AgendaForm';
import VerificarAgendas from './pages/main_pages/VerificarAgendas';
import SearchResult from './pages/main_pages/SearchResult'
import Perfil from './pages/main_pages/Perfil';
import PerfilForm from './pages/main_pages/forms/PerfilForm';
import Jogos from './pages/main_pages/Jogos'
import JogoForm from './pages/main_pages/forms/JogoForm';
import HistoricoJogos from './pages/main_pages/HistoricoJogos';
import HistoricoJogosForm from './pages/main_pages/forms/HistoricoJogosForm'
import Visualizacoes from './pages/main_pages/Visualizacoes';
import VisualizacaoForm from './pages/main_pages/forms/VisualizacaoForm';
import Notificacoes from './pages/main_pages/Notificacoes'
import NotiConfirmStart from './pages/main_pages/forms/NotiConfirmStart'
import NotiConfirmFinish from './pages/main_pages/forms/NotiConfirmFinish';
import MyAccountForm from './pages/main_pages/forms/MyAccountForm';
import PerfilImgForm from './pages/main_pages/forms/PerfilImgForm';
import MyAccountStatusForm from './pages/main_pages/forms/MyAccountStatusForm'
import Configuracao from './pages/main_pages/Configuracao';
import ConfigForm from './pages/main_pages/forms/ConfigForm';
import HeaderBar from './components/ui/HeaderBar';
import FooterBar from './components/ui/FooterBar';

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
          <Route path= "/agenda" element={<AuthGuard> <VerificarAgendas/> </AuthGuard>}/>
          <Route path= "/agendas/status" element={<AuthGuard> <VerificarAgendas/> </AuthGuard>}/>
          <Route path= "/resultado/:opcao/:id" element={<AuthGuard> <SearchResult/> </AuthGuard>}/>
          <Route path= "/agenda/new" element={<AuthGuard> <CriarAgendas/> </AuthGuard>}/>
          <Route path= "/agenda/:id" element={<AuthGuard> <CriarAgendas/> </AuthGuard>}/>
          <Route path= "/usuario" element={<AuthGuard> <Perfil/> </AuthGuard>}/>
          <Route path= "/usuario/profile/:id" element={<AuthGuard> <PerfilForm/> </AuthGuard>}/>
          <Route path= "/usuario/image/:id" element={<AuthGuard> <PerfilImgForm/> </AuthGuard>}/>
          <Route path= "usuario/account_status/:id" element={<AuthGuard> <MyAccountStatusForm onLoginLogout={onLoginLogout}/> </AuthGuard>}/>
          <Route path= "usuario/minha_conta/:id" element={<AuthGuard> <MyAccountForm/> </AuthGuard>}/>
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
          <Route path= "/notificacao/confirmar-presenca/:id" element={<AuthGuard> <NotiConfirmStart/> </AuthGuard>}/>
          <Route path= "/notificacao/confirmar-finalizacao/:id" element={<AuthGuard> <NotiConfirmFinish/> </AuthGuard>}/>
          <Route path= "/configuracao" element={<AuthGuard> <Configuracao/> </AuthGuard>}/>
          <Route path= "/configuracao/:id" element={<AuthGuard> <ConfigForm/> </AuthGuard>}/>
        </Routes>
      </BrowserRouter>
      <FooterBar/>
   </div>
  )
}

export default App
