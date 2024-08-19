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
import { Rating } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';

export default function CollapsibleTableJogo() {
  const API_PATH_JG = '/jogos';
  const API_PATH_HT = '/historico_jogos';

  const [jogos, setJogos] = React.useState([]);
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
      const result = await myfetch.get(API_PATH_JG);
      setJogos(result);
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
        await myfetch.delete(`${API_PATH_JG}/${deleteId}`);
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

  function Row({ jogo, onDelete }) {
    const [open, setOpen] = React.useState(false);
    const [historicoJogos, setHistoricoJogos] = React.useState([]);

    const handleDeleteClick = () => {
      onDelete(jogo.id);
    };

    const fetchHistorico = async () => {
      try {
        const result = await myfetch.get(`${API_PATH_HT}`);
        const jogosResult = await myfetch.get('/jogos');

        const historicoRelacionado = result.filter(item => item.jogo_id === jogo.id);
        historicoRelacionado.forEach(item => {
          const jogoCorrespondente = jogosResult.find(jogo => jogo.id === item.jogo_id);
          if (jogoCorrespondente) {
            item.nome_do_jogo = jogoCorrespondente.nome;
          }
        });
        setHistoricoJogos(historicoRelacionado);
      } catch (error) {
        console.error(error);
      }
    };

    React.useEffect(() => {
      if (open) {
        fetchHistorico();
      }
    }, [open]);

    const handleCollapseToggle = () => {
      setOpen(!open);
    };

    return (
      <>
        <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
          <TableCell>
            <Tooltip title="Detalhes" arrow>
              <IconButton
                aria-label="expand row"
                size="small"
                onClick={handleCollapseToggle}
              >
                {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              </IconButton>
            </Tooltip>
          </TableCell>
          <TableCell size='small' component="th" scope="row">
            {jogo.nome}
          </TableCell>
          <TableCell size='small' align="center">{jogo.id}</TableCell>
          <TableCell size='small' align="center">{jogo.plataforma_jogo}</TableCell>
          <TableCell size='small' align="center">{jogo.categoria}</TableCell>
          <TableCell size='small' align="center">
            {Number(jogo.preco_jogo).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </TableCell>
          <TableCell size='small' align="center">
            {format(parseISO(jogo.data_aquisicao), 'dd/MM/yyyy')}
          </TableCell>
          <TableCell size='small' align="center">
            <Link to={'./' + jogo.id}>
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
                  sx={{ fontWeight: 'bolder' }} 
                  variant="h6" 
                  gutterBottom 
                  component="div" 
                  color='primary'
                > 
                  <u>Históricos Do Jogo</u> 
                </Typography>
                <Table size="small" aria-label="Historico De Jogos">
                  <TableHead>
                    <TableRow>
                      <TableCell size='small' align="center">Historíco ID</TableCell>
                      <TableCell size='small' align="center">ID - Nome do Jogo</TableCell>
                      <TableCell size='small' align="center">Nível</TableCell>
                      <TableCell size='small' align="center">Status</TableCell>
                      <TableCell size='small' align="center">Avaliação</TableCell>
                      <TableCell size='small' align="center">Comentário</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {historicoJogos.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center">
                          <Typography style={{ color: 'GrayText' }}>Histórico vazio</Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      historicoJogos.map((historicoItem) => (
                        <TableRow key={historicoItem.id}>
                          <TableCell size='small' align="center">{historicoItem.id}</TableCell>
                          <TableCell size='small' align="center">{historicoItem.jogo_id} - {historicoItem.nome_do_jogo}</TableCell>
                          <TableCell size='small' align="center">{historicoItem.nivel}</TableCell>
                          <TableCell size='small' align="center">{historicoItem.jogo_status}</TableCell>
                          <TableCell size='small' align="center">
                            <Rating size='small' readOnly value={historicoItem.avaliacao} />
                          </TableCell>
                          <TableCell size='small' align="center">{historicoItem.comentario_usuario}</TableCell>
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

      <TableContainer sx={{ width: '70%', margin: '0 auto', marginTop: '50px', 
        background: 'whitesmoke', overflow: 'auto', maxHeight: '70vh'}} component={Paper}> 
        <Typography sx={{marginLeft: '20px', mt:'10px', fontWeight: 'bolder'}} variant="h6" color='secondary'> <u>Jogos</u> </Typography>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell/>
              <TableCell size='small'>Nome</TableCell>
              <TableCell size='small' align="center">Jogo ID</TableCell>
              <TableCell size='small' align="center">Plataforma</TableCell>
              <TableCell size='small' align="center">Categoria</TableCell>
              <TableCell size='small' align="center">Preço</TableCell>
              <TableCell size='small' align="center">Data de Aquisição</TableCell>
              <TableCell size='small' align="center">Editar</TableCell>
              <TableCell size='small' align="center">Excluir</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {jogos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  <Typography style={{ color: 'GrayText' }}>Tabela vazia, crie um novo jogo</Typography>
                </TableCell>
              </TableRow>
            ) : (
              jogos.map((jogo) => (
                <Row key={jogo.id} jogo={jogo} onDelete={handleDelete} />
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
