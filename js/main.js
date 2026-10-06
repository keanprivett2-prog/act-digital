// ========================================
// ACT DIGITAL
// Main JavaScript
// ========================================


// ----------------------------------------
// AUTOMATIC COPYRIGHT YEAR
// ----------------------------------------

const currentYear = document.getElementById("currentYear");

if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}

/* ========================================
   MOBILE NAVIGATION
======================================== */

const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

if (menuToggle && mainNav) {

    menuToggle.addEventListener("click", () => {

        const menuIsOpen = mainNav.classList.toggle("active");

        menuToggle.classList.toggle("active", menuIsOpen);

        menuToggle.setAttribute(
            "aria-expanded",
            menuIsOpen
        );

        menuToggle.setAttribute(
            "aria-label",
            menuIsOpen
                ? "Close navigation menu"
                : "Open navigation menu"
        );

    });


    /* CLOSE MENU AFTER CLICKING A LINK */

    const mobileNavLinks =
        mainNav.querySelectorAll(".nav-link");

    mobileNavLinks.forEach((link) => {

        link.addEventListener("click", () => {

            mainNav.classList.remove("active");
            menuToggle.classList.remove("active");

            menuToggle.setAttribute(
                "aria-expanded",
                "false"
            );

            menuToggle.setAttribute(
                "aria-label",
                "Open navigation menu"
            );

        });

    });


    /* RESET MENU WHEN RETURNING TO DESKTOP */

    window.addEventListener("resize", () => {

        if (window.innerWidth > 900) {

            mainNav.classList.remove("active");
            menuToggle.classList.remove("active");

            menuToggle.setAttribute(
                "aria-expanded",
                "false"
            );

            menuToggle.setAttribute(
                "aria-label",
                "Open navigation menu"
            );

        }

    });

}

/* ========================================
   SERVICE PAGE MOBILE NAVIGATION
======================================== */

const serviceMenuToggle =
    document.getElementById("serviceMenuToggle");

const servicePageNav =
    document.querySelector(".service-page-nav");


if (serviceMenuToggle && servicePageNav) {

    serviceMenuToggle.addEventListener("click", () => {

        const menuIsOpen =
            servicePageNav.classList.toggle("active");

        serviceMenuToggle.classList.toggle(
            "active",
            menuIsOpen
        );

        serviceMenuToggle.setAttribute(
            "aria-expanded",
            menuIsOpen
        );

        serviceMenuToggle.setAttribute(
            "aria-label",
            menuIsOpen
                ? "Close navigation menu"
                : "Open navigation menu"
        );

    });


    /* CLOSE AFTER CLICKING A NAV LINK */

    const serviceNavLinks =
        servicePageNav.querySelectorAll("a");

    serviceNavLinks.forEach((link) => {

        link.addEventListener("click", () => {

            servicePageNav.classList.remove("active");

            serviceMenuToggle.classList.remove("active");

            serviceMenuToggle.setAttribute(
                "aria-expanded",
                "false"
            );

            serviceMenuToggle.setAttribute(
                "aria-label",
                "Open navigation menu"
            );

        });

    });


    /* RESET WHEN RETURNING TO DESKTOP */

    window.addEventListener("resize", () => {

        if (window.innerWidth > 900) {

            servicePageNav.classList.remove("active");

            serviceMenuToggle.classList.remove("active");

            serviceMenuToggle.setAttribute(
                "aria-expanded",
                "false"
            );

            serviceMenuToggle.setAttribute(
                "aria-label",
                "Open navigation menu"
            );

        }

    });

}