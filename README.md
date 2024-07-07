# Vehicles Management

The Vehicles Management project is a comprehensive system designed to streamline and automate various aspects of
managing vehicles within a company. This project includes a backend server, an admin dashboard, and a user application
to facilitate efficient vehicle management, maintenance scheduling, and user interactions.

## Table of Contents

- [Overview](#overview)
- [Live Demo](#live-demo)
    - [Admin Dashboard](#admin-dashboard)
    - [User Application](#user-application)
- [Installation](#installation)
- [Features](#features)
- [System Used Technologies](#System-Used-Technologies)
- [Problems Solved](#problems-solved)
- [Requirements](#requirements)
    - [Functional Requirements](#functional-requirements)
    - [User Experience (UX) Requirements](#user-experience-ux-requirements)
    - [Security and Privacy Requirements](#security-and-privacy-requirements)
    - [Technology Stack and Integration](#technology-stack-and-integration)
    - [Testing and Quality Assurance](#testing-and-quality-assurance)
- [Analysis](#Analysis)
    - [Identify Stakeholders](#identify-stakeholders)
    - [Gather Requirements](#gather-requirements)
    - [Define System Objectives](#define-system-objectives)
    - [System Scope Definition](#system-scope-definition)
    - [System Designs](#system-designs)

## Overview

The Vehicles Management project aims to modernize and optimize the management of vehicles within a company. The system
ensures efficient utilization of vehicles, improves maintenance processes, and simplifies user transactions related to
vehicles.

## Live Demo

### Admin Dashboard

1. Live domain: https://vehicles-management-admin.onrender.com
2. mail: admin@vehicles.com
3. password: 1234asdf

### User Application

1. Live domain: Install apk from repository files
2. mail: mohammed@vehicles.com
3. password: 1234asdf

You can sign up using your mail.  

## Installation

Access the code from those repositories (Private repositories just can access by project members):

1. **Admin Dashboard**: https://github.com/m2001619/vehicles-management-admin
2. **Backend Server**: https://github.com/m2001619/vehicles-management-server
3. **User Application**: https://github.com/m2001619/vehicles-management-app

## Features

1. **Backend for Server**: Handles data storage, processing, and communication between different parts of the project.
   Includes designing and implementing APIs.
2. **Admin Dashboard**: A web-based interface for administrators to manage and monitor vehicles and related data.
3. **User Application**: A mobile or web-based interface for users to interact with the vehicle management system.

## System Used Technologies

1. **Express.js**: Web application framework for Node.js used to develop the backend side.
2. **ReactJS**: JavaScript library for building user interfaces used to build the admin dashboard site.
3. **React Native**: Framework for building mobile applications using JavaScript and React.
4. **MongoDB**: NoSQL database management system used as the database for the project.
5. **Cloudinary**: Cloud-based media management platform used to store media assets.
6. **Twilio**: Cloud communications platform used to send verification tokens to users.
7. **JWT (JSON Web Token)**: Open standard for securely transmitting information between parties as a JSON object.
8. **Firebase**: Mobile and web development platform used for sending push notifications and providing analytics.
9. **Google Cloud Platform (GCP)**: Cloud services platform used for Google Map and translation services.

## Problems Solved

1. **Fleet Tracking and Monitoring**: Provides real-time tracking and monitoring of company vehicles.
2. **Maintenance and Repairs**: Includes features for scheduling and tracking vehicle maintenance.
3. **Fuel Management**: Tracks fuel consumption and monitors fuel efficiency.
4. **Driver Management**: Manages driver information and tracks driver performance.
5. **Reporting and Analytics**: Generates reports and provides analytics on various aspects of vehicle management.
6. **Asset Utilization**: Optimizes asset utilization by providing insights into vehicle availability and utilization
   rates.
7. **Efficient Vehicle Assignment**: Streamlines the process of assigning vehicles to users.
8. **User Self-Service**: Provides users with self-service capabilities for managing their vehicle-related tasks.

## Requirements

### Functional Requirements

1. **User Authentication and Access Control**: Secure authentication system with different user roles and permissions.
2. **Vehicle Tracking and Monitoring**: Real-time tracking of vehicles using GPS or other tracking technologies.
3. **Vehicle Management**: Manage vehicles including adding new vehicles, updating details, and retiring vehicles.
4. **Reservation and Booking System**: Reserve and book vehicles based on availability.
5. **Maintenance and Repairs**: Schedule and track vehicle maintenance.
6. **Fuel Management**: Track fuel consumption and detect anomalies.
7. **Driver Management**: Manage driver profiles and monitor performance.
8. **Reporting and Analytics**: Generate reports on vehicle usage, maintenance costs, and more.
9. **Notifications and Alerts**: Send notifications about vehicle availability, maintenance reminders, and reservations.
10. **Document Management**: Store and manage important vehicle-related documents securely.

### User Experience (UX) Requirements

1. **Intuitive Interface**: Clean, user-friendly design with intuitive navigation.
2. **Responsive Design**: Optimized for use on desktops, tablets, and mobile phones.
3. **Efficient Task Flows**: Perform common tasks with minimal steps.
4. **Clear Feedback and Error Handling**: Provide clear feedback and error messages.

### Security and Privacy Requirements

1. **User Data Protection**: Use encryption and secure storage for user data.
2. **Access Control**: Implement role-based access control.
3. **Secure Communication**: Use HTTPS for secure data transmission.

### Technology Stack and Integration

1. **Backend Framework**: Node.js with Express.
2. **Database**: MongoDB.
3. **API Integration**: Integrate with external APIs for geolocation and payment gateways.

### Testing and Quality Assurance

1. **Unit Testing**: Develop and execute unit tests for individual components.
2. **Integration Testing**: Verify proper communication between system components.
3. **Performance Testing**: Test system performance under various load conditions.
4. **Security Testing**: Identify and address vulnerabilities.

## Analysis

### Identify Stakeholders

1. **Administrators**: Responsible for system configuration, user management, and overall system administration.
2. **Users**: Individuals who will be reserving vehicles, managing bookings, and accessing vehicle-related information.
3. **IT Staff**: Involved in system deployment, maintenance, and technical support.
4. **Management**: Decision-makers who provide guidance and oversee the project.

### Gather Requirements

1. Conduct interviews and workshops with stakeholders to elicit detailed requirements.
2. Document the requirements in a structured manner, including functional, UX, security, and integration aspects.

### Define System Objectives

1. Develop a secure and efficient vehicle management system that optimizes fleet utilization and improves operational
   processes.
2. Enhance user experience by providing intuitive interfaces and streamlined workflows.
3. Ensure data privacy and security through proper authentication, access control, and secure communication.

### System Scope Definition

1. Authentication
2. Vehicle Tracking
3. Vehicle Management
4. Reservation System
5. Maintenance and Repairs
6. Fuel Management
7. Driver Management
8. Reporting and Analytics
9. Notifications and Alerts
10. Multiple Languages

### System Designs

1. **System Architecture**: Use UML use case diagrams to represent the interactions between system actors (users,
   administrators) and the system. Use UML sequence diagrams to show the sequence of actions and system responses.
2. **Data Modeling**: Use ERD (Entity Relationship Diagram) to show the entities, their attributes, relationships, and
   multiplicity.
3. **User Interface Design**: Use ReactJS framework for admin dashboard and React Native framework for user application.
4. **Error Handling and Exception Management**: Design error handling and exception management mechanisms, including
   error logging, error messages, and recovery procedures.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
