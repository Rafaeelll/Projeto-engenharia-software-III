import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import myfetch from '../../../utils/myfetch';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Notification from '../../../components/ui/Notification';
import getValidationMessages from '../../../utils/getValidationMessages'
import Jogo from '../../../../models/Jogo'
import Paper from '@mui/material/Paper'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3'
import { ptBR } from 'date-fns/locale/pt-BR'
import { parseISO } from 'date-fns'
import FormTitle from '../../../components/ui/FormTitle';
import Button  from '@mui/material/Button';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';

export default function jogos() {
  const API_PATH = '/jogos';
  const params = useParams()

  const navigate = useNavigate();

  const [state, setState] = React.useState({
    jogos: {
      nome: '',
      plataforma_jogo: '',
      preco_jogo: '',
      categoria: '',
      data_aquisicao: null,
    },
    errors: {},
    showWaiting: false,
    notif: {
      show: false,
      message: '',
      severity: 'success' // ou 'error'
    }
  });
  const { jogos, errors, showWaiting, notif } = state;
  
  function handleFormFieldChange(event) {
    const { name, value } = event.target;
  
    let updatedValuePrice = value;
    if (name === 'preco_jogo') {
      // Remove qualquer caractere que não seja dígito
      const cleanedValue = value.replace(/\D/g, '');
      // Converte o valor para decimal
      const decimalValue = parseFloat(cleanedValue / 100).toFixed(2); // Divida por 100 para converter centavos para reais
      updatedValuePrice = decimalValue;
    }
    // Atualiza o valor do campo correspondente no objeto jogos
    const jogosCopy = { ...jogos, [name]: updatedValuePrice };
  
    // Atualiza o estado com o novo objeto jogosCopy
    setState({ ...state, jogos: jogosCopy });
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
    setState({...state, showWaiting: true, errors:{}})
    try {
      const result = await myfetch.get(`${API_PATH}/${params.id}`)
      if (result.data_aquisicao) {
        result.data_aquisicao = parseISO(result.data_aquisicao)
      }
      setState({
        ...state,
        jogos: result,
        showWaiting: false
      })
    }
    catch(error) {
      console.error(error)
      setState({
        ...state, 
        showWaiting: false,
        notif: {
          severity: 'error',
          show: true,
          message: 'ERRO: ' + error.message
        }
      })
    }
  }

  async function sendData() {
    setState({...state, showWaiting: true, errors: {}})
    try {
        // Chama a validação da biblioteca Joi
        await Jogo.validateAsync(jogos, { abortEarly: false })

        // Registro já existe: chama PUT para atualizar
        if (params.id) await myfetch.put(`${API_PATH}/${params.id}`, jogos)
        
        // Registro não existe: chama POST para criar
        else await myfetch.post(API_PATH, jogos)

        setState({
            ...state, 
            showWaiting: false,
            notif: {
                severity: 'success',
                show: true,
                message: 'Item salvo com sucesso'
            }
        })
    }
    catch(error) {
        const { validationError, errorMessages } = getValidationMessages(error)

        console.error(error)
        
        if (error.response && error.response.status === 409) {
            // Erro de validação personalizado
            setState({
                ...state, 
                showWaiting: false,
                errors: { nome: error.response.data.error }, // Defina o erro de validação para o campo 'nome'
                notif: {
                    severity: 'error',
                    show: true,
                    message: error.response.data.error // Exiba a mensagem de erro personalizada
                }
            })
        } else {
            // Outro erro interno do servidor
            setState({
                ...state, 
                showWaiting: false,
                errors: errorMessages,
                notif: {
                    severity: 'error',
                    show: !validationError,
                    message: 'ERRO: ' + error.message
                }
            })
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
        className="Jogo-container"
        sx={{
          width: '500px',
          background: 'whitesmoke',
          maxWidth: '90%',
          margin: '25px auto 0 auto',
          borderRadius: '5px',
          p: '5px 20px 5px 20px',
          boxShadow: '0 5px 10px 0px rgba(0, 0, 0, 0.4)'
        }}
      >
        <FormTitle
          title={params.id ? "Editar Jogo" : "Cadastrar jogos"} 
        /> 
        <form onSubmit={handleFormSubmit}>
          <TextField sx={{marginTop: '12px'}}
            id="standard-basic"
            color='secondary'
            label="Nome"
            variant='filled'
            type="name"
            required
            fullWidth
            name="nome"
            value={jogos.nome}
            onChange={handleFormFieldChange}
            error={errors?.nome}
            helperText={errors?.nome}
          />
         <Box sx={{ minWidth: 120, marginTop: '12px'}}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Categoria do Jogo</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={jogos.categoria}
                  label="Categoria Do Jogo"
                  name='categoria'
                  required
                  onChange={handleFormFieldChange}
              >
                <MenuItem value={'Ação e aventura'}>Ação e aventura</MenuItem>
                <MenuItem value={'Battle Royale'}>Battle Royale</MenuItem>
                <MenuItem value={'FPS'}>FPS</MenuItem>
                <MenuItem value={'Jogos Esportivos'}>Jogos Esportivos</MenuItem>
                <MenuItem value={'MMORPG'}>MMORPG</MenuItem>
                <MenuItem value={'MOBA'}>MOBA</MenuItem>
                <MenuItem value={'RPG'}>RPG (Role Playing Game)</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ minWidth: 120, marginTop: '12px'}}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Plataforma De Jogo</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={jogos.plataforma_jogo}
                  label="Plataforma De Jogo"
                  name='plataforma_jogo'
                  required
                  onChange={handleFormFieldChange}
              >
                <MenuItem value={'PC'}>PC</MenuItem>
                <MenuItem value={'Console Xbox'}>Console Xbox</MenuItem>
                <MenuItem value={'PlayStation'}>PlayStation</MenuItem>
                <MenuItem value={'Nintendo Switch'}>Nintendo Switch</MenuItem>
                <MenuItem value={'Dispositivo Móvel'}>Dispositivo Móvel</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <TextField sx={{marginTop: '12px'}}
            value={jogos.preco_jogo}
            label="Preço Do Jogo"
            name='preco_jogo'
            fullWidth
            required
            onChange={handleFormFieldChange}
            InputProps={{
              startAdornment: <InputAdornment position="start">R$</InputAdornment>
            }}
          />

          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
            <DatePicker sx={{marginTop: '12px'}}
              label='Data de aquisição'
              value={jogos.data_aquisicao}
              onChange={value => handleFormFieldChange({
                target: {name:'data_aquisicao', value}
              })}
              slotProps={{
                textField:{
                  variant:'outlined',
                  fullWidth: true,
                  required: true
                }
              }}
            />
          </LocalizationProvider>
          
          
          <div className='jogo-form-btn' style={{display: 'flex', justifyContent: 'center'}}>
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