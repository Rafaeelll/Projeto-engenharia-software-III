const WebPush = require('web-push');
const { Usuario } = require('../models'); // Ajuste o caminho conforme necessário

const send = async (data) => {
  const { usuarioId, message } = data;

  try {
    // Busca o usuário e a assinatura de push
    const usuario = await Usuario.findByPk(usuarioId);
    if (!usuario || !usuario.pushSubscription) {
      console.log('Usuário ou assinatura não encontrada');
      return { status: 404, message: 'Usuário ou assinatura não encontrada' };
    }

    console.log('Push Subscription:', usuario.pushSubscription);

    // Criando o payload com mais informações para a notificação
    const payload = JSON.stringify({
      title: 'Nova Notificação de Evento',
      body: message,
    });

    console.log('Payload:', payload);

    // Enviar a notificação para o usuário
    await WebPush.sendNotification(usuario.pushSubscription, payload);
    console.log('Notificação enviada com sucesso');
    return { status: 201, message: 'Notificação enviada com sucesso!' };
  } catch (error) {
    console.error('Erro ao enviar notificação:', error);
    return { status: 500, message: 'Erro ao enviar notificação' };
  }
};

// Exporta a função
module.exports = send;
