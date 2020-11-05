// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

import firebase from 'firebase';
import "firebase/auth";
import "firebase/firestore";
import "firebase/functions";

var firebaseConfig = {
    apiKey: "AIzaSyCeaxx8Or-S_s18iq0fePw9XkkunZ-RH_4",
    authDomain: "slidesigreja-ff51f.firebaseapp.com",
    databaseURL: "https://slidesigreja-ff51f.firebaseio.com",
    projectId: "slidesigreja-ff51f",
    storageBucket: "slidesigreja-ff51f.appspot.com",
    messagingSenderId: "683801084894",
    appId: "1:683801084894:web:3e62806204d8e91a67134f",
    measurementId: "G-R04T1JMDN0"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

export default firebase;

export const firebaseStorage = firebase.storage().ref();
export const firebaseAuth = firebase.auth();
export const firebaseFunctions = firebase.functions();
export const firestore = firebase.firestore();