self.addEventListener('push', function(event) {
    // Verifica se há dados no evento (evita erros caso os dados não estejam presentes)
    const data = event.data ? event.data.json() : {};
  
    // Define as opções da notificação, como ícone, imagem e ações

    const options = {
      body: data.body || 'Você recebeu uma nova notificação!',
      vibrate: [200, 100, 200],
      icon: '/src/assets/sa4.png',
      actions: [
        { action: 'dismiss', title: 'Fechar'}
      ],
    };    
  
    // Exibe a notificação no navegador
    event.waitUntil(
      self.registration.showNotification(data.title || 'Stream Advisor', options)
    );
  });
  
  // Lida com cliques na notificação
  self.addEventListener('notificationclick', function(event) {
    // Fecha a notificação ao clicar nela ou em um dos botões
    event.notification.close();
  });
  