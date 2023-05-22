import React from 'react'
import HeaderBar from '../../components/ui/HeaderBar';
import { Link, useNavigate } from 'react-router-dom'
import PageTitle from '../../components/ui/PageTitle';


export default function Agendas() {
  return (
    <div>
        <div>  
            <HeaderBar/>
        </div>
          <div> 
              <PageTitle title="Selecione uma das opções abaixo:"/>
              <div style={{margin: '0 auto', textAlign: 'center', marginTop: '200px'}}>
                <Link to = "/criar_agenda">
                  <button style={{
                    margin: '10px',
                    padding: '15px 30px 15px 30px',
                    border: 'none',
                    background: 'black',
                    color: 'white',
                    fontFamily: 'monospace',
                    fontWeight: 'bold',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '20px',
                    alignItems: 'center'

                    }}>
                    Criar agendas
                  </button>
                </Link>
                <Link to = "/verificar_agenda">
                  <button style={{
                    margin: '10px',
                    padding: '15px 30px 15px 30px',
                    border: 'none',
                    background: 'black',
                    color: 'white',
                    fontFamily: 'monospace',
                    fontWeight: 'bold',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '20px',
                    alignItems: 'center'
                    }}>
                    Verificar agendas
                  </button>
              </Link>
              </div>
          </div>
    </div>
  )
}
