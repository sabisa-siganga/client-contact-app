# Client Management System

A web application built with JavaScript (Node.js) for managing clients and their associated contacts. This application allows users to view, add, and edit client information, as well as link contacts to each client for streamlined management.

## Features

- **Client List**: View a table of all clients with options to add, view details, or link contacts.
- **Add Client**: Add new clients with a unique client code.
- **Contact Management**: Link multiple contacts to each client and view or unlink them as needed.
- **Tabs and Navigation**: Tabs for easy navigation between general information and contact lists.
- **Responsive Design**: The app is fully responsive, providing an optimal experience across all devices.

## Technologies Used

- **Backend**: JavaScript (Node.js), Express.js
- **Templating Engine**: EJS (Embedded JavaScript templates)
- **Styling**: CSS, Bootstrap
- **Database Management**: Sequelize ORM (MySQL/PostgreSQL)

## Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/client-management-system.git
   cd client-management-system

   ```

2. **Install dependencies**
   npm install

3. **Configure environment variables**
   Create a .env file in the root directory and add the following variables:

PORT=4000
DATABASE_URL=your_database_url

4. **Run database migrations**
   npx sequelize-cli db:migrate

5. **Start the server**
   npm start

   The app will be available at http://localhost:4000

## Usage

Navigate to /: Access the list of clients.
Add a new client: Click "Add Client" to enter client details.
View and edit clients: Select a client to view details or link contacts.
Link contacts: In the "Contacts" tab, link new contacts to the client.
View and edit clients: Select a client to view details or link contacts.
Link contacts: In the "Contacts" tab, link new contacts to the client.

## Thought Process

When building this application, the following steps and decisions guided the architecture and development process:

1. **Requirements Analysis:**

The primary goal was to create an application that allows users to manage clients and link contacts to them, making the system suitable for a wide range of business use cases.
Key requirements were identified: listing clients, adding and editing client details, managing contact information, and linking/unlinking contacts.

2. **Database Design:**

Given the relationship between clients and contacts, a relational database was chosen to handle structured data.
Sequelize ORM was used to simplify database interactions, with a Client model for client information and a Contact model to manage associated contacts. A junction table (ClientContact) enables a many-to-many relationship, allowing each client to have multiple contacts.

3. **Backend Architecture:**

Express.js was selected for the backend, providing a lightweight framework for managing routes and middleware.
RESTful API principles were applied to route organization, with endpoints for listing clients (/), adding clients (/add-client), and linking contacts (/clients/:id).
Modular Structure: Controllers were separated from routes to create a clean, modular codebase that simplifies maintenance and scaling.

4. **Frontend and Templating:**

EJS was chosen as the templating engine to render dynamic HTML views with client data. This allows the server to generate pages quickly while keeping JavaScript simple on the frontend.
Bootstrap was used to speed up the styling process and ensure a responsive design, enabling the application to function well on different devices.
CSS provides custom styling where needed, complementing Bootstrap’s classes for a cohesive and professional appearance.

5. **User Experience and UI Flow:**

The application layout is simple, featuring a navigation bar and a clean table-based list view for clients, which aligns with typical user expectations in a management interface.
A tabbed view was implemented in the addClient form to separate general client details from contact management, improving usability.
Alerts and modals were added for success/error messages, enhancing the feedback loop for users.

6. **Error Handling and Validation:**

Validation is applied to required fields (like client name) on both the frontend and backend, ensuring that necessary data is always provided.
Errors are logged to the console and displayed to users with descriptive messages, aiding troubleshooting.
