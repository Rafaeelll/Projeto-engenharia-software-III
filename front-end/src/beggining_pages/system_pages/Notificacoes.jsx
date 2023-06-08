import React from 'react'
import {useNavigate } from 'react-router-dom'
import PageTitle from '../../components/ui/PageTitle'
import  Button  from '@mui/material/Button'

export default function Notificacoes() {
  const nav = useNavigate()

  return (
    <>
      <PageTitle title="Pagina a ser desenvolvida"/>
        <div style={{display: 'flex', justifyContent: 'center'}}>
          <Button color='secondary' variant='contained' onClick={() => nav(-1)}>
            Voltar
          </Button>
        </div>
    </>
  )
}
