import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import myfetch from '../../../utils/myfetch';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Notification from '../../../components/ui/Notification';
import getValidationMessages from '../../../utils/getValidationMessages'
import HistoricoJogo from '../../../../models/HistoricoJogo'
import Paper from '@mui/material/Paper'
import Typography  from '@mui/material/Typography';
import FormTitle from '../../../components/ui/FormTitle';
import Button  from '@mui/material/Button';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Box from '@mui/material/Box';




export default function HistoricoJogosForm() {
  const API_PATH = '/historico_jogos';
  const params = useParams()
  const navigate = useNavigate();

  const [showWaiting, setShowWaiting] = React.useState(false)
  const [jogoName, setJogoName] = React.useState('')
  const [loadingJogoName, setLoadingJogoName] = React.useState(false);

  const [state, setState] = React.useState({
    historicoJogos: {
      jogo_id: '',
      nivel: '',
      jogo_status: '',
      avaliacao: 1,
      comentario_usuario: '',
    },
    errors: {},
    notif: {
      show: false,
      message: '',
      severity: 'success' // ou 'error'
    }
  });
  const { historicoJogos, errors, notif} = state;
  
  
  function handleFormFieldChange(event) {
    const historicoJogosCopy = {...historicoJogos}
    historicoJogosCopy[event.target.name] = event.target.value
    setState({...state, historicoJogos: historicoJogosCopy})

    if (event.target.name === 'jogo_id') {
      fetchJogoName(event.target.value);
    }
  }

  async function fetchJogoName(jogoId) {
    if (!jogoId) {
      setJogoName('');
      return;
    }
  
    setLoadingJogoName(true);
    try {
      const result = await myfetch.get(`/jogos/${jogoId}`);
      setJogoName(result.nome);
    } catch (error) {
      console.error(error);
      setJogoName('O jogo não foi encontrado, informe um ID valído!');
    } finally {
      setLoadingJogoName(false);
    }
  }
  
  
  function handleFormSubmit(event) {
    event.preventDefault(); // Evita que a página seja recarregada

    // Envia os dados para o back-end
    sendData();
  }
    React.useEffect(() => {
    // Se houver parâmetro id na rota, devemos carregar um registro
    // existente para edição
    if(params.id) fetchData()
  }, [])

  async function fetchData() {
    setState({...state, errors:{}})
    setShowWaiting(true)// Define o estado como true quando a busca começar
    try {
      const result = await myfetch.get(`${API_PATH}/${params.id}`)
      setState({
        ...state,
        historicoJogos: result,
      })

      if (result.jogo_id) {
        await fetchJogoName(result.jogo_id);
      }
      setShowWaiting(false)

    }
    catch(error) {
      console.error(error)
      setState({
        ...state, 
        errors: errorMessages,
        notif: {
          severity: 'error',
          show: true,
          message: 'ERRO: ' + error.message
        }
      })
      setShowWaiting(false)
    }
  }

  async function sendData() {
    setState({...state, errors: {}})
    setShowWaiting(true)// Define o estado como true quando a busca começar

    try {
      // Chama a validação da biblioteca Joi
      await HistoricoJogo.validateAsync(historicoJogos, { abortEarly: false })

      const jogoExists = await verifyJogoExists(historicoJogos.jogo_id);
        if (!jogoExists) {
          setState({
            ...state,
            notif: {
              severity: 'error',
              show: true,
              message: 'ID do jogo não encontrado! Crie um jogo ou informe um ID válido.',
            },
          });
          setShowWaiting(false)
          return;
        }
      // Chama a validação da biblioteca Joi

      // Registro já existe: chama PUT para atualizar
      if (params.id) await myfetch.put(`${API_PATH}/${params.id}`, historicoJogos)
      
      // Registro não existe: chama POST para criar
      else await myfetch.post(API_PATH, historicoJogos)

      setState({
        ...state, 
        notif: {
          severity: 'success',
          show: true,
          message: 'Item salvo com sucesso'
        }
      })
      setShowWaiting(false)

    }
    catch(error) {
      const { validationError, errorMessages } = getValidationMessages(error)

      console.error(error)
      
      setState({
        ...state, 
        errors: errorMessages,
        notif: {
          severity: 'error',
          show: !validationError,
          message: 'ERRO: ' + error.message
        }
      })
      setShowWaiting(false)
    }
    async function verifyJogoExists(jogoId) {
      try {
        const result = await myfetch.get(`/jogos/${jogoId}`);
        return !!result; // Retorna true se o jogo for encontrado, senão retorna false
      } catch (error) {
        return false; // Retorna false em caso de erro
      }
    }
  }

  function handleNotifClose(event, reason) {
    if (reason === 'clickaway') {
      return;
    }
    // Se o item foi salvo com sucesso, retorna à página de listagem
    if (notif.severity === 'success') navigate(-1);
    setState({ ...state, notif: { ...notif, show: false } });
  }

  return (
    <>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={showWaiting}
      >
        <CircularProgress sx={{margin: '5px'}} color="secondary" />
        Por favor, aguarde.
      </Backdrop>

      <Notification show={notif.show} severity={notif.severity} onClose={handleNotifClose}>
        {notif.message}
      </Notification>

      <Paper
        className="HistoricoJogo-container"
        sx={{
          width: '500px',
          maxWidth: '90%',
          background: 'whitesmoke',
          margin: '25px auto 0 auto',
          borderRadius: '5px',
          p: '5px 20px 5px 20px',
          boxShadow: '0 5px 10px 0px rgba(0, 0, 0, 0.4)'
        }}
      >
        <FormTitle
          title={params.id ? "Editar Historico de Jogos" : "Criar histórico de jogos"} 
        /> 
        <form onSubmit={handleFormSubmit}>
          <Box sx={{ minWidth: 120, marginTop: '12px' }}>
            <TextField
              id="standard-basic"
              label="ID Jogo"
              type="number"
              variant="outlined"
              color="secondary"
              required
              fullWidth
              name="jogo_id"
              value={historicoJogos.jogo_id}
              onChange={handleFormFieldChange}
              error={errors?.jogo_id}
              helperText={errors?.jogo_id}
            />
          </Box>

          <Box sx={{ minWidth: 120, marginTop: '12px', position: 'relative' }}>
            <TextField
              id="standard-basic"
              label="Nome do Jogo"
              type="text"
              variant="outlined"
              color="secondary"
              fullWidth
              value={jogoName}
              InputProps={{
                disabled: true,
              }}
            />
            {loadingJogoName && (
              <CircularProgress
                size={24}
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  marginTop: '-12px',
                  marginLeft: '-12px',
                }}
              />
            )}
          </Box>

          <TextField sx={{marginTop: '12px'}}
            fullWidth
            name="nivel"
            variant='filled'
            type='number'
            required
            label='Nível'
            color="secondary"
            value={historicoJogos.nivel}
            onChange={handleFormFieldChange}
            error={errors?.nivel}
            helperText={errors?.nivel}
          />
          <FormControl color='secondary' sx={{marginTop: '12px'}}>
            <FormLabel id="demo-radio-buttons-group-label" required>Status do Jogo:</FormLabel>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              row
              name="jogo_status"
              value={historicoJogos.jogo_status}
              onChange={handleFormFieldChange}
            >
              <FormControlLabel value="Não iniciado" control={<Radio />} label="Não iniciado" />
              <FormControlLabel value="Em progresso"control={<Radio />} label="Em progresso" />
              <FormControlLabel value="Concluído"control={<Radio />} label="Concluído" />

            </RadioGroup>
          </FormControl>

          <Stack style={{marginTop: '12px'}}>
            <Typography variant='h6'> Avalie o jogo de 1 a 5: </Typography>
            <Rating 
              name="avaliacao" 
              defaultValue={1} 
              precision={1}
              value={historicoJogos.avaliacao}
              onChange={handleFormFieldChange}
              />
          </Stack>

          <TextField style={{marginTop: '25px'}}
            fullWidth
            name="comentario_usuario"
            variant='outlined'
            type='text'
            label='Comentário'
            color="primary"
            value={historicoJogos.comentario_usuario}
            onChange={handleFormFieldChange}
            >
          </TextField>

          <div className='historico-jogo-form-btn' style={{display: 'flex', justifyContent: 'center'}}>
            <Button
              sx={{
                margin: '10px',
                background: 'black',
                fontWeight: 'bold',
              }}
              color="secondary"
              variant='contained'
              type="submit"
            > 
              Salvar
            </Button>

            <Button
              sx={{
                margin: '10px',
                background: 'black',
                fontWeight: 'bold',
              }}
              color="error"
              variant='contained'
              onClick={() => navigate(-1)}
            >
              Cancelar
            </Button>
          </div>       
        </form>
      </Paper>
    </>
  );
}