// ========================================
// ACT DIGITAL
// Firebase Configuration
// ========================================


// Firebase SDK
import { initializeApp } from
    "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";

import { getFirestore } from
    "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";


// ----------------------------------------
// FIREBASE CONFIG
// ----------------------------------------

const firebaseConfig = {
    apiKey: "AIzaSyCcknk_s6PupWMGm2I7wH8KqMO1vy-9RP4",
    authDomain: "act-digital-d720f.firebaseapp.com",
    projectId: "act-digital-d720f",
    storageBucket: "act-digital-d720f.firebasestorage.app",
    messagingSenderId: "209436586387",
    appId: "1:209436586387:web:2943d5b6f08f972aecf866"
};


// ----------------------------------------
// INITIALISE FIREBASE
// ----------------------------------------

const app = initializeApp(firebaseConfig);


// ----------------------------------------
// FIRESTORE DATABASE
// ----------------------------------------

const db = getFirestore(app);


// ----------------------------------------
// EXPORTS
// ----------------------------------------

export {
    app,
    db
};