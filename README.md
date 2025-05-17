Project Overview
This project is a full-stack web application designed to scrape product data from StockX based on user-provided URLs. The frontend allows users to input StockX URLs, initiate the scraping process, and view the scraped data in a table format. Users can also export the data in CSV or JSON formats.

The backend is built using Node.js and utilizes Playwright for web scraping. The frontend is developed with Next.js and Tailwind CSS to ensure a clean and responsive user interface.

Challenges Faced and Unaccomplished Goals:
Deployment Challenges:
After deploying the backend on Render and frontend on Vercel, I encountered issues with the backend not responding properly. Despite several attempts, I was unable to resolve the issue, preventing the backend from functioning as expected in the deployed environment.

Data Fetching Issues:
While I was able to scrape certain data such as product images, product names, and descriptions, I encountered difficulties fetching product sizes. Despite implementing various solutions, this aspect could not be fully accomplished.

Technologies Used:
Next.js for the full-stack web application.
Node.js for backend logic and server-side data fetching.
Playwright for web scraping, enabling the extraction of product data from StockX.

Features Implemented:
Scraping Service:
The backend uses Playwright to scrape product data from StockX, extracting information like product name, market price, description, brand name, product details, and images.

Frontend:
Designed with Tailwind CSS for a clean and modern user interface.
URL input field for users to provide product URLs from StockX.
Submit button to initiate the scraping process.
A loading state indicator to inform users of the ongoing process.
Error display functionality to notify users in case of failure.
A results table that displays the scraped data with features like sorting and filtering.

Data Export Functionality:
Users can download the scraped data in both CSV and JSON formats.

Learning and Insights:
First Scraping Project:
This was my first experience working on a scraping project. I learned about the scraping process, how to extract data from websites, and how to handle selectors for identifying and extracting the required information.

Client and Server-Side Interaction:
I gained hands-on experience with client-server communication, particularly the challenges involved in data transfer between the backend (scraping service) and frontend (user interface).

Note:
Due to deployment issues, I was unable to successfully deploy the project. However, I am submitting a recording that provides an overview of the project and its functionality.
