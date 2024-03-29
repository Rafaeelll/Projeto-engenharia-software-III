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
import Typography from '@mui/material/Typography';
import FormTitle from '../../../components/ui/FormTitle';
import Button  from '@mui/material/Button';
import api from '../../../../services/api';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';

export default function PerfilForm() {
  const API_PATH = '/usuarios'
  const params = useParams()

  const navigate = useNavigate()

  const [state, setState] = React.useState({
    perfils: {
      nome: '',
      sobrenome: '',
      email: '',
      senha_acesso: '',
      telefone: '',
      plataforma_fav: '',
      data_nasc: '',
      jogo_fav: '',
      image: '',
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
  const [selectedFileName, setSelectedFileName] = React.useState('');
  const [selectedFile, setSelectedFile] = React.useState(null);

  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });

  function handleFileChange(event) {
    const file = event.target.files[0];
    setState({ ...state, perfils: { ...perfils, image: file } });
    setSelectedFile(URL.createObjectURL(file)); // Atualiza o URL da imagem
    setSelectedFileName(file.name); // Atualiza o nome do arquivo selecionado
  }

  function clearSelection() {
    setSelectedFile(null);
    setSelectedFileName('');
  }
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
    if(params.id) fetchData()
  }, [])

  async function fetchData() {
    setState({...state, showWaiting: true, errors:{}})
    try {
      // Verifica se params.id é definido antes de fazer a busca
      if (params.id) {
        const result = await myfetch.get(`${API_PATH}/${params.id}`);
        setState({
          ...state,
          perfils: result,
          showWaiting: false
        });
      } else {
        console.error('ID do perfil não definido.');
      }
    }
    catch(error) {
      console.error(error)
      setState({
        ...state, 
        showWaiting: false,
        errors: errorMessages,
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
      if (params.id) {
        const formData = new FormData()
        formData.append('nome', perfils.nome)
        formData.append('sobrenome', perfils.sobrenome)
        formData.append('email', perfils.email)
        formData.append('senha_acesso', perfils.senha_acesso)
        formData.append('telefone', perfils.telefone)
        formData.append('plataforma_fav', perfils.plataforma_fav)
        formData.append('data_nasc', perfils.data_nasc)
        formData.append('jogo_fav', perfils.jogo_fav)
        formData.append('image', perfils.image)
  
      const headers = {
        'headers':{
          'Content-Type': 'mulitpart/form-data'
        }
      }
      await api.put(`${API_PATH}/${params.id}`, formData, headers);

    }else {
      await api.post(API_PATH, perfils);
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
    <div
      style={{
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh',
        justifyContent: 'center',
        background: 'whitesmokesss'
      }}
      className="pai"
    >
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
          p: '12px',
          boxShadow: '0 5px 10px 0px rgba(0, 0, 0, 0.4)'
        }}
      >
        <FormTitle
          title="Editar perfil"
        /> 
        <Typography variant="h5" component="div">
        <form onSubmit={handleFormSubmit}>
          <TextField sx={{marginTop: '12px'}}
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

            <TextField sx={{marginTop: '12px'}}
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

            <TextField sx={{marginTop: '12px'}}
              label="email"
              type="email"
              variant='filled'
              fullWidth
              required
              name="email" // Nome do campo na tabela
              value={perfils.email} // Nome do campo na tabela
              onChange={handleFormFieldChange}
              error={errors?.email}
              helperText={errors?.email}
            />

            <TextField sx={{marginTop: '12px'}}
              label="Senha"
              type="password"
              variant='filled'
              fullWidth
              required
              name="senha_acesso" // Nome do campo na tabela
              value={perfils.senha_acesso} // Nome do campo na tabela
              onChange={handleFormFieldChange}
              error={errors?.senha_acesso}
              helperText={errors?.senha_acesso}
            />

          <TextField sx={{marginTop: '12px'}}
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

            <TextField sx={{marginTop: '12px'}}
              label='Data nascimento'
              color='secondary'
              type="date"
              name="data_nasc"
              fullWidth
              value={perfils.data_nasc}
              onChange={handleFormFieldChange}
            />

            <TextField sx={{marginTop: '12px'}}
              fullWidth
              name="plataforma_fav"
              variant='filled'
              type='name'
              label='Plataforma favorita'
              color="secondary"
              value={perfils.plataforma_fav}
              onChange={handleFormFieldChange}
              error={errors?.plataforma_fav}
              helperText={errors?.plataforma_fav}
            />

          <TextField sx={{marginTop: '12px'}}
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


            <div className="wrap-input2">
              <Button
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                startIcon={<CloudUploadIcon />}
              >
                {selectedFile && <img src={selectedFile} alt="Foto selecionada" style={{ marginRight: '8px', width: '24px'}} />}
                {selectedFileName ? selectedFileName : 'Adicione uma Foto de perfil'}
                {selectedFile && <CloseIcon onClick={clearSelection} style={{ marginLeft: '8px', cursor: 'pointer' }} />}
                <VisuallyHiddenInput
                  type="file"
                  onChange={handleFileChange}
                  name="image"
                />
              </Button>
            </div>

          <div className='agenda-form-btn' style={{display: 'flex', justifyContent: 'center'}}>
          <Button
              sx={{
                margin: '10px',
                padding: '5px 15px 5px 15px',
                border: 'none',
                background: 'black',
                fontFamily: 'monospace',
                fontWeight: 'bold',
                borderRadius: '5px',
                cursor: 'pointer',
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
                padding: '5px 15px 5px 15px',
                border: 'none',
                background: 'black',
                fontFamily: 'monospace',
                fontWeight: 'bold',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
              color="error"
              variant='contained'
              onClick={() => navigate('/perfil')}
            >
              Cancelar
            </Button>
          </div>       
        </form>
        </Typography>
      </Paper>
    </div>
  );
}