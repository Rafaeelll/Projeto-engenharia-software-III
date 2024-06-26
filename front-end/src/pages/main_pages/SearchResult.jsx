import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import myfetch from '../../utils/myfetch';
import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'
import Notification from '../../components/ui/Notification'
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { DataGrid } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import IconButton from '@mui/material/IconButton'
import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating'
import './styles/main-pages-styles.css'


function SearchResult() {
  const { opcao, id } = useParams();
  const [detalhes, setDetalhes] = useState(null);
  const [state, setState] = React.useState({
    showDialog: false,
    showWaiting: false,
    deleteId: null,
  })
  const {
    showDialog,
    showWaiting,
    deleteId,
  } = state

  const [notif, setNotif] = useState({
    show: false,
    message: '',
    severity: 'success' // ou 'error'
  })

    async function fetchDetalhes() {
      try {
        const response = await myfetch.get(`/${opcao}/${id}`);
        setDetalhes(response);
        setState({
          ...state, 
          showWaiting: false,
          showDialog: false
        })
      } catch (error) {
        console.error('Erro ao buscar detalhes:', error);
        setNotif({
          show: true,
          message: error.message,
          severity: 'error'
        })
        setState({
          ...state,
          showWaiting: false,
          showDialog: false
        })
      }
      finally {
        setState({
          ...state,
          showWaiting: false,
          showDialog: false
        })      
      }
    }
    useEffect(() => {
      fetchDetalhes()
    }, [])

    function handleNotifClose(event, reason) {
      if (reason === 'clickaway') {
        return;
      }
      setNotif({ show: false })
    };

    async function handleDialogClose(answer) {
      if(answer) {
        // Fecha o diálogo de confirmação e exibe o backdrop
        setState({ ...state, showWaiting: true, showDialog: false })
        try {
          await myfetch.delete(`/${opcao}/${deleteId}`)
          setState({
            ...state,
            showWaiting: false,   // esconde o backdrop
            showDialog: false,    // esconde o diálogo de confirmação
            notif: {              // exibe a snackbar
              show: true,
              message: 'Item excluído com sucesso',
              severity: 'success'
            }
          })
          // Recarrega os dados da listagem
          fetchDetalhes()
        }
        catch(error) {
          console.error(error)
          setState({
            ...state,
            showWaiting: false,   // esconde o backdrop
            showDialog: false,    // esconde o diálogo de confirmação
            notif: {              // exibe a snackbar
              show: true,
              message: 'ERRO: ' + error.message,
              severity: 'error'
            }
          })
        }
      }
      else {
        // Fecha o diálogo de confirmação
        setState({ ...state, showDialog: false })
      }
    }

    function getStatusColor(status){
      switch (status){
        case 'Agendado':
          return 'red';
        case 'Finalizada':
          return 'green';
        case 'Em andamento':
          return 'lightblue';
        default:
          return 'black';
      }
    }
    // Função para retornar as colunas com base na opção selecionada
  function getColumns(opcao) {
    switch (opcao) {
      case 'agendas':
        return [
          { field: 'id', headerName: 'Id agenda', width: 90 },
          {
            field: 'jogo_id',
            headerName: 'Id Jogo',
            width: 150,
            valueGetter: params => params.row?.jogo.id  + ': ' + params.row?.jogo.nome
          },
          {
            field: 'data_horario_inicio',
            headerName: 'Início',
            width: 150,
            valueGetter: params => format(parseISO(params.row.data_horario_inicio), 'dd/MM/yyyy - HH:mm')

          },

          {
            field: 'data_horario_fim',
            headerName: 'Término',
            width: 150,
            valueGetter: params => format(parseISO(params.row.data_horario_fim), 'dd/MM/yyyy - HH:mm')

          },
          {
            field: 'titulo_agenda',
            headerName: 'Título',
            width: 150
          },
          {
            field: 'plt_transm',
            headerName: 'Plataforma',
            width: 150
          },
          {
            field: 'p_data_horario_inicio',
            headerName: "Início Pausa",
            width: 150,
            valueGetter: params => params.row.p_data_horario_inicio ? format(parseISO(params.row.p_data_horario_inicio), 'dd/MM/yyyy - HH:mm') : 'Nulo'

          },
          {
            field: 'p_data_horario_fim',
            headerName: "Fim Pausa",
            width: 150,
            valueGetter: params => params.row.p_data_horario_inicio ? format(parseISO(params.row.p_data_horario_fim), 'dd/MM/yyyy - HH:mm') : 'Nulo'

          },
          {
            field: 'descricao',
            headerName: 'Descrição',
            width: 150
          },
          {
            field: 'status',
            headerName: 'Status',
            width: 150,
            renderCell: params =>(
              <div
                style={{
                  color: getStatusColor(params.value),
                  fontWeight: 'bold'
                }}
                >
                  {params.value}
              </div>
            )
          },
          {
            field: 'edit',
            headerName: 'Editar',
            headerAlign: 'center',
            align: 'center',
            width: 90,
            renderCell: params => (
              <Link to={'/agenda/' + params.id}>
                <IconButton aria-label="Editar">
                  <EditIcon />
                </IconButton>
              </Link>
          )},
          {
            field: 'delete',
            headerName: 'Excluir',
            headerAlign: 'center',
            align: 'center',
            width: 90,
            renderCell: params => (
              <IconButton 
                aria-label="excluir"
                onClick={() => setState({
                  ...state,
                  deleteId: params.id,  // guarda o id do item a ser excluído
                  showDialog: true      // mostra o diálogo de confirmação
                })}
              >
                <DeleteForeverIcon color="error" />
              </IconButton>
            )
          }
        ];
      case 'jogos':
        return [
          { field: 'id', headerName: 'ID', width: 90 },
          {
            field: 'nome',
            headerName: 'Nome',
            width: 150,
          },

          {
            field: 'data_aquisicao',
            headerName: 'Data de Aquisição',
            width: 150,
            valueGetter: params => format(parseISO(params.row.data_aquisicao), 'dd/MM/yyyy')

          },
          {
            field: 'plataforma_jogo',
            headerName: 'Plataforma do Jogo',
            width: 150
          },
          {
            field: 'preco_jogo',
            headerName: 'Preço do Jogo',
            width: 150,
            valueGetter: params => 'R$ ' + params.row.preco_jogo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
          },
          {
            field: 'categoria',
            headerName: "Categoria",
            width: 150,

          },
          {
            field: 'edit',
            headerName: 'Editar',
            headerAlign: 'center',
            align: 'center',
            width: 90,
            renderCell: params => (
              <Link to={'/jogo/' + params.id}>
                <IconButton aria-label="Editar">
                  <EditIcon />
                </IconButton>
              </Link>
          )},
          {
            field: 'delete',
            headerName: 'Excluir',
            headerAlign: 'center',
            align: 'center',
            width: 90,
            renderCell: params => (
              <IconButton 
                aria-label="excluir"
                onClick={() => setState({
                  ...state,
                  deleteId: params.id,  // guarda o id do item a ser excluído
                  showDialog: true      // mostra o diálogo de confirmação
                })}
              >
                <DeleteForeverIcon color="error" />
              </IconButton>
            )
          }        
        ];
      case 'historico_jogos':
        return [
          { field: 'id', headerName: 'ID', width: 90 },
          
          {
            field: 'jogo_id',
            headerName: 'Id Jogo',
            width: 150,
            valueGetter: params => params.row?.jogo.id  + ': ' + params.row?.jogo.nome
          },
          {
            field: 'nivel',
            headerName: 'Nível',
            width: 150
          },
          {
            field: 'jogo_status',
            headerName: 'Status',
            width: 150,
          },
          
          {
            field: 'avaliacao',
            headerName: 'Avaliação',
            width: 150,
            renderCell: params =>(
              <div>
                <Rating
                  readOnly 
                  value={params.value}>
                </Rating>
              </div>
            )
          },
          {
            field: 'comentario_usuario',
            headerName: 'Comentários',
            width: 150,
          },
          
          {
            field: 'edit',
            headerName: 'Editar',
            headerAlign: 'center',
            align: 'center',
            width: 90,
            renderCell: params => (
              <Link to={'/historico_jogo/' + params.id}>
                <IconButton aria-label="Editar">
                  <EditIcon />
                </IconButton>
              </Link>
          )},
          {
            field: 'delete',
            headerName: 'Excluir',
            headerAlign: 'center',
            align: 'center',
            width: 90,
            renderCell: params => (
              <IconButton 
                aria-label="excluir"
                onClick={() => setState({
                  ...state,
                  deleteId: params.id,  // guarda o id do item a ser excluído
                  showDialog: true      // mostra o diálogo de confirmação
                })}
              >
                <DeleteForeverIcon color="error" />
              </IconButton>
            )
          }     
        ];
        case 'visualizacoes':
          return [
            { field: 'id', headerName: 'ID', width: 90 },
            
            {
              field: 'agenda_id',
              headerName: 'Id Agenda',
              width: 150,
            },

            {
              field: 'numero_visualizacao',
              headerName: 'Número De Visualizações',
              width: 150
            },

            {
              field: 'edit',
              headerName: 'Editar',
              headerAlign: 'center',
              align: 'center',
              width: 90,
              renderCell: params => (
                <Link to={'/visualizacao/' + params.id}>
                  <IconButton aria-label="Editar">
                    <EditIcon />
                  </IconButton>
                </Link>
            )},
            {
              field: 'delete',
              headerName: 'Excluir',
              headerAlign: 'center',
              align: 'center',
              width: 90,
              renderCell: params => (
                <IconButton 
                  aria-label="excluir"
                  onClick={() => setState({
                    ...state,
                    deleteId: params.id,  // guarda o id do item a ser excluído
                    showDialog: true      // mostra o diálogo de confirmação
                  })}
                >
                  <DeleteForeverIcon color="error" />
                </IconButton>
              )
            }     
          ];
          case 'notificacoes':
            return [
              { field: 'id', headerName: 'ID', width: 90 },
              
              {
                field: 'agenda_id',
                headerName: 'Id Agenda',
                width: 150,
              },
  
              {
                field: 'data_notificacao',
                headerName: 'Data da Notificação',
                width: 150,
                valueGetter: params => format(parseISO(params.row.data_notificacao), 'dd/MM/yyyy - HH:mm')

              },
  
              {
                field: 'edit',
                headerName: 'Editar',
                headerAlign: 'center',
                align: 'center',
                width: 90,
                renderCell: params => {
                  const notificationMessage = params.row.mensagem;
                  let redirectPath = '';
                  if (notificationMessage.includes('prestes a começar')) {
                    redirectPath = `/notificacao/confirmar-presenca/${params.id}`;
                  } else if (notificationMessage.includes('já finalizou')) {
                    redirectPath = `/notificacao/confirmar-finalizacao/${params.id}`;
                  } else {
                    // Define um redirecionamento padrão caso a mensagem não corresponda a nenhum caso esperado
                    redirectPath = `/notificacao/confirmar-default/${params.id}`;
                  }
                  return (
                    <Link to={redirectPath}>
                      <IconButton aria-label="Editar">
                        <EditIcon />
                      </IconButton>
                    </Link>
                  );
                }
              },
              {
                field: 'delete',
                headerName: 'Excluir',
                headerAlign: 'center',
                align: 'center',
                width: 90,
                renderCell: params => (
                  <IconButton 
                    aria-label="excluir"
                    onClick={() => {
                      const agendaId = params.row.agenda_id; // Verifique se agenda_id está corretamente definido
                      if (agendaId) {
                        setState({
                          ...state,
                          deleteAgendaId: agendaId, // guarda o id do item a ser excluído
                          deleteId: params.id, 
                          showDialog: true      // mostra o diálogo de confirmação
                        });
                      } else {
                        console.error(error);
                      }
                    }}
                  >
                    <DeleteForeverIcon color="error" />
                  </IconButton>
                )
              }     
            ];      
        default:
          return [];
    } 
  }

  return (
    <>
      <ConfirmDialog 
        title="Confirmar operação"
        open={showDialog}
        onClose={handleDialogClose}
      >
        Deseja realmente excluir este item?
      </ConfirmDialog>

      <Box 
        sx={{ 
          width: '70%', 
          margin: '0 auto', 
          backgroundColor: 'black', 
          color: 'white', 
          fontFamily: 'arial', 
          marginTop: '50px', 
          borderRadius: '5px 5px 0px 0px', 
          textAlign: 'center', 
          padding: '10px', 
          borderStyle: 'groove' }}> 
          <h1 style={{ margin: '0 auto', fontSize: '20px' }}>
            <strong> 
              Listagem de {opcao}
            </strong>
          </h1>
      </Box>         
        {detalhes ? (
          <Paper elevation={4} sx={{width: '70%', margin: '0 auto', borderRadius: '0px 0px 5px 5px'}}>
            <DataGrid  
            sx={{
              fontFamily: 'arial', fontWeight: 'medium', 
              background: 'whitesmoke', color: '#470466', 
              fontSize: '13px', borderRadius: '0px 0px 5px 5px'
            }}
              rows={[detalhes]}
              columns={getColumns(opcao)}
              initialState={{
                pagination: {
                  paginationModel: {
                    page: 0, pageSize: 5,
                  },
                },
              }}
              pageSizeOptions={[5, 10]}
              disableSelectionOnClick
            />
          </Paper>
      ) : (
        <>
          <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={showWaiting}
          >
            <CircularProgress color="secondary"/>
            Por favor, aguarde.
          </Backdrop>

          <Notification 
            show={notif.show} 
            onClose={handleNotifClose}
            severity={notif.severity}
          >
            {notif.message}
          </Notification>
        </>
      )}
    </>
  );
}

export default SearchResult;