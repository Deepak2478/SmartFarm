
//Register one-off sync:

navigator.serviceWorker.ready.then((workerRegistration) =>{
    return workerReistration.sync.register(‘dummySync’);
});
// this returns a Promise{<pending>} object


//Listen for the sync event:

addEventListener(‘sync’, (e) =>{
    if(e.tag == ‘dummySync’){
	e.waitUntil(performBackgroundSync());
    }
});

