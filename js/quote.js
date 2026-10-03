// ========================================
// ACT DIGITAL
// Project Enquiry System
// ========================================

import { db } from "./firebase-config.js";

import {
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";


// ========================================
// ELEMENTS
// ========================================

const quoteForm = document.getElementById("quoteForm");
const formStatus = document.getElementById("formStatus");


// ========================================
// FORM SUBMISSION
// ========================================

if (quoteForm) {

    quoteForm.addEventListener("submit", async (event) => {

        event.preventDefault();


        // --------------------------------
        // GET FORM VALUES
        // --------------------------------

        const name =
            document.getElementById("name").value.trim();

        const business =
            document.getElementById("business").value.trim();

        const email =
            document.getElementById("email").value.trim();

        const phone =
            document.getElementById("phone").value.trim();

        const website =
            document.getElementById("website").value.trim();

        const budget =
            document.getElementById("budget").value;

        const message =
            document.getElementById("message").value.trim();


        // --------------------------------
        // SELECTED SERVICES
        // --------------------------------

        const selectedServices = [
            ...document.querySelectorAll(
                'input[name="services"]:checked'
            )
        ].map(input => input.value);


        // --------------------------------
        // VALIDATION
        // --------------------------------

        if (selectedServices.length === 0) {

            showStatus(
                "Please select at least one service.",
                "error"
            );

            return;
        }


        if (message.length < 10) {

            showStatus(
                "Please tell us a little more about your project.",
                "error"
            );

            return;
        }


        // --------------------------------
        // SUBMIT BUTTON
        // --------------------------------

        const submitButton =
            quoteForm.querySelector(
                ".quote-submit-button"
            );

        const originalButtonContent =
            submitButton.innerHTML;

        submitButton.disabled = true;

        submitButton.innerHTML =
            "Sending Enquiry...";


        // --------------------------------
        // CREATE ENQUIRY
        // --------------------------------

        try {

            await addDoc(
                collection(db, "enquiries"),
                {

                    name: name,

                    business: business,

                    email: email,

                    phone: phone,

                    services: selectedServices,

                    website: website,

                    budget: budget,

                    message: message,

                    status: "New",

                    source: "ACT Digital Website",

                    createdAt: serverTimestamp()

                }
            );


            // --------------------------------
            // SUCCESS
            // --------------------------------

            showStatus(
                `Thanks ${name}! Your project enquiry has been received. ACT Digital will be in touch shortly.`,
                "success"
            );


            quoteForm.reset();


        } catch (error) {

            console.error(
                "ACT Digital enquiry error:",
                error
            );


            showStatus(
                "Something went wrong while sending your enquiry. Please try again or email enquiries@actdigital.co.za.",
                "error"
            );

        } finally {

            submitButton.disabled = false;

            submitButton.innerHTML =
                originalButtonContent;

        }

    });

}


// ========================================
// STATUS MESSAGE
// ========================================

function showStatus(message, type) {

    if (!formStatus) {
        return;
    }

    formStatus.textContent = message;

    formStatus.style.display = "block";


    if (type === "success") {

        formStatus.style.background =
            "rgba(0, 217, 255, 0.08)";

        formStatus.style.border =
            "1px solid rgba(0, 217, 255, 0.25)";

        formStatus.style.color =
            "#9fefff";

    } else {

        formStatus.style.background =
            "rgba(255, 80, 80, 0.08)";

        formStatus.style.border =
            "1px solid rgba(255, 80, 80, 0.25)";

        formStatus.style.color =
            "#ff9c9c";

    }

}