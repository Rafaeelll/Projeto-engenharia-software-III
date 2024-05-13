import React from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import myfetch from '../../../utils/myfetch';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Notification from '../../../components/ui/Notification';
import getValidationMessages from '../../../utils/getValidationMessages'
import Perfil from '../../../../models/Perfil';
import Paper  from '@mui/material/Paper';
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



export default function PerfilForm() {
  const API_PATH_US = '/usuarios'
  const API_PATH_PF =  '/usuarios/profile'
  const { id } = useParams(); // Capturando o ID da URL
  const navigate = useNavigate()

  const [state, setState] = React.useState({
    perfils: {
      nome: '',
      sobrenome: '',
      telefone: '',
      plataforma_fav: '',
      data_nasc: null,
      jogo_fav: '',
    },
    errors: {},
    showWaiting: false,
    notif: {
      show: false,
      message: '',
      severity: 'success' // ou 'error'
    }
  });
  const { perfils, errors, showWaiting, notif } = state;

  function handleFormFieldChange(event) {
    const { name, value } = event.target;

    let updatedValueTel = value;
    if (name === 'telefone') {
    // Remove qualquer caractere que não seja dígito
    const cleanedValue = value.replace(/\D/g, '');
    // Formata o valor
    const formattedValue = cleanedValue.replace(
      /(\d{2})(\d{4,5})(\d{4})/,
      '($1) $2-$3'
    )
    updatedValueTel = formattedValue
    }
    // Atualiza o valor do campo correspondente no objeto perfils
    const perfilsCopy = { ...perfils, [name]: updatedValueTel };
  
    // Atualiza o estado com o novo objeto perfilsCopy
    setState({ ...state, perfils: perfilsCopy });
  }
  
  function handleFormSubmit(event) {
    event.preventDefault(); // Evita que a página seja recarregada

    // Envia os dados para o back-end
    sendData();
  }
    React.useEffect(() => {
    // Se houver parâmetro id na rota, devemos carregar um registro
    // existente para edição
    if(id) fetchData()
  }, [])

  async function fetchData() {
    setState({...state, showWaiting: true, errors:{}})
    try {
        const result = await myfetch.get(`${API_PATH_US}/${id}`);
        if (result.data_nasc) {
          result.data_nasc = parseISO(result.data_nasc);
        }
        setState({
          ...state,
          perfils: result,
          showWaiting: false
        });

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
    setState({ ...state, showWaiting: true, errors: {} });
    try {
      console.log('Dados a serem enviados:', perfils); // Adicione este console.log

      await Perfil.validateAsync(perfils, { abortEarly: false });
      if (id) {
        await myfetch.put(`${API_PATH_PF}/${id}`, perfils);
  
      } else {
        await myfetch.post(API_PATH_PF, perfils);
      }
      setState({
        ...state,
        showWaiting: false,
        notif: {
          severity: 'success',
          show: true,
          message: 'Item salvo com sucesso'
        }
      });
      } catch (error) {
        const { validationError, errorMessages } = getValidationMessages(error);

        console.error(error);

        setState({
          ...state,
          showWaiting: false,
          errors: errorMessages,
          notif: {
            severity: 'error',
            show: !validationError,
            message: 'ERRO: ' + error.message
          }
        });
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
        className="Perfil-container"
        sx={{
          width: '512px',
          background: 'whitesmoke',
          maxWidth: '90%',
          margin: '25px auto 0 auto',
          borderRadius: '5px',
          p: '5px 20px 5px 20px',
          boxShadow: '0 5px 10px 0px rgba(0, 0, 0, 0.4)'
        }}
      >
        <FormTitle
          title="Editar perfil"
        /> 
        <form onSubmit={handleFormSubmit}>
          <TextField
            id="standard-basic"
            label="Nome"
            type="name"
            variant='filled'
            color='secondary'
            required
            fullWidth
            name="nome"
            value={perfils.nome}
            onChange={handleFormFieldChange}
            error={errors?.nome}
            helperText={errors?.nome}
            />

            <TextField sx={{marginTop: '15px'}}
              label="Sobrenome"
              type="name"
              variant='filled'
              fullWidth
              required
              name="sobrenome" // Nome do campo na tabela
              value={perfils.sobrenome} // Nome do campo na tabela
              onChange={handleFormFieldChange}
              error={errors?.sobrenome}
              helperText={errors?.sobrenome}
            />

            <TextField sx={{marginTop: '15px'}}
              variant='filled'
              label='Telefone'
              type="tel"
              fullWidth
              required
              name='telefone'
              error={errors?.telefone}
              helperText={errors?.telefone}
              value={perfils.telefone}
              inputProps={{
                maxLength: 15,
                pattern: '\\([0-9]{2}\\) [0-9]{4,5}-[0-9]{4}',
                onChange: handleFormFieldChange,
              }}
            />

            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
              <DatePicker sx={{marginTop: '12px'}}
                label='Data de aquisição'
                value={perfils.data_nasc}
                onChange={value => handleFormFieldChange({
                  target: {name:'data_nasc', value}
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

            <Box sx={{ minWidth: 120, marginTop: '15px'}}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Plataforma Favorita</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={perfils.plataforma_fav}
                    label="Plataforma Favorita"
                    name='plataforma_fav'
                    required
                    onChange={handleFormFieldChange}
                >
                  <MenuItem value={'Facebook'}>Facebook</MenuItem>
                  <MenuItem value={'Kick'}>Kick</MenuItem>
                  <MenuItem value={'Twitch'}>Twitch</MenuItem>
                  <MenuItem value={'Youtube'}>Youtube</MenuItem>
                  <MenuItem value={'Outros'}>Outros</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <TextField sx={{marginTop: '15px'}}
              label='Jogo Favorito'
              type="name"
              fullWidth
              name="jogo_fav"
              variant='filled'
              color="secondary"
              value={perfils.jogo_fav}
              onChange={handleFormFieldChange}
              error={errors?.jogo_fav}
              helperText={errors?.jogo_fav}
            />


          <div style={{display: 'flex', justifyContent: 'center'}}>
            <Button
              sx={{m: '10px', mt: '20px', background: 'black'}}
              color="secondary"
              variant='contained'
              type="submit"
            > 
              Salvar
            </Button>

            <Button
              sx={{m: '10px', mt: '20px', background: 'black'}}
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