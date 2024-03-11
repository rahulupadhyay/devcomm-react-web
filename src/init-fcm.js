import * as firebase from "firebase/app";
import "firebase/messaging";

let messaging = null;

const initializedFirebaseApp = firebase.initializeApp({
    messagingSenderId: "141964026923"
});

if (firebase.messaging.isSupported()) {
    messaging = initializedFirebaseApp.messaging();

    messaging.usePublicVapidKey(
        "BCLACxTGBvY-Ad_drmU-3iVni0tHIuDWJ56pKf1ydPZPiw2HfhULylqNyBAvny696wqJ_8E8VUwEdTmFPZqAv3E"
    );

} else {
    // console.error('Browser is not supported for the Messaging');
}


export { messaging };
