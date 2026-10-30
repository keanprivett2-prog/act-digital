
"use strict";

// ACT Desk Waiting List — Supabase Edge Function
const WAITLIST_API_URL =
  "https://crbtepkpxpoaujerghyq.supabase.co/functions/v1/join-actdesk-waitlist";

// Waiting-list form elements
const waitlistForm = document.getElementById("waitlistForm");
const waitlistEmail = document.getElementById("waitlistEmail");
const waitlistConsent = document.getElementById("waitlistConsent");
const waitlistSubmit = document.getElementById("waitlistSubmit");
const waitlistMessage = document.getElementById("waitlistMessage");

 // Handle waiting-list form submissions
waitlistForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  // Read the visitor's email and consent
  const email = waitlistEmail.value.trim().toLowerCase();
  const consent = waitlistConsent.checked;

  // Validate before continuing
  if (!waitlistForm.checkValidity() || !consent) {
    waitlistForm.reportValidity();
    return;
  }

  
  // Retrieve the Cloudflare Turnstile verification token
  const turnstileWidget = document.querySelector(".cf-turnstile");

  if (!turnstileWidget || typeof window.turnstile === "undefined") {
    waitlistMessage.textContent =
      "Security verification is unavailable. Please refresh and try again.";
    return;
  }

  const turnstileToken = window.turnstile.getResponse(turnstileWidget);

  if (!turnstileToken) {
    waitlistMessage.textContent =
      "Please complete the security verification before continuing.";
    return;
  }

  
  // Submit the verified registration to Supabase
  waitlistSubmit.disabled = true;
  waitlistSubmit.textContent = "Joining...";

  waitlistMessage.textContent = "Submitting your registration...";

  try {
    const response = await fetch(WAITLIST_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        consent: consent,
        turnstileToken: turnstileToken,
      }),
    });

    const result = await response.json();

    if (!response.ok || result.success !== true) {
      throw new Error(
        result.message || "Registration failed. Please try again."
      );
    }

    waitlistMessage.textContent = result.message;

    // Clear the form after successful registration
    waitlistForm.reset();

  } catch (error) {
    console.error("Waiting-list registration failed:", error);

    waitlistMessage.textContent =
      error.message || "Unable to register. Please try again.";

  } finally {
    waitlistSubmit.disabled = false;
    waitlistSubmit.textContent = "Join the Waiting List →";

    // Refresh Turnstile for the next submission attempt
    if (typeof window.turnstile !== "undefined") {
      window.turnstile.reset(turnstileWidget);
    }
  }


});


/* ==========================================
   ACT DESK — SNEAK PEEK TABS
========================================== */

document.addEventListener("DOMContentLoaded", () => {
    const sneakTabs = document.querySelectorAll(".sneak-tab");
    const sneakPanels = document.querySelectorAll(".sneak-panel");

    if (!sneakTabs.length || !sneakPanels.length) {
        return;
    }

    sneakTabs.forEach((tab) => {
        tab.addEventListener("click", () => {
            const selectedPreview = tab.dataset.preview;

            // Update active tab
            sneakTabs.forEach((item) => {
                const isActive = item === tab;

                item.classList.toggle("active", isActive);
                item.setAttribute("aria-pressed", String(isActive));
            });

            // Display selected preview
            sneakPanels.forEach((panel) => {
                const isActive =
                    panel.id === `preview-${selectedPreview}`;

                panel.classList.toggle("active", isActive);
                panel.hidden = !isActive;
            });
        });
    });
});


/* ==========================================
   ACT DESK — LIVE VIEW DEMO ACTIVITY
========================================== */

document.addEventListener("DOMContentLoaded", () => {
    const liveDemo = document.getElementById("sneak-liveview-demo");

    if (!liveDemo) return;

    const activityFeed = liveDemo.querySelector(".sneak-activity");
    const stats = liveDemo.querySelectorAll(".sneak-stat-card strong");

    if (!activityFeed || stats.length < 4) return;

    // All activity is simulated for demonstration purposes.
    const demoEvents = [
        {
            title: "New ticket #1044 created",
            team: "Customer support",
            status: "New",
            type: "new"
        },
        {
            title: "Ticket #1042 assigned",
            team: "Technical support",
            status: "Assigned",
            type: "assigned"
        },
        {
            title: "Ticket #1040 resolved",
            team: "Support team",
            status: "Resolved",
            type: "resolved"
        },
        {
            title: "Ticket #1045 created",
            team: "Helpdesk",
            status: "New",
            type: "new"
        }
    ];

    let eventIndex = 0;

    function updateLivePreview() {
        // Don't update when the Live View tab is hidden.
        if (liveDemo.closest(".sneak-panel")?.hidden) return;

        const event = demoEvents[eventIndex % demoEvents.length];
        eventIndex++;

        const row = document.createElement("div");
        row.className = "sneak-activity-item";

        const dot = document.createElement("span");
        dot.className = "sneak-activity-icon";
        dot.textContent = "●";

        const details = document.createElement("div");

        const title = document.createElement("strong");
        title.textContent = event.title;

        const description = document.createElement("p");
        description.textContent = `${event.team} · Just now`;

        details.append(title, description);

        const tag = document.createElement("span");
        tag.className = "sneak-activity-tag";

        if (event.type === "resolved") {
            tag.classList.add("resolved");
        }

        tag.textContent = event.status;

        row.append(dot, details, tag);

        const header = activityFeed.querySelector(".sneak-activity-header");
        header.insertAdjacentElement("afterend", row);

        // Keep only the latest three activity rows.
        const rows = activityFeed.querySelectorAll(
            ".sneak-activity-item"
        );

        if (rows.length > 3) {
            rows[rows.length - 1].remove();
        }

        // Rotate illustrative statistics.
        const values = [
            [25, 8, 16, 5],
            [25, 9, 16, 5],
            [24, 8, 17, 5],
            [26, 8, 17, 5]
        ];

        const current = values[(eventIndex - 1) % values.length];

        stats.forEach((stat, index) => {
            stat.textContent = current[index];
        });
    }

    const interval = window.setInterval(updateLivePreview, 3000);

    // Stop updates when the page is no longer active.
    window.addEventListener("pagehide", () => {
        window.clearInterval(interval);
    });
});


/* ==========================================
   ACT DESK — WORKFLOW ANIMATION
========================================== */

document.addEventListener("DOMContentLoaded", () => {
    const workflowDemo = document.getElementById(
        "sneak-workflow-demo"
    );

    if (!workflowDemo) return;

    const playButton = document.getElementById(
        "sneak-workflow-play"
    );

    const workflowNodes = Array.from(
        workflowDemo.querySelectorAll(".sneak-workflow-node")
    );

    if (!playButton || !workflowNodes.length) return;

    let isPlaying = false;

    const wait = (ms) =>
        new Promise((resolve) => setTimeout(resolve, ms));

    playButton.addEventListener("click", async () => {
        if (isPlaying) return;

        isPlaying = true;
        playButton.disabled = true;
        playButton.textContent = "Workflow Running...";

        // Reset all workflow stages.
        workflowNodes.forEach((node) => {
            node.classList.remove("active", "completed");
        });

        const reducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        const stepDelay = reducedMotion ? 300 : 1300;

        try {
            for (const node of workflowNodes) {
                node.classList.add("active");

                await wait(stepDelay);

                node.classList.remove("active");
                node.classList.add("completed");
            }

            playButton.textContent = "✓ Workflow Complete";

            await wait(reducedMotion ? 300 : 1500);
        } finally {
            playButton.disabled = false;
            playButton.textContent = "▶ Watch Workflow";
            isPlaying = false;
        }
    });
});
