importScripts("https://www.gstatic.com/firebasejs/6.2.3/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/6.2.3/firebase-messaging.js");


const firebaseConfig = {
    messagingSenderId: "103953800507"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler((payload) => {
    // console.log('[firebase-messaging-sw.js] Received background message ', payload);
    const title = 'DevComm React';

    // Customize notification here
    let notificationTitle = payload.data.title;
    let notificationOptions = {
        body: payload.data.body,
        icon: './images/login-logo.png'
    };
    return self.registration.showNotification(notificationTitle,
        notificationOptions);
});

self.addEventListener('notificationclick', (event) => {
    // console.debug('Event', event);
});
