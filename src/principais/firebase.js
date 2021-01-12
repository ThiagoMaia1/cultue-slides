// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

import * as firebase from 'firebase';
import "firebase/auth";
import "firebase/firestore";
import "firebase/functions";

var firebaseConfig = {
    apiKey: "AIzaSyAEUvnSQXQtDk3sWB1OWP5glYD9JJ1NDZ8",
    authDomain: "cultue.firebaseapp.com",
    projectId: "cultue",
    storageBucket: "cultue.appspot.com",
    messagingSenderId: "478235807271",
    appId: "1:478235807271:web:103590a7a6c384a5ac0802",
    measurementId: "G-HVSWJFQ21G"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

export default firebase;

export const firebaseStorage = firebase.storage().ref();
export const firebaseAuth = firebase.auth();
export const firebaseFunctions = firebase.functions();
export const firestore = firebase.firestore();
export const googleAuth = new firebase.auth.GoogleAuthProvider();