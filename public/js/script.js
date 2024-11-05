function addClient() {
  const form = document.getElementById("addClientForm");
  const responseMessage = document.getElementById("responseMessage");

  form.addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent default form submission

    // Collect form data
    const formData = {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      phone: document.getElementById("phone").value,
    };

    try {
      // Send form data using fetch API
      const response = await fetch("/add-client", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      // Check if the response is ok (status 200-299)
      if (response.ok) {
        const result = await response.json();
        responseMessage.innerHTML = `<div class="alert alert-success">Client added successfully!</div>`;
        form.reset(); // Reset the form fields
      } else {
        const error = await response.json();
        responseMessage.innerHTML = `<div class="alert alert-danger">Error: ${error.message}</div>`;
      }
    } catch (err) {
      console.error("Error:", err);
      responseMessage.innerHTML = `<div class="alert alert-danger">An error occurred. Please try again later.</div>`;
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  addClient();
});
