// ========================================
// ACT DIGITAL
// CRM Dashboard
// ========================================

import {
    app,
    db
} from "./firebase-config.js";


import {
    getAuth,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";


import {
    collection,
    query,
    orderBy,
    onSnapshot,
    doc,
    updateDoc,
    serverTimestamp,
    arrayUnion
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";


const auth = getAuth(app);


// ========================================
// ELEMENTS
// ========================================

const tableBody =
    document.getElementById("enquiriesTableBody");

const totalEnquiries =
    document.getElementById("totalEnquiries");

const newEnquiries =
    document.getElementById("newEnquiries");

const quotesSent =
    document.getElementById("quotesSent");

const wonEnquiries =
    document.getElementById("wonEnquiries");

const sidebarNewCount =
    document.getElementById("sidebarNewCount");

const statusFilter =
    document.getElementById("enquiryStatusFilter");

const logoutButton =
    document.getElementById("logoutButton");

const adminUserEmail =
    document.getElementById("adminUserEmail");

const enquiryModal =
    document.getElementById("enquiryModal");

const closeEnquiryModal =
    document.getElementById("closeEnquiryModal");

const modalClientName =
    document.getElementById("modalClientName");

const modalContent =
    document.getElementById("modalContent");

    // ========================================
// CRM VIEWS
// ========================================

const dashboardNavButton =
    document.getElementById("dashboardNavButton");

const enquiriesNavButton =
    document.getElementById("enquiriesNavButton");

    const clientsNavButton =
    document.getElementById("clientsNavButton");

const dashboardView =
    document.getElementById("dashboardView");

const enquiriesView =
    document.getElementById("enquiriesView");

    const clientsView =
    document.getElementById("clientsView");

const allEnquiriesTableBody =
    document.getElementById("allEnquiriesTableBody");

const enquirySearchInput =
    document.getElementById("enquirySearchInput");

const allEnquiriesStatusFilter =
    document.getElementById("allEnquiriesStatusFilter");

    const allEnquiriesSort =
    document.getElementById("allEnquiriesSort");

const enquiryResultCount =
    document.getElementById("enquiryResultCount");


let enquiries = [];

// ========================================
// CRM VIEW NAVIGATION
// ========================================

function showCRMView(viewName) {

    if (
        !dashboardView ||
        !enquiriesView ||
        !clientsView
    ) {
        return;
    }

    // ========================================
    // HIDE ALL CRM VIEWS
    // ========================================

    dashboardView.classList.remove("active");
    enquiriesView.classList.remove("active");
    clientsView.classList.remove("active");


    // ========================================
    // REMOVE ACTIVE NAV STATE
    // ========================================

    if (dashboardNavButton) {
        dashboardNavButton.classList.remove("active");
    }

    if (enquiriesNavButton) {
        enquiriesNavButton.classList.remove("active");
    }

    if (clientsNavButton) {
        clientsNavButton.classList.remove("active");
    }


    // ========================================
    // SHOW SELECTED VIEW
    // ========================================

    if (viewName === "dashboard") {

        dashboardView.classList.add("active");

        if (dashboardNavButton) {
            dashboardNavButton.classList.add("active");
        }

    } else if (viewName === "enquiries") {

        enquiriesView.classList.add("active");

        if (enquiriesNavButton) {
            enquiriesNavButton.classList.add("active");
        }

    } else if (viewName === "clients") {

        clientsView.classList.add("active");

        if (clientsNavButton) {
            clientsNavButton.classList.add("active");
        }

    }

}

// ========================================
// CRM NAVIGATION EVENTS
// ========================================

if (dashboardNavButton) {
    dashboardNavButton.addEventListener(
        "click",
        () => {
            showCRMView("dashboard");
        }
    );
}

if (enquiriesNavButton) {
    enquiriesNavButton.addEventListener(
        "click",
        () => {
            showCRMView("enquiries");
        }
    );
}

if (clientsNavButton) {
    clientsNavButton.addEventListener(
        "click",
        () => {
            showCRMView("clients");
        }
    );
}


// ========================================
// AUTH GUARD
// ========================================

onAuthStateChanged(
    auth,
    (user) => {

        if (!user) {

            window.location.href =
                "admin.html";

            return;

        }


        if (adminUserEmail) {

            adminUserEmail.textContent =
                user.email;

        }


        loadEnquiries();

    }
);


// ========================================
// LOAD ENQUIRIES
// ========================================

function loadEnquiries() {

    const enquiriesQuery =
        query(
            collection(db, "enquiries"),
            orderBy("createdAt", "desc")
        );


    onSnapshot(
        enquiriesQuery,

        (snapshot) => {

            enquiries =
                snapshot.docs.map(
                    (document) => ({
                        id: document.id,
                        ...document.data()
                    })
                );


            updateStats();

renderEnquiries();

renderAllEnquiries();

        },

        (error) => {

            console.error(
                "Unable to load enquiries:",
                error
            );


            tableBody.innerHTML = `
                <tr>
                    <td
                        colspan="6"
                        class="crm-empty-row"
                    >
                        Unable to load enquiries.
                    </td>
                </tr>
            `;

        }
    );

}


// ========================================
// DASHBOARD STATS
// ========================================

function updateStats() {

    const total =
        enquiries.length;


    const newCount =
        enquiries.filter(
            enquiry =>
                enquiry.status === "New"
        ).length;


    const quoteCount =
        enquiries.filter(
            enquiry =>
                enquiry.status === "Quote Sent"
        ).length;


    const wonCount =
        enquiries.filter(
            enquiry =>
                enquiry.status === "Won"
        ).length;


    totalEnquiries.textContent =
        total;

    newEnquiries.textContent =
        newCount;

    quotesSent.textContent =
        quoteCount;

    wonEnquiries.textContent =
        wonCount;

    sidebarNewCount.textContent =
        newCount;

}


// ========================================
// RENDER ENQUIRIES
// ========================================

function renderEnquiries() {

    const selectedStatus =
        statusFilter.value;


    const filteredEnquiries =
        selectedStatus === "All"

            ? enquiries

            : enquiries.filter(
                enquiry =>
                    enquiry.status ===
                    selectedStatus
            );


    if (filteredEnquiries.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td
                    colspan="6"
                    class="crm-empty-row"
                >
                    No enquiries found.
                </td>
            </tr>
        `;

        return;
    }


    tableBody.innerHTML =
        filteredEnquiries
            .map(
                enquiry =>
                    createEnquiryRow(enquiry)
            )
            .join("");


    attachViewButtons();

}

// ========================================
// RENDER ALL ENQUIRIES
// ========================================

function renderAllEnquiries() {

    if (!allEnquiriesTableBody) {
        return;
    }


    const searchTerm =
        enquirySearchInput
            ? enquirySearchInput.value
                .trim()
                .toLowerCase()
            : "";


    const selectedStatus =
        allEnquiriesStatusFilter
            ? allEnquiriesStatusFilter.value
            : "All";

                const selectedSort =
        allEnquiriesSort
            ? allEnquiriesSort.value
            : "newest";


    const filteredEnquiries =
        enquiries.filter(
            enquiry => {

                const matchesStatus =
                    selectedStatus === "All" ||
                    enquiry.status === selectedStatus;


                const searchableText = [
                    enquiry.name,
                    enquiry.business,
                    enquiry.email,
                    enquiry.phone,
                    ...(Array.isArray(enquiry.services)
                        ? enquiry.services
                        : [])
                ]
                    .filter(Boolean)
                    .join(" ")
                    .toLowerCase();


                const matchesSearch =
                    !searchTerm ||
                    searchableText.includes(
                        searchTerm
                    );


                return (
                    matchesStatus &&
                    matchesSearch
                );

            }
        );

            // ========================================
    // SORT ENQUIRIES
    // ========================================

    filteredEnquiries.sort((a, b) => {

        switch (selectedSort) {

            case "oldest":
                return getEnquiryTime(a) -
                    getEnquiryTime(b);

            case "nameAZ":
                return (a.name || "")
                    .localeCompare(b.name || "");

            case "nameZA":
                return (b.name || "")
                    .localeCompare(a.name || "");

            case "budgetHigh":
                return getBudgetValue(b.budget) -
                    getBudgetValue(a.budget);

            case "budgetLow":
                return getBudgetValue(a.budget) -
                    getBudgetValue(b.budget);

            case "newest":
            default:
                return getEnquiryTime(b) -
                    getEnquiryTime(a);
        }

    });


    if (enquiryResultCount) {

        enquiryResultCount.textContent =
            `${filteredEnquiries.length} ${
                filteredEnquiries.length === 1
                    ? "enquiry"
                    : "enquiries"
            }`;

    }


    if (filteredEnquiries.length === 0) {

        allEnquiriesTableBody.innerHTML = `
            <tr>
                <td
                    colspan="6"
                    class="crm-empty-row"
                >
                    No enquiries found.
                </td>
            </tr>
        `;

        return;

    }


    allEnquiriesTableBody.innerHTML =
        filteredEnquiries
            .map(
                enquiry =>
                    createEnquiryRow(enquiry)
            )
            .join("");


    attachViewButtons();

}


// ========================================
// CREATE TABLE ROW
// ========================================

function createEnquiryRow(enquiry) {

    const receivedDate =
        formatDate(enquiry.createdAt);


    const business =
        enquiry.business ||
        "No business name";


    const budget =
        enquiry.budget ||
        "Not specified";


    const services =
        Array.isArray(enquiry.services)
            ? enquiry.services.join(", ")
            : "Not specified";


    const statusClass =
        getStatusClass(enquiry.status);


    return `
        <tr>

            <td>

                <span class="crm-client-name">
                    ${escapeHTML(enquiry.name)}
                </span>

                <span class="crm-client-business">
                    ${escapeHTML(business)}
                </span>

            </td>


            <td class="crm-service-list">
                ${escapeHTML(services)}
            </td>


            <td>
                ${escapeHTML(budget)}
            </td>


            <td>
                ${receivedDate}
            </td>


            <td>

                <span
                    class="crm-status ${statusClass}"
                >
                    ${escapeHTML(
                        enquiry.status || "New"
                    )}
                </span>

            </td>


            <td>

                <button
                    class="crm-view-button"
                    data-id="${enquiry.id}"
                    type="button"
                >
                    View
                </button>

            </td>

        </tr>
    `;

}


// ========================================
// FILTER
// ========================================

statusFilter.addEventListener(
    "change",
    renderEnquiries
);

// ========================================
// ALL ENQUIRIES SEARCH + FILTER
// ========================================

if (enquirySearchInput) {

    enquirySearchInput.addEventListener(
        "input",
        renderAllEnquiries
    );

}


if (allEnquiriesStatusFilter) {

    allEnquiriesStatusFilter.addEventListener(
        "change",
        renderAllEnquiries
    );

}

if (allEnquiriesSort) {
    allEnquiriesSort.addEventListener(
        "change",
        renderAllEnquiries
    );
}


// ========================================
// VIEW ENQUIRY
// ========================================

function attachViewButtons() {

    const buttons =
        document.querySelectorAll(
            ".crm-view-button"
        );


    buttons.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    const enquiry =
                        enquiries.find(
                            item =>
                                item.id ===
                                button.dataset.id
                        );


                    if (enquiry) {

                        openEnquiry(enquiry);

                    }

                }
            );

        }
    );

}


function openEnquiry(enquiry) {

    modalClientName.textContent =
        enquiry.name || "Client";


    const receivedDate =
        formatDateTime(enquiry.createdAt);


    const services =
        Array.isArray(enquiry.services)
            ? enquiry.services.join(", ")
            : "Not specified";


    const currentStatus =
        enquiry.status || "New";


    modalContent.innerHTML = `

        <!-- =========================
             LEAD STATUS
        ========================== -->

        <div class="crm-lead-management">

            <div class="crm-lead-management-heading">

                <div>

                    <span>
                        LEAD STATUS
                    </span>

                    <p>
                        Update where this opportunity
                        currently sits in your pipeline.
                    </p>

                </div>

                <span
                    class="crm-status
                    ${getStatusClass(currentStatus)}"
                    id="modalStatusBadge"
                >
                    ${escapeHTML(currentStatus)}
                </span>

            </div>


            <div class="crm-status-control">

                <select id="modalStatusSelect">

                    <option
                        value="New"
                        ${currentStatus === "New"
                            ? "selected"
                            : ""}
                    >
                        New
                    </option>

                    <option
                        value="Contacted"
                        ${currentStatus === "Contacted"
                            ? "selected"
                            : ""}
                    >
                        Contacted
                    </option>

                    <option
                        value="Quote Sent"
                        ${currentStatus === "Quote Sent"
                            ? "selected"
                            : ""}
                    >
                        Quote Sent
                    </option>

                    <option
                        value="Won"
                        ${currentStatus === "Won"
                            ? "selected"
                            : ""}
                    >
                        Won
                    </option>

                    <option
                        value="Lost"
                        ${currentStatus === "Lost"
                            ? "selected"
                            : ""}
                    >
                        Lost
                    </option>

                </select>


                <button
                    type="button"
                    class="crm-save-status-button"
                    id="saveEnquiryStatus"
                >
                    Save Status
                    <span>→</span>
                </button>

            </div>


            <div
                class="crm-status-message"
                id="statusUpdateMessage"
            ></div>

        </div>



        <!-- =========================
             CONTACT ACTIONS
        ========================== -->

        <div class="crm-contact-actions">

            <a
                href="mailto:${escapeHTML(
                    enquiry.email || ""
                )}"
                class="crm-contact-action"
            >
                <span>✉</span>
                Email Customer
            </a>


            ${
                enquiry.phone

                    ? `
                        <a
                            href="tel:${escapeHTML(
                                sanitisePhone(
                                    enquiry.phone
                                )
                            )}"
                            class="crm-contact-action"
                        >
                            <span>☎</span>
                            Call Customer
                        </a>
                    `

                    : ""
            }


            ${
                enquiry.website

                    ? `
                        <a
                            href="${escapeHTML(
                                normaliseWebsite(
                                    enquiry.website
                                )
                            )}"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="crm-contact-action"
                        >
                            <span>↗</span>
                            Visit Website
                        </a>
                    `

                    : ""
            }

        </div>



        <!-- =========================
             CUSTOMER DETAILS
        ========================== -->

        <div class="crm-detail-grid">

            ${detailItem(
                "Business",
                enquiry.business ||
                "Not provided"
            )}

            ${detailItem(
                "Email",
                enquiry.email ||
                "Not provided"
            )}

            ${detailItem(
                "Phone",
                enquiry.phone ||
                "Not provided"
            )}

            ${detailItem(
                "Budget",
                enquiry.budget ||
                "Not specified"
            )}

            ${detailItem(
                "Website",
                enquiry.website ||
                "Not provided"
            )}

            ${detailItem(
                "Received",
                receivedDate
            )}

        </div>



        <!-- =========================
             SERVICES
        ========================== -->

        <div class="crm-detail-section">

            <span>
                SERVICES
            </span>

            <p>
                ${escapeHTML(services)}
            </p>

        </div>



        <!-- =========================
             PROJECT DETAILS
        ========================== -->

        <div class="crm-detail-section">

            <span>
                PROJECT DETAILS
            </span>

            <p>
                ${escapeHTML(
                    enquiry.message ||
                    "No project details provided."
                )}
            </p>

        </div>

        <!-- =========================
     INTERNAL NOTES
========================== -->

<div class="crm-notes-section">

    <div class="crm-notes-heading">

        <div>

            <span>
                INTERNAL NOTES
            </span>

            <p>
                Notes are only visible to ACT Digital staff.
            </p>

        </div>

        <span class="crm-notes-count">
            ${
                Array.isArray(enquiry.notes)
                    ? enquiry.notes.length
                    : 0
            }
            ${
                Array.isArray(enquiry.notes) &&
                enquiry.notes.length === 1
                    ? "NOTE"
                    : "NOTES"
            }
        </span>

    </div>


    <!-- ADD NOTE -->

    <div class="crm-add-note">

        <textarea
            id="newInternalNote"
            rows="4"
            maxlength="2000"
            placeholder="Add an internal note about this lead..."
        ></textarea>


        <div class="crm-add-note-bottom">

            <span>
                This will be saved to the customer record.
            </span>

            <button
                type="button"
                id="saveInternalNote"
                class="crm-save-note-button"
            >
                Add Note
                <span>+</span>
            </button>

        </div>


        <div
            id="noteSaveMessage"
            class="crm-note-message"
        ></div>

    </div>


    <!-- EXISTING NOTES -->

    <div
        class="crm-notes-list"
        id="internalNotesList"
    >

        ${renderInternalNotes(enquiry.notes)}

    </div>

</div>

    `;


    enquiryModal.classList.add("open");


    // ---------------------------------
    // STATUS UPDATE
    // ---------------------------------

    const saveStatusButton =
        document.getElementById(
            "saveEnquiryStatus"
        );


    if (saveStatusButton) {

        saveStatusButton.addEventListener(
            "click",
            () => {

                updateEnquiryStatus(
                    enquiry.id
                );

            }
        );

    }


// ---------------------------------
// INTERNAL NOTES
// ---------------------------------

const saveNoteButton =
    document.getElementById(
        "saveInternalNote"
    );


if (saveNoteButton) {

    saveNoteButton.addEventListener(
        "click",
        () => {

            saveInternalNote(
                enquiry.id
            );

        }
    );

}

}

// ========================================
// UPDATE ENQUIRY STATUS
// ========================================

async function updateEnquiryStatus(enquiryId) {

    const statusSelect =
        document.getElementById(
            "modalStatusSelect"
        );

    const saveButton =
        document.getElementById(
            "saveEnquiryStatus"
        );

    const statusMessage =
        document.getElementById(
            "statusUpdateMessage"
        );


    if (
        !statusSelect ||
        !saveButton
    ) {
        return;
    }


    const newStatus =
        statusSelect.value;


    const allowedStatuses = [
        "New",
        "Contacted",
        "Quote Sent",
        "Won",
        "Lost"
    ];


    if (
        !allowedStatuses.includes(
            newStatus
        )
    ) {
        return;
    }


    const originalButton =
        saveButton.innerHTML;


    saveButton.disabled = true;

    saveButton.textContent =
        "Saving...";


    if (statusMessage) {

        statusMessage.textContent = "";

        statusMessage.className =
            "crm-status-message";

    }


    try {

        const enquiryReference =
            doc(
                db,
                "enquiries",
                enquiryId
            );


        await updateDoc(
            enquiryReference,
            {
                status: newStatus,
                statusUpdatedAt:
                    serverTimestamp()
            }
        );


        // Update badge immediately.

        const statusBadge =
            document.getElementById(
                "modalStatusBadge"
            );


        if (statusBadge) {

            statusBadge.textContent =
                newStatus;

            statusBadge.className =
                `crm-status ${getStatusClass(
                    newStatus
                )}`;

        }


        if (statusMessage) {

            statusMessage.textContent =
                `Status updated to "${newStatus}".`;

            statusMessage.className =
                "crm-status-message success";

        }


    } catch (error) {

        console.error(
            "Unable to update enquiry status:",
            error
        );


        if (statusMessage) {

            statusMessage.textContent =
                "Unable to update the status. Please try again.";

            statusMessage.className =
                "crm-status-message error";

        }


    } finally {

        saveButton.disabled = false;

        saveButton.innerHTML =
            originalButton;

    }

}

// ========================================
// INTERNAL NOTES
// ========================================

async function saveInternalNote(enquiryId) {

    const noteInput =
        document.getElementById(
            "newInternalNote"
        );

    const saveButton =
        document.getElementById(
            "saveInternalNote"
        );

    const noteMessage =
        document.getElementById(
            "noteSaveMessage"
        );


    if (
        !noteInput ||
        !saveButton
    ) {
        return;
    }


    const noteText =
        noteInput.value.trim();


    if (!noteText) {

        showNoteMessage(
            "Please enter a note before saving.",
            "error"
        );

        return;

    }


    if (noteText.length > 2000) {

        showNoteMessage(
            "Notes cannot exceed 2,000 characters.",
            "error"
        );

        return;

    }


    const user =
        auth.currentUser;


    if (!user) {

        showNoteMessage(
            "Your login session has expired. Please sign in again.",
            "error"
        );

        return;

    }


    const originalButton =
        saveButton.innerHTML;


    saveButton.disabled = true;

    saveButton.textContent =
        "Saving...";


    try {

        const enquiryReference =
            doc(
                db,
                "enquiries",
                enquiryId
            );


        const note = {

            text: noteText,

            addedBy:
                user.email ||
                "ACT Digital Staff",

            addedAt:
                new Date().toISOString()

        };


        await updateDoc(
            enquiryReference,
            {

                notes:
                    arrayUnion(note),

                lastActivityAt:
                    serverTimestamp()

            }
        );


        noteInput.value = "";


        showNoteMessage(
            "Note added successfully.",
            "success"
        );


        // Add the new note to the screen
        // immediately.

        const notesList =
            document.getElementById(
                "internalNotesList"
            );


        if (notesList) {

            const emptyState =
                notesList.querySelector(
                    ".crm-notes-empty"
                );


            if (emptyState) {

                emptyState.remove();

            }


            notesList.insertAdjacentHTML(
                "afterbegin",
                createNoteHTML(note)
            );

        }


    } catch (error) {

        console.error(
            "Unable to save internal note:",
            error
        );


        showNoteMessage(
            "Unable to save the note. Please try again.",
            "error"
        );


    } finally {

        saveButton.disabled = false;

        saveButton.innerHTML =
            originalButton;

    }

}

function renderInternalNotes(notes) {

    if (
        !Array.isArray(notes) ||
        notes.length === 0
    ) {

        return `
            <div class="crm-notes-empty">

                <span>◎</span>

                <p>
                    No internal notes yet.
                </p>

                <small>
                    Add the first note above.
                </small>

            </div>
        `;

    }


    const sortedNotes =
        [...notes].sort(
            (a, b) => {

                return new Date(b.addedAt) -
                    new Date(a.addedAt);

            }
        );


    return sortedNotes
        .map(note => createNoteHTML(note))
        .join("");

}


function createNoteHTML(note) {

    return `
        <article class="crm-note">

            <div class="crm-note-marker">
                <span></span>
            </div>


            <div class="crm-note-content">

                <p>
                    ${escapeHTML(
                        note.text || ""
                    )}
                </p>


                <div class="crm-note-meta">

                    <span>
                        ${escapeHTML(
                            note.addedBy ||
                            "ACT Digital Staff"
                        )}
                    </span>

                    <i></i>

                    <span>
                        ${formatNoteDate(
                            note.addedAt
                        )}
                    </span>

                </div>

            </div>

        </article>
    `;

}


function formatNoteDate(dateValue) {

    if (!dateValue) {

        return "Just now";

    }


    const date =
        new Date(dateValue);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "Just now";

    }


    return date.toLocaleString(
        "en-ZA",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        }
    );

}


function showNoteMessage(
    message,
    type
) {

    const noteMessage =
        document.getElementById(
            "noteSaveMessage"
        );


    if (!noteMessage) {
        return;
    }


    noteMessage.textContent =
        message;


    noteMessage.className =
        `crm-note-message ${type}`;

}


// ========================================
// MODAL
// ========================================

closeEnquiryModal.addEventListener(
    "click",
    closeModal
);


enquiryModal.addEventListener(
    "click",
    (event) => {

        if (event.target === enquiryModal) {

            closeModal();

        }

    }
);


document.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key === "Escape" &&
            enquiryModal.classList.contains(
                "open"
            )
        ) {

            closeModal();

        }

    }
);


function closeModal() {

    enquiryModal.classList.remove("open");

}


// ========================================
// LOGOUT
// ========================================

logoutButton.addEventListener(
    "click",
    async () => {

        try {

            await signOut(auth);

            window.location.href =
                "admin.html";

        } catch (error) {

            console.error(
                "Unable to sign out:",
                error
            );

        }

    }
);

// ========================================
// ENQUIRY SORTING HELPERS
// ========================================

function getEnquiryTime(enquiry) {

    if (!enquiry.createdAt) {
        return 0;
    }

    if (
        typeof enquiry.createdAt.toMillis ===
        "function"
    ) {
        return enquiry.createdAt.toMillis();
    }

    if (enquiry.createdAt.seconds) {
        return enquiry.createdAt.seconds * 1000;
    }

    return 0;
}


function getBudgetValue(budget) {

    const budgetValues = {
        "Not sure yet": 0,
        "Under R5,000": 4999,
        "R5,000–R10,000": 10000,
        "R10,000–R20,000": 20000,
        "R20,000–R40,000": 40000,
        "R40,000+": 40001
    };

    return budgetValues[budget] ?? 0;
}


// ========================================
// HELPERS
// ========================================

function detailItem(label, value) {

    return `
        <div class="crm-detail-item">

            <span>
                ${escapeHTML(label)}
            </span>

            <strong>
                ${escapeHTML(value)}
            </strong>

        </div>
    `;

}


function formatDate(timestamp) {

    if (
        !timestamp ||
        typeof timestamp.toDate !==
            "function"
    ) {

        return "Just now";

    }


    return timestamp
        .toDate()
        .toLocaleDateString(
            "en-ZA",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );

}

function formatDateTime(timestamp) {

    if (
        !timestamp ||
        typeof timestamp.toDate !==
            "function"
    ) {

        return "Just now";

    }


    return timestamp
        .toDate()
        .toLocaleString(
            "en-ZA",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            }
        );

}


function sanitisePhone(phone) {

    return String(phone)
        .replace(
            /[^\d+]/g,
            ""
        );

}


function normaliseWebsite(website) {

    const value =
        String(website).trim();


    if (
        value.startsWith("http://") ||
        value.startsWith("https://")
    ) {

        return value;

    }


    return `https://${value}`;

}


function getStatusClass(status) {

    switch (status) {

        case "New":
            return "crm-status-new";

        case "Contacted":
            return "crm-status-contacted";

        case "Quote Sent":
            return "crm-status-quote-sent";

        case "Won":
            return "crm-status-won";

        case "Lost":
            return "crm-status-lost";

        default:
            return "";

    }

}


function escapeHTML(value) {

    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}

