const WebPush = require('web-push');
const { Usuario } = require('../models'); // Ajuste o caminho conforme necessário

const send = async (data) => { // Recebe data em vez de req e res
  const { usuarioId, message } = data; // Desestruturação dos dados

  try {
    // Recuperar a assinatura do usuário
    const usuario = await Usuario.findByPk(usuarioId);
    if (!usuario || !usuario.pushSubscription) {
      return { status: 404, message: 'Usuário ou assinatura não encontrada' }; // Retorna um objeto ao invés de resposta HTTP
    }

    // Estrutura da notificação
    const payload = JSON.stringify({
      title: 'Nova Notificação',
      body: message,
      icon: '/tmp/uploads/sa4.png' // Você pode adicionar um ícone, se desejar
    });

    // Enviar notificação
    await WebPush.sendNotification(usuario.pushSubscription, payload);

    return { status: 201, message: 'Notificação enviada com sucesso!' }; // Retorna um objeto
  } catch (error) {
    console.error('Erro ao enviar notificação:', error);
    return { status: 500, message: 'Erro ao enviar notificação' }; // Retorna um objeto
  }
};

// Exporta a função
module.exports = send;
