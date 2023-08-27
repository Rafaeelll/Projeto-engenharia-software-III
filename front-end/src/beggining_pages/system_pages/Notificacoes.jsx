import {useNavigate } from 'react-router-dom'
import PageTitle from '../../components/ui/PageTitle'
import  Button  from '@mui/material/Button'
import myfetch from '../../utils/myfetch'
import { useEffect } from 'react'
import { useState } from 'react'

export default function Notificacoes() {
  const nav = useNavigate();
  const [notificacoes, setNotificacoes] = useState([]);

  useEffect(() => {
    // Faça uma chamada usando myfetch para a rota do backend que recupera as notificações
    async function fetchNotificacoes() {
      try {
        const response = await myfetch.get('/notificacoes');

        // Atualize o estado com as notificações recebidas do backend
        setNotificacoes(response);
      } catch (error) {
        console.error(error);
      }
    }

    fetchNotificacoes();
  }, []);

  return (
    <>
      <PageTitle title="Suas Notificações" />
      <div>
        {notificacoes.map(notificacao => (
          <div key={notificacao.id}>
            <h3>{notificacao.mensagem}</h3>
            {/* Aqui você pode exibir outros detalhes da notificação */}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <Button color="secondary" variant="contained" onClick={() => nav(-1)}>
          Voltar
        </Button>
      </div>
    </>
  );
}




