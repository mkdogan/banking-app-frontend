# Online Banking Application – Frontend

## Overview

This repository contains the **frontend application** of the Online Banking Application.

The frontend is built using **React** and provides a clean, role-aware user interface for both **clients** and **operators**, communicating with the backend through RESTful APIs.

The application focuses on usability, clear separation of roles and **secure interaction** with the backend services.

## Technologies Used

* React

* TypeScript

* Vite

* HTML5 / CSS3

* Context API

* Fetch API

## Application Structure

The frontend is organized into role-based and feature-based modules:

src/</br>
 ├─ api/</br>
 ├─ components/</br>
 ├─ context/</br>
 └─ pages/</br>
 &emsp;&emsp;└─ operator/</br>

### Key Directories

**api/**

  * Backend API calls

  * Authentication and domain services

**components/**

  * Reusable UI components

**context/**

  * Global authentication state (AuthContext)

**pages/**

  * Client-facing pages

**pages/operator/**

  * Operator-specific pages

## Role-Based UI Design

The application provides **separate user experiences** for each role:

**👤 Client Interface**

* Client login page

* View personal accounts and cards

* Perform deposits, withdrawals, and transfers

* View transaction history

**🛠️ Operator Interface**

* Dedicated operator login page

* Operator dashboard

* Client management

* Account and card management

* Transaction monitoring

*Note: Operator pages should be accessible only from validated networks.*

## Authentication & Authorization

* JWT-based authentication handled by the backend

* Authentication state stored in a global AuthContext

Role-based rendering:

  * Operator pages are hidden from client users

  * Unauthorized access is prevented at the routing level

* Secure communication with backend endpoints

## UI / UX Considerations

* Simple and clean layout

* Clear navigation between pages

* Distinct separation between client and operator workflows

* Error handling for invalid operations

* User-friendly forms and feedback messages

## Integration with Backend

The frontend communicates with the backend through RESTful APIs:

* Authentication endpoints

* Client, account, card, and transaction endpoints

* Secure requests with proper authorization handling

**Backend Repository:**
You can look for backend repository from [here](https://github.com/mkdogan/banking-app-backend)

## Development Notes

* Frontend implementation were developed with the assistance of AI-integrated coding tools

* The project prioritizes clarity and maintainability over visual complexity

* UI components are kept reusable where possible

* State management is intentionally lightweight
