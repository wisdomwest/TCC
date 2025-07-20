
# Software Requirements Specification (SRS)

## 1. Introduction

### 1.1 Purpose

This document provides a detailed description of the requirements for the Logistics and Transportation Company's application. It is intended for a variety of audiences, including developers, project managers, and testers, to ensure a common understanding of the system's functionality and constraints.

### 1.2 Scope

The software is designed to manage the core operations of a logistics and transportation company. The key functionalities include:

*   **User Management**: Registration and login for staff and managers.
*   **Branch Management**: Creation and tracking of company branches.
*   **Truck Management**: Tracking of truck status, location, and capacity.
*   **Consignment Management**: Creation, tracking, and status updates for consignments.
*   **Invoice Management**: Generation of invoices for each consignment.
*   **Dispatch Management**: Creation and management of dispatches, which are collections of consignments assigned to a truck.

### 1.3 Intended Audience and Document Use

*   **Developers**: To understand the system's requirements and implement the features accordingly.
*   **Project Managers**: To oversee the project and ensure that the development aligns with the specified requirements.
*   **Testers**: To create test cases and verify that the system meets the defined requirements.

### 1.4 Definitions, Acronyms, and Abbreviations

*   **SRS**: Software Requirements Specification
*   **API**: Application Programming Interface
*   **HQ**: Headquarters
*   **UI**: User Interface

### 1.5 References

*   [API Documentation](API_DOCUMENTATION.md)
*   [Database Design](database.md)

### 1.6 Document Overview

This document is organized into the following sections:

*   **Introduction**: Provides an overview of the SRS document.
*   **Overall Description**: Describes the product perspective, functions, user characteristics, and constraints.
*   **Functional Requirements**: Details the specific functional requirements of the system.
*   **Non-Functional Requirements**: Outlines the non-functional requirements, such as performance, security, and reliability.
*   **External Interface Requirements**: Describes the system's external interfaces.

## 2. Overall Description

### 2.1 System or Product Perspective

The application is a self-contained system that provides a centralized platform for managing the company's logistics operations. It is designed to be used by internal staff and managers to streamline their daily tasks.

### 2.2 System or Product Functions

The major functions of the system are:

*   **User Authentication**: Secure user registration and login.
*   **Branch Management**: Centralized management of company branches.
*   **Truck Fleet Management**: Real-time tracking of the truck fleet.
*   **Consignment Tracking**: End-to-end tracking of consignments from origin to destination.
*   **Automated Invoicing**: Automatic generation of invoices upon consignment creation.
*   **Dispatch Optimization**: Efficient management of dispatches to ensure timely deliveries.

### 2.3 User Characteristics

The system will be used by two types of users:

*   **Staff**: Responsible for creating consignments, updating their status, and managing day-to-day operations.
*   **Managers**: Have full access to the system, including user management, branch management, and reporting.

### 2.4 Constraints, Assumptions, and Dependencies

*   **Constraint**: The system must be accessible through a web-based interface.
*   **Assumption**: Users will have a basic understanding of logistics and transportation concepts.
*   **Dependency**: The system relies on a relational database to store its data.

### 2.5 Operating Environment

The application will be hosted on a web server and accessed by users through a web browser. The backend is built with Python and Flask, and the database is managed with SQLAlchemy.

## 3. Functional Requirements

### 3.1 User Management

*   **3.1.1 Description and Priority**: High-priority feature for managing user accounts.
*   **3.1.2 Specific Requirements**:
    *   The system shall allow new users to register with a unique username, password, role, and branch.
    *   The system shall allow existing users to log in with their username and password.
    *   The system shall differentiate between `STAFF` and `MANAGER` roles, with managers having additional privileges.

### 3.2 Branch Management

*   **3.2.1 Description and Priority**: High-priority feature for managing company branches.
*   **3.2.2 Specific Requirements**:
    *   The system shall allow managers to create new branches.
    *   The system shall allow users to view a list of all branches.
    *   The system shall allow users to view the details of a specific branch.

### 3.3 Truck Management

*   **3.3.1 Description and Priority**: High-priority feature for managing the truck fleet.
*   **3.3.2 Specific Requirements**:
    *   The system shall allow managers to add new trucks to the fleet.
    *   The system shall allow users to view a list of all trucks and their current status (`AVAILABLE`, `IN_TRANSIT`, `IDLE`).
    *   The system shall allow users to update the status and location of a truck.

### 3.4 Consignment Management

*   **3.4.1 Description and Priority**: High-priority feature for managing consignments.
*   **3.4.2 Specific Requirements**:
    *   The system shall allow staff to create new consignments with details such as volume, destination, and sender.
    *   The system shall automatically generate an invoice for each new consignment.
    *   The system shall allow users to track the status of a consignment (`AWAITING_DISPATCH`, `DISPATCHED`, `DELIVERED`).

### 3.5 Invoice Management

*   **3.5.1 Description and Priority**: Medium-priority feature for managing invoices.
*   **3.5.2 Specific Requirements**:
    *   The system shall allow users to view a list of all invoices.
    *   The system shall allow users to view the details of a specific invoice.

### 3.6 Dispatch Management

*   **3.6.1 Description and Priority**: High-priority feature for managing dispatches.
*   **3.6.2 Specific Requirements**:
    *   The system shall allow staff to create new dispatches by assigning consignments to a truck.
    *   The system shall allow users to view a list of all dispatches.
    *   The system shall allow users to view the details of a specific dispatch.

## 4. Non-Functional Requirements

### 4.1 Performance Requirements

*   The system should be able to handle a high volume of concurrent users without significant degradation in performance.
*   API response times should be under 500ms for most requests.

### 4.2 Safety and Security Requirements

*   All user passwords must be securely hashed before being stored in the database.
*   The system should be protected against common web vulnerabilities, such as SQL injection and cross-site scripting (XSS).

### 4.3 Reliability and Availability

*   The system should be available 24/7, with a target uptime of 99.9%.
*   The system should be designed to be fault-tolerant, with proper error handling and logging.

### 4.4 Software Quality Attributes

*   **Usability**: The user interface should be intuitive and easy to use, even for non-technical users.
*   **Maintainability**: The code should be well-structured, documented, and easy to maintain.
*   **Portability**: The system should be designed to be easily deployable to different environments.

## 5. External Interface Requirements

### 5.1 User Interfaces

The application will be accessed through a web-based UI, which will be designed to be responsive and accessible on a variety of devices.

### 5.2 Software Interfaces

The system will interact with a relational database (e.g., PostgreSQL, MySQL) through the SQLAlchemy ORM.

### 5.3 Communications Interfaces

All communication between the client and the server will be done over HTTPS to ensure data privacy and integrity.
