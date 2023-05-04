import React from 'react'
import Typography from '@mui/material/Typography'
import myfetch from '../../utils/myfetch'

export default function PaginaInicial() {

  const [agendas, setAgendas] = React.useState([])

  async function fetchData() {
    try {
      const result = await myfetch.get('/agendas')
      setAgendas(result)
    }
    catch(error) {
      console.log(error)
    }
  }

  React.useEffect(() => {
    fetchData()
  }, [])

  return (
    <>
      <Typography variant="h3" component="h1" sx={{ textAlign: 'center' }}>
        Listagem de agendas
      </Typography>

      <div>{JSON.stringify(agendas)}</div>
    </>
  )
}