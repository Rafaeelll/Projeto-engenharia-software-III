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
              <Link to = "/criar_agenda">
                <button style={{margin: '5px'}}>
                  Criar agendas
                </button>
              </Link>
              <Link to = "/verificar_agenda">
                <button>
                  Verificar agendas
                </button>
              </Link>


            </div>


    </div>
  )
}
