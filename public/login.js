// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyC0TU_l3Jw5eVt2sfMyp6G4fp0UEBg4yAc",
    authDomain: "devopia-7c4d5.firebaseapp.com",
    projectId: "devopia-7c4d5",
    storageBucket: "devopia-7c4d5.appspot.com",
    messagingSenderId: "292783021563",
    appId: "1:292783021563:web:906e504999ced0734dff5e",
    measurementId: "G-6PG5X0ZQBS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
auth.languageCode = 'en';

const googleLogin = document.getElementsByClassName('google-login-btn')[0];
googleLogin.addEventListener('click',()=>{
    signInWithPopup(auth, provider)
    .then((result)=>{
            console.log(result);  
            console.log(result.user);
            const user = result.user;
            const displayName = user.displayName;
            console.log(displayName);
    })
    .catch((error)=>{
            console.log(error);
    })
})

