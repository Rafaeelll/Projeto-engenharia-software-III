import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Collapse from '@mui/material/Collapse';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ConfirmDialog from './ConfirmDialog';
import EditIcon from '@mui/icons-material/Edit';
import { Link } from 'react-router-dom';
import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';
import myfetch from '../../utils/myfetch';
import Notification from './Notification';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import '../../pages/main_pages/styles/main-pages-styles.css';
import { Rating } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';

function Row({ historicoJogo, onDelete }) {
  const API_PATH_JG = '/jogos';

  const [open, setOpen] = React.useState(false);
  const [jogos, setJogos] = React.useState([]);

  const handleDeleteClick = () => {
    onDelete(historicoJogo.id);
  };

  const fetchJogo = async () => {
    try {
      const result = await myfetch.get(`${API_PATH_JG}`);

      // Filtrar apenas o jogo relacionado ao histórico específico
      const jogoRelacionado = result.find(item => item.id === historicoJogo.jogo_id);

      if (jogoRelacionado) {
        // Adicionar o nome do jogo diretamente ao objeto historicoJogo
        historicoJogo.nome_do_jogo = jogoRelacionado.nome;
        setJogos([jogoRelacionado]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  React.useEffect(() => {
    fetchJogo();
  }, []);

  const handleCollapseToggle = () => {
    setOpen(!open);
    if (!open) {
      fetchJogo();
    }
  };

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <Tooltip title='Detalhes' arrow>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={handleCollapseToggle}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </Tooltip>
        </TableCell>
        <TableCell align="center" size='small' component="th" scope="row">
          {historicoJogo.id}
        </TableCell>
        <TableCell size='small' align="center">{historicoJogo.jogo_id} - {historicoJogo.nome_do_jogo}</TableCell>
        <TableCell size='small' align="center">{historicoJogo.nivel}</TableCell>
        <TableCell size='small' align="center">{historicoJogo.jogo_status}</TableCell>
        <TableCell size='small' align="center">
          <Rating size='small' readOnly value={historicoJogo.avaliacao} />
        </TableCell>        
        <TableCell size='small' align="center"> {historicoJogo.comentario_usuario}</TableCell>
        <TableCell size='small' align="center">
          <Link to={'./' + historicoJogo.id}>
            <IconButton aria-label="Editar">
              <EditIcon />
            </IconButton>
          </Link>
        </TableCell>
        <TableCell align="right">
          <IconButton aria-label="Excluir" onClick={handleDeleteClick}>
            <DeleteForeverIcon color="error" />
          </IconButton>
        </TableCell>
      </TableRow>


      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={9}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
            <Typography 
              sx={{fontWeight: 'bolder'}} variant="h6" gutterBottom component="div" color='primary'> 
              <u>Jogo</u> 
            </Typography>
              <Table size="small" aria-label="Jogos">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">Jogo ID</TableCell>
                    <TableCell align="center">Nome do Jogo</TableCell>
                    <TableCell align="center">Plataforma</TableCell>
                    <TableCell align="center">Categoria</TableCell>
                    <TableCell align="center">Preço</TableCell>
                    <TableCell align="center">Data de Aquisição</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {jogos.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        <Typography style={{ color: 'GrayText' }}>Tabela de jogo vazio</Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    jogos.map((jogoItem) => (
                    <TableRow key={jogoItem.id}>
                      <TableCell align="center">{jogoItem.id}</TableCell>
                      <TableCell align="center">{jogoItem.nome}</TableCell>
                      <TableCell align="center">{jogoItem.plataforma_jogo}</TableCell>
                      <TableCell align="center">{jogoItem.categoria}</TableCell>
                      <TableCell align="center">
                        {Number(jogoItem.preco_jogo).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </TableCell>                      
                      <TableCell align="center">
                          {format(parseISO(jogoItem.data_aquisicao), 'dd/MM/yyyy')}
                        </TableCell>
                      </TableRow>
                  ))
                )}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

export default function CollapsibleTable() {
  const API_PATH_HT = '/historico_jogos';

  const [historicoJogos, setHistoricoJogos] = React.useState([]);
  const [showWaiting, setShowWaiting] = React.useState(false);
  const [showDialog, setShowDialog] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState(null);
  const [notif, setNotif] = React.useState({
    show: false,
    message: '',
    severity: 'success'
  });

  const fetchData = async () => {
    setShowWaiting(true);
    try {
      const result = await myfetch.get(API_PATH_HT);
      setHistoricoJogos(result);
    } catch (error) {
      console.error(error);
    } finally {
      setShowWaiting(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    setShowDialog(true);
    setDeleteId(id);
  };

  const handleDialogClose = async (answer) => {
    setShowDialog(false);
    if (answer) {
      try {
        setShowWaiting(true);
        await myfetch.delete(`${API_PATH_HT}/${deleteId}`);
        setNotif({
          show: true,
          message: 'Item excluído com sucesso',
          severity: 'success'
        });
        fetchData();
      } catch (error) {
        console.error(error);
        setNotif({
          show: true,
          message: 'ERRO: ' + error.message,
          severity: 'error'
        });
      } finally {
        setShowWaiting(false);
      }
    }
  };

  const handleNotifClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setNotif({ ...notif, show: false });
  };

  return (
    <>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={showWaiting}
      >
        <CircularProgress color="secondary" />
      </Backdrop>

      <ConfirmDialog
        title="Confirmar operação"
        open={showDialog}
        onClose={handleDialogClose}
      >
        Deseja realmente excluir este item?
      </ConfirmDialog>

      <Notification
        show={notif.show}
        severity={notif.severity}
        onClose={handleNotifClose}
      >
        {notif.message}
      </Notification>

      <TableContainer sx={{ width: '70%', margin: '0 auto', marginTop: '50px', background: 'whitesmoke' }} component={Paper}> 
        <Typography sx={{marginLeft: '20px', mt:'10px', fontWeight: 'bolder'}} variant="h6" color='secondary'> <u>Históricos de Jogo</u> </Typography>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell align="center">Historíco ID</TableCell>
              <TableCell align="center">ID - Nome do Jogo</TableCell>
              <TableCell align="center">Nível</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">Avaliação</TableCell>
              <TableCell align="center">Comentário</TableCell>
              <TableCell align="center">Editar</TableCell>
              <TableCell align="center">Excluir</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {historicoJogos.length === 0 ? ( // Verifica se não há jogos
              <TableRow>
                <TableCell colSpan={9} align="center">
                  <Typography style={{color: 'GrayText'}}>Tabela vazia, crie um novo histórico</Typography> 
                </TableCell>
              </TableRow>
            ) : (
              // Renderiza as linhas da tabela
              historicoJogos.map((historicoJogo) => (
                <Row key={historicoJogo.id} historicoJogo={historicoJogo} onDelete={handleDelete} />
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
