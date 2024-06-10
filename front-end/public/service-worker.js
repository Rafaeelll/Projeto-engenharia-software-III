self.addEventListener('push', function (event){
    event.waitUntil(
        self.ServiceWorkerRegistration.showNotification('Stream Advisor', {
            body: 'Testando...'
        })
    )
})