# GrubDash_project-
Project: GrubDash - API Backend for Food Ordering Platform

GrubDash is a food ordering and delivery startup that aims to provide a seamless experience for customers looking to order their favorite dishes from various restaurants. As a backend developer at GrubDash, your task is to set up the API and build specific routes to handle dish and order data so that frontend developers can demonstrate initial design ideas to the management team.

Your main responsibilities for this project are as follows:

1. Dish Management:
   - Implement API endpoints to handle CRUD (Create, Read, Update, List,Delete dishes is not allowed)operations for dishes.
   - The API should follow RESTful design principles, allowing the frontend to interact with the backend in a standardized manner.
   - Validation must be performed on incoming data to ensure it adheres to the specified requirements (e.g., name, description, price, and image URL must be provided).
   - a new id will be assign when a new dish is created. 

2. Order Management:
   - Build API endpoints to handle CRUD operations for customer orders.
   - Validate incoming order data to ensure that it contains essential information, such as delivery address, mobile number, and dishes to be ordered.
   - Check the status of the order to prevent updates on orders that have already been delivered.

3. Middleware and Error Handling:
   - Create custom middleware functions to handle common tasks across different routes, such as parsing request data and logging.
   - Implement error handling middleware to respond with appropriate status codes and error messages when validation fails or resources are not found.

