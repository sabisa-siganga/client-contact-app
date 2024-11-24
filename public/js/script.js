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

// Function to link selected contacts to a client
async function linkContactsToClient() {
  // Retrieve the list of selected contacts from the "contactSelect" multi-select element
  const selectedContacts = Array.from(
    document.getElementById("contactSelect").selectedOptions
  ).map((option) => option.value); // Map each selected option to its value (contact ID)

  // Get the client ID from a hidden input field in the form
  const clientId = document.getElementById("hidden-input").value;

  // Validation: Ensure at least one contact is selected and a client ID is available
  if (!selectedContacts.length || !clientId) {
    alert("Please select at least one contact to link.");
    return; // Exit the function if validation fails
  }

  try {
    // Send the selected contacts and client ID to the server for linking
    const response = await fetch(`/link-contacts/${clientId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ contactIds: selectedContacts }), // Send contact IDs in the request body
    });

    // Check if the response is successful
    if (response.ok) {
      // Redirect to the client's page with "contacts" tab displayed after successful linking
      location.href = `./${clientId}?show=contacts`;
    } else {
      // Display an error message if the server responds with an error
      const error = await response.json();
      document.getElementById(
        "responseMessage"
      ).innerHTML = `<div class="alert alert-danger">${error.message}</div>`;
    }
  } catch (error) {
    // Log the error and display a user-friendly error message in case of failure
    console.error("Error linking contacts:", error);
    document.getElementById(
      "responseMessage"
    ).innerHTML = `<div class="alert alert-danger">An error occurred. Please try again.</div>`;
  }
}

// Function to link selected clients to a contact
async function linkClientsToContact() {
  // Retrieve the list of selected clients from the "clientSelect" multi-select element
  const selectedClients = Array.from(
    document.getElementById("clientSelect").selectedOptions
  ).map((option) => option.value); // Map each selected option to its value (client ID)

  // Get the contact ID from a hidden input field in the form
  const contactId = document.getElementById("hidden-input").value;

  // Validation: Ensure at least one client is selected and a contact ID is available
  if (!selectedClients.length || !contactId) {
    alert("Please select at least one client to link.");
    return; // Exit the function if validation fails
  }

  try {
    // Send the selected clients and contact ID to the server for linking
    const response = await fetch(`/link-clients/${contactId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ clientIds: selectedClients }), // Send client IDs in the request body
    });

    // Check if the response is successful
    if (response.ok) {
      // Redirect to the contact's page with "clients" tab displayed after successful linking
      location.href = `./${contactId}?show=clients`;
    } else {
      // Display an error message if the server responds with an error
      const error = await response.json();
      document.getElementById(
        "responseMessage"
      ).innerHTML = `<div class="alert alert-danger">${error.message}</div>`;
    }
  } catch (error) {
    // Log the error and display a user-friendly error message in case of failure
    console.error("Error linking clients:", error);
    document.getElementById(
      "responseMessage"
    ).innerHTML = `<div class="alert alert-danger">An error occurred. Please try again.</div>`;
  }
}

// Initialize event listeners once the document is fully loaded
document.addEventListener("DOMContentLoaded", function () {
  // Initialize form functions to add clients and contacts
  addClient();
  addContact();

  // Add click event listener to the "link contacts" button if it exists
  const linkContactBtn = document.getElementById("link-contacts");
  if (linkContactBtn) {
    linkContactBtn.addEventListener("click", linkContactsToClient);
  }

  // Add click event listener to the "link clients" button if it exists
  const linkClientBtn = document.getElementById("link-clients");
  if (linkClientBtn) {
    linkClientBtn.addEventListener("click", linkClientsToContact);
  }
});

function filterClientList() {
  // Get the search query
  const searchInput = document
    .getElementById("searchClientInput")
    .value.toLowerCase();
  const clientSelect = document.getElementById("clientSelect");
  const options = clientSelect.options;
  const noClientsMessage = document.getElementById("noClientsMessage");

  let hasVisibleOptions = false; // Track if any options are visible

  // Loop through all the options and show/hide based on the search query
  for (let i = 0; i < options.length; i++) {
    const optionText = options[i].textContent.toLowerCase();
    if (optionText.includes(searchInput)) {
      options[i].style.display = ""; // Show option
      hasVisibleOptions = true; // At least one option is visible
    } else {
      options[i].style.display = "none"; // Hide option
    }
  }

  // Show or hide the "No clients found" message based on visible options
  if (hasVisibleOptions) {
    noClientsMessage.style.display = "none"; // Hide the message
  } else {
    noClientsMessage.style.display = "block"; // Show the message
  }
}
