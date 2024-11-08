function addClient() {
  // Get form and response message elements
  const form = document.getElementById("addClientForm");
  const responseMessage = document.getElementById("responseMessage");

  // Exit if the form element is not found
  if (!form) return;

  // Add an event listener to handle form submission
  form.addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent default form submission behavior

    // Collect form data
    const formData = {
      name: document.getElementById("name").value.trim(), // Trim whitespace from name input
    };

    // Validate form data to ensure 'name' is provided
    if (!formData.name) {
      responseMessage.innerHTML = `<div class="alert alert-danger">Please enter a client name.</div>`;
      return; // Stop execution if validation fails
    }

    try {
      // Send form data to server using the fetch API
      const response = await fetch("/add-client", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Set content type to JSON
        },
        body: JSON.stringify(formData), // Convert formData object to JSON string
      });

      // Check if the response status is OK (200-299)
      if (response.ok) {
        const result = await response.json();
        responseMessage.innerHTML = `<div class="alert alert-success">${result.message}</div>`;

        // Redirect to the home page after successful submission
        window.location.href = `./client-form/${result.clientId}#link-contact`;
      } else {
        // Handle errors returned by the server
        const error = await response.json();
        responseMessage.innerHTML = `<div class="alert alert-danger">Error: ${error.message}</div>`;
      }
    } catch (err) {
      // Catch any errors that occur during the fetch request
      console.error("Error:", err);
      responseMessage.innerHTML = `<div class="alert alert-danger">An error occurred. Please try again later.</div>`;
    }
  });
}

async function addContact() {
  // Get form and response message elements
  const form = document.getElementById("addContactForm");
  const responseMessage = document.getElementById("responseMessage");

  // Exit if the form element is not found
  if (!form) return;

  // Add an event listener to handle form submission
  form.addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent default form submission behavior

    // Collect form data
    const formData = {
      name: document.getElementById("name").value.trim(),
      surname: document.getElementById("surname").value.trim(),
      email: document.getElementById("email").value.trim(),
    };

    // Validate form data for required fields
    if (!formData.name) {
      responseMessage.innerHTML = `<div class="alert alert-danger">Please enter a name.</div>`;
      return;
    }

    if (!formData.surname) {
      responseMessage.innerHTML = `<div class="alert alert-danger">Please enter a surname.</div>`;
      return;
    }

    // Email validation using a regular expression
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      responseMessage.innerHTML = `<div class="alert alert-danger">Please enter a valid email address.</div>`;
      return;
    }

    try {
      // Send form data to the server using the fetch API
      const response = await fetch("/create-contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData), // Convert formData to JSON format
      });

      // Check if the response status is OK (200-299)
      if (response.ok) {
        const result = await response.json();
        responseMessage.innerHTML = `<div class="alert alert-success">${result.message}</div>`;

        // Redirect to the contacts page after successful submission
        window.location.href = `./contact-form/${result.contactId}#link-client`;
      } else {
        // Handle errors returned by the server
        const error = await response.json();
        responseMessage.innerHTML = `<div class="alert alert-danger">Error: ${error.message}</div>`;
      }
    } catch (err) {
      // Catch any errors that occur during the fetch request
      console.error("Error:", err);
      responseMessage.innerHTML = `<div class="alert alert-danger">An error occurred. Please try again later.</div>`;
    }
  });
}

async function linkContactsToClient() {
  const selectedContacts = Array.from(
    document.getElementById("contactSelect").selectedOptions
  ).map((option) => option.value);
  const clientId = document.getElementById("hidden-input").value;

  if (!selectedContacts.length || !clientId) {
    alert("Please select at least one contact to link.");
    return;
  }

  try {
    const response = await fetch(`/link-contacts/${clientId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ contactIds: selectedContacts }),
    });

    if (response.ok) {
      location.href = `./${clientId}?show=contacts`;
    } else {
      const error = await response.json();
      document.getElementById(
        "responseMessage"
      ).innerHTML = `<div class="alert alert-danger">${error.message}</div>`;
    }
  } catch (error) {
    console.error("Error linking contacts:", error);
    document.getElementById(
      "responseMessage"
    ).innerHTML = `<div class="alert alert-danger">An error occurred. Please try again.</div>`;
  }
}

async function linkClientsToContact() {
  const selectedClients = Array.from(
    document.getElementById("clientSelect").selectedOptions
  ).map((option) => option.value);
  const contactId = document.getElementById("hidden-input").value;

  if (!selectedClients.length || !contactId) {
    alert("Please select at least one client to link.");
    return;
  }

  try {
    const response = await fetch(`/link-clients/${contactId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ clientIds: selectedClients }),
    });

    if (response.ok) {
      location.href = `./${contactId}?show=clients`;
    } else {
      const error = await response.json();
      document.getElementById(
        "responseMessage"
      ).innerHTML = `<div class="alert alert-danger">${error.message}</div>`;
    }
  } catch (error) {
    console.error("Error linking clients:", error);
    document.getElementById(
      "responseMessage"
    ).innerHTML = `<div class="alert alert-danger">An error occurred. Please try again.</div>`;
  }
}

// Initialize event listeners for the addClient and addContact forms once the document is fully loaded
document.addEventListener("DOMContentLoaded", function () {
  addClient();
  addContact();

  const linkContactBtn = document.getElementById("link-contacts");
  if (linkContactBtn) {
    linkContactBtn.addEventListener("click", linkContactsToClient);
  }

  const linkClientBtn = document.getElementById("link-clients");
  if (linkClientBtn) {
    linkClientBtn.addEventListener("click", linkClientsToContact);
  }
});
