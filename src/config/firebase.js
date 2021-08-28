import firebase from "firebase";

let firebaseConfig = {
    apiKey: "AIzaSyB4NSUStvLGZo6LjfXj0cp9RXVrSG3czx0",
    authDomain: "react-login-fefa1.firebaseapp.com",
    projectId: "react-login-fefa1",
    storageBucket: "react-login-fefa1.appspot.com",
    messagingSenderId: "171060770446",
    appId: "1:171060770446:web:a1a5349a9d66bc91b3bbdf"
};

let firebaseApp=firebase.initializeApp(firebaseConfig);
export let firebaseAuth=firebaseApp.auth();
export let firebaseStorage=firebaseApp.storage();
export let firebaseDB=firebaseApp.firestore();
export let timeStamp=firebase.firestore.FieldValue.serverTimestamp;