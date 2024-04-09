import React from 'react'
import Paper from '@mui/material/Paper'
import {useNavigate, useParams} from 'react-router-dom'
import api from '../../../../services/api'
import CircularProgress from '@mui/material/CircularProgress';
import Notification from '../../../components/ui/Notification';
import FormTitle from '../../../components/ui/FormTitle';
import Button  from '@mui/material/Button';
import Backdrop from '@mui/material/Backdrop';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';
import TextField from '@mui/material/TextField';
import Avatar from '@mui/material/Avatar'
import ConfirmImgPreviewDialog from '../../../components/ui/ConfirmImgPreviewDialog'
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';



export default function PerfilImgForm() {

  const API_PATH_US = '/usuarios'
  const API_PATH_IMG = '/usuarios/image'
  const navigate = useNavigate()
  const { id } = useParams(); // Capturando o ID da URL

  const [selectedFileName, setSelectedFileName] = React.useState('');
  const [selectedFile, setSelectedFile] = React.useState(null);
  const [showDialog, setShowDialog] = React.useState(false);

  const [state, setState] = React.useState({
    userProfile:{
      nome: '',
      sobrenome: '',
      image: '',
    },
    showWaiting: false,
    notif:{
      show: false,
      message: '',
      severity: 'success' // ou 'error'
    }
  })

  const {
    userProfile,
    notif,
    showWaiting
  } = state

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

  const handleImagePreviewClick = () => {
    setShowDialog(true);
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
  };

  function handleFileChange(event) {
    const file = event.target.files[0];
    setState({ ...state, userProfile: { ...userProfile, image: file } });
    setSelectedFile(URL.createObjectURL(file)); // Atualiza o URL da imagem
    setSelectedFileName(file.name); // Atualiza o nome do arquivo selecionado
  }

  function clearSelection() {
    setSelectedFile(null);
    setSelectedFileName('');
  }

  function handleFormSubmit(event) {
    event.preventDefault()    // Evita que a página seja recarregada
    // Envia os dados para o back-end
    sendData()
  }
  React.useEffect(() => {
    // Se houver parâmetro id na rota, devemos carregar um registro
    // existente para edição
    if(id) fetchData()
  }, [])


  async function fetchData() {
    setState({...state, showWaiting: true})
    try {
      // Verifica se params.id é definido antes de fazer a busca
      if (id) {
        const result = await api.get(`${API_PATH_US}/${id}`);
        setState({
          ...state,
          userProfile: result,
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
        notif: {
          severity: 'error',
          show: true,
          message: 'ERRO: ' + error.message
        }
      })
    }
  }

  async function sendData() {
    setState({ ...state, showWaiting: true});
    try {
      // Chama a validação da biblioteca Joi
      console.log('Dados a serem enviados:', userProfile); // Adicione este console.log
      if (id) {
      const formData = new FormData()
      formData.append('image', userProfile.image)
  
      const headers = {
        'headers':{
          'Content-Type': 'mulitpart/form-data'
        }
      }
      await api.put(`${API_PATH_IMG}/${id}`, formData, headers);

    } else {
      await api.post(API_PATH_IMG, userProfile);
    }
      // DAR FEEDBACK POSITIVO
      setState({
        ...state,
        showWaiting: false,
        notif: {
          severity: 'success',
          show: true,
          message: 'Item salvo com sucesso'
        },
      });
    } catch (error) {  
      console.error(error);
      // Erro de validação ou outro erro
      setState({
        ...state,
        showWaiting: false,
        notif: {
          severity: 'error',
          show: true,
          message: 'ERRO: ' + error.message,
        },
      }); 
    }
  }

  function handleNotifClose(event, reason) {
    if (reason === 'clickaway') {
      return;
    }
    // Se o item foi salvo com sucesso, retorna à página de listagem
    if (notif.severity === 'success') nav(-1);
    setState({ ...state, notif: { ...notif, show: false } });
  }


  return (
    <>

      <ConfirmImgPreviewDialog
        open={showDialog}
        onClose={handleCloseDialog}
        title="Preview"
        userName={<Typography> {userProfile.nome + ' ' + userProfile.sobrenome} </Typography>}
        profileImgPreview = { 
          <Avatar src={selectedFile} 
          alt="Foto de perfil" 
          style={{ width: '200px', height: '200px', boxShadow: '0 5px 10px 0px rgba(0, 0, 0, 0.2)'}}/>}
      >
      </ConfirmImgPreviewDialog>

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
          title="Editar Foto de Perfil"
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
            value={userProfile.nome}
            disabled
            />

            <TextField sx={{marginTop: '15px'}}
              label="Sobrenome"
              type="name"
              variant='filled'
              fullWidth
              required
              name="sobrenome" // Nome do campo na tabela
              value={userProfile.sobrenome} // Nome do campo na tabela
              disabled
            />

            <div style={{marginTop: '15px'}}>
              <Button
                component="label"
                role={undefined}
                variant="contained"
                fullWidth
                tabIndex={-1}
                startIcon={<CloudUploadIcon/>}
              >
                {selectedFile && 
                <IconButton onClick={handleImagePreviewClick}> 
                  <Avatar src={selectedFile} alt="Foto selecionada" sx={{ marginRight: '8px', width: '50px', height: '50px'}}/> 
                </IconButton>}
                {selectedFileName ? selectedFileName : 'Adicione uma Foto de perfil'}
                {selectedFile && <CloseIcon onClick={clearSelection} style={{ marginLeft: '8px', cursor: 'pointer' }} />}
                <VisuallyHiddenInput
                  type="file"
                  onChange={handleFileChange}
                  name="image"
                />
              </Button>
            </div>

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
  )
}
