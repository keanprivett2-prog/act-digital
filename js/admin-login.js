// ========================================
// ACT DIGITAL
// Admin Authentication
// ========================================

import { app } from "./firebase-config.js";

import {
    getAuth,
    signInWithEmailAndPassword,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";


const auth = getAuth(app);


// ========================================
// ELEMENTS
// ========================================

const loginForm =
    document.getElementById("adminLoginForm");

const emailInput =
    document.getElementById("adminEmail");

const passwordInput =
    document.getElementById("adminPassword");

const loginStatus =
    document.getElementById("adminLoginStatus");

const passwordToggle =
    document.getElementById("toggleAdminPassword");


// ========================================
// EXISTING LOGIN
// ========================================

onAuthStateChanged(auth, (user) => {

    if (user) {

        window.location.href =
            "dashboard.html";

    }

});


// ========================================
// PASSWORD VISIBILITY
// ========================================

if (passwordToggle && passwordInput) {

    passwordToggle.addEventListener(
        "click",
        () => {

            const hidden =
                passwordInput.type === "password";

            passwordInput.type =
                hidden
                    ? "text"
                    : "password";

            passwordToggle.textContent =
                hidden
                    ? "HIDE"
                    : "SHOW";

            passwordToggle.setAttribute(
                "aria-label",
                hidden
                    ? "Hide password"
                    : "Show password"
            );

        }
    );

}


// ========================================
// LOGIN
// ========================================

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();

            clearLoginStatus();


            const email =
                emailInput.value.trim();

            const password =
                passwordInput.value;


            const loginButton =
                loginForm.querySelector(
                    ".admin-login-button"
                );

            const originalButton =
                loginButton.innerHTML;


            loginButton.disabled = true;

            loginButton.innerHTML =
                "Signing In...";


            try {

                await signInWithEmailAndPassword(
                    auth,
                    email,
                    password
                );


                // onAuthStateChanged handles redirect.


            } catch (error) {

                console.error(
                    "ACT admin login error:",
                    error.code
                );


                showLoginError(
                    "Unable to sign in. Please check your email and password."
                );


                loginButton.disabled = false;

                loginButton.innerHTML =
                    originalButton;

            }

        }
    );

}


// ========================================
// STATUS HELPERS
// ========================================

function showLoginError(message) {

    if (!loginStatus) {
        return;
    }

    loginStatus.textContent = message;

    loginStatus.className =
        "admin-login-status error";

}


function clearLoginStatus() {

    if (!loginStatus) {
        return;
    }

    loginStatus.textContent = "";

    loginStatus.className =
        "admin-login-status";

}