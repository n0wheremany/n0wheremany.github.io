firebase.initializeApp({
    messagingSenderId: '271394934469'
});

if (/*window.location.protocol === 'https:' &&*/
    'Notification' in window &&
    'serviceWorker' in navigator &&
    'localStorage' in window &&
    'fetch' in window &&
    'postMessage' in window
) {

    var messaging=firebase.messaging(),firecli={
        d:!1,
        saveToken:function(t){
            this.onError('saveToken',t);
            //$.post(dle_root+'engine/ajax/webpush.php',{act:'save','token':t});
            if(!t){
                firecli.onError('No Instance ID token available. Request permission to generate one.',t)
            } else {
                firecli.onError('Yahoo!!',t)
            }
        },
        getPerm:function(){
            firecli.onError('getPerm','start');
            return messaging.requestPermission().then(function(){firecli.getToken()})
                .catch(function(e){firecli.onError('Unable to get permission to notify.',e)})
        },
        getToken:function(a){
            firecli.onError('getToken','start',a);
            messaging.getToken().then(function(t){firecli.saveToken(t)})
                .catch(function(e){firecli.onError('An error occurred while retrieving token',e)})
        },
        delToken:function(a){
            firecli.onError('delToken','start',a);
            messaging.getToken()
                .then(function(t) {
                    messaging.deleteToken(t)
                        .then(function() {
                            firecli.saveToken(!1)
                        })
                })
        },
        onError:function(a,b,c){
            /*if(this.d)*/console.log(a,b,c)
        },
        onMessage:function(p){
            console.log('Message received. ', payload);

            // register fake ServiceWorker for show notification on mobile devices
            navigator.serviceWorker.register('/serviceworker/messaging-sw.js');
            Notification.requestPermission(function(permission) {
                if (permission === 'granted') {
                    navigator.serviceWorker.ready.then(function(registration) {
                        payload.notification.data = payload.notification;
                        registration.showNotification(payload.notification.title, payload.notification);
                    }).catch(function(error) {
                        // registration failed :(
                        showError('ServiceWorker registration failed.', error);
                    });
                }
            });

        }
    };
    if (Notification.permission === 'granted') {
        firecli.getPerm()
    }
    messaging.onMessage(firecli.onMessage);
    messaging.onTokenRefresh(firecli.getToken);



} else {
    if (window.location.protocol !== 'https:') {
        showError('Is not from HTTPS');
    } else if (!('Notification' in window)) {
        showError('Notification not supported');
    } else if (!('serviceWorker' in navigator)) {
        showError('ServiceWorker not supported');
    } else if (!('localStorage' in window)) {
        showError('LocalStorage not supported');
    } else if (!('fetch' in window)) {
        showError('fetch not supported');
    } else if (!('postMessage' in window)) {
        showError('postMessage not supported');
    }

    console.warn('This browser does not support desktop notification.');
    console.log('Is HTTPS', window.location.protocol === 'https:');
    console.log('Support Notification', 'Notification' in window);
    console.log('Support ServiceWorker', 'serviceWorker' in navigator);
    console.log('Support LocalStorage', 'localStorage' in window);
    console.log('Support fetch', 'fetch' in window);
    console.log('Support postMessage', 'postMessage' in window);
}
