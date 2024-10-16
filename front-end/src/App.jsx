import {BrowserRouter, Route, Routes, Navigate, useLocation} from 'react-router-dom'
import React from 'react';
import LandingPage from './pages/home/LandingPage';
import Login from './pages/login/register/Login';
import Register from './pages/login/register/Register';
import EsqueciSenha from './pages/login/esqueci_senha/EsqueciSenha';
import RecuperarSenha from './pages/login/recuper_senha/RecuperarSenha';
import ConfirmarCadastro from './pages/login/confirmar_cadastro/ConfirmarCadastro';
import About from './pages/home/About';
import Contact from './pages/home/Contact';
import PaginaInicial from './pages/main_pages/PaginaInicial';
import CriarAgendas from './pages/main_pages/forms/AgendaForm';
import AgendaConfirmarPresenca from './pages/main_pages/forms/AgendaConfirmarPresenca';
import AgendaConfirmarFinalizacao from './pages/main_pages/forms/AgendaConfirmarFinalizacao';
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
import MyAccountForm from './pages/main_pages/forms/MyAccountForm';
import PerfilImgForm from './pages/main_pages/forms/PerfilImgForm';
import MyAccountStatusForm from './pages/main_pages/forms/MyAccountStatusForm'
import Configuracao from './pages/main_pages/Configuracao';
import FilterAgendasStatusResult from './pages/main_pages/FilterAgendasStatusResult';
import ConfigForm from './pages/main_pages/forms/ConfigForm';
import HeaderBar from './components/ui/HeaderBar';
import FooterBar from './components/ui/FooterBar';



function App() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false)
  const [hasInteracted, setHasInteracted] = React.useState(false); // Verifica se o usuário já interagiu

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


  // Detecta a primeira interação do usuário
  React.useEffect(() => {
    const handleUserInteraction = () => {
      setHasInteracted(true); // Marca como interagido
      window.removeEventListener('click', handleUserInteraction); // Remove listener após a primeira interação
    };

    window.addEventListener('click', handleUserInteraction);

    return () => {
      window.removeEventListener('click', handleUserInteraction);
    };
  }, []);


  return (
    <div className="App">
      <BrowserRouter>
        <NavigationWatcher hasInteracted={hasInteracted} /> {/* Adiciona o componente de navegação */}
          <Routes>
            <Route path ="/" element={<LandingPage/>} />
            <Route path= "/login" element={<Login onLoginLogout={onLoginLogout}/>}/>
            <Route path= "/cadastro" element={<Register/>}/>
            <Route path= "/sobre" element={<About/>}/>
            <Route path= "/contato" element={<Contact/>}/>
            <Route path= "/esqueci_senha" element={<EsqueciSenha/>}/>
            <Route path= "/recuperar_senha" element={<RecuperarSenha/>}/>
            <Route path= "/confirmar_cadastro" element={<ConfirmarCadastro/>}/>
            <Route path= "/pagina_inicial" element={<AuthGuard> <PaginaInicial/> </AuthGuard>}/>
            <Route path= "/agenda" element={<AuthGuard> <VerificarAgendas/> </AuthGuard>}/>
            <Route path= "/resultado/:opcao/:id" element={<AuthGuard> <SearchResult/> </AuthGuard>}/>
            <Route path= "/agenda/:statusOption" element={<AuthGuard> <FilterAgendasStatusResult/> </AuthGuard>}/>
            <Route path= "/agenda/new" element={<AuthGuard> <CriarAgendas/> </AuthGuard>}/>
            <Route path= "/agenda/editar/:id" element={<AuthGuard> <CriarAgendas/> </AuthGuard>}/>
            <Route path= "/agenda/confirmar-presenca/:id" element={<AuthGuard> <AgendaConfirmarPresenca/> </AuthGuard>}/>
            <Route path= "/agenda/confirmar-finalizacao/:id" element={<AuthGuard> <AgendaConfirmarFinalizacao/> </AuthGuard>}/>
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
            <Route path= "/configuracao" element={<AuthGuard> <Configuracao/> </AuthGuard>}/>
            <Route path= "/configuracao/:id" element={<AuthGuard> <ConfigForm/> </AuthGuard>}/>
          </Routes>
      </BrowserRouter>
      <FooterBar/>
   </div>
  )
}

// Novo componente para observar navegações e tocar o som
function NavigationWatcher({ hasInteracted }) {
  const location = useLocation(); // useLocation está dentro do contexto do Router

  // Função para tocar o som do alarme
  const playAlarmSound = () => {
    if (hasInteracted) {
      const alarmSound = new Audio('/nav-sound2.wav');
      alarmSound.play().catch(error => {
        console.log('Som bloqueado pelo navegador:', error);
      });
    }
  };

  React.useEffect(() => {
    playAlarmSound();
  }, [location.pathname]); // O som será tocado sempre que o caminho mudar

  return null; // Este componente não precisa renderizar nada
}

export default App
