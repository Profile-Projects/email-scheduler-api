# Email Scheduler API

This API empowers you to manage organizations, users, email templates, and schedule email series for targeted customer communications.

## Key Features

- **Organization Management:** Create, update organizations.
- **User Management:** Add and update users within organizations.
- **Email Template Creation:** Design email templates with placeholders for user and customer data.
- **Mail Series Scheduling:** Create email series for organizations, specifying sending times and intervals.
- **User Targeting:** Add users to email series to receive personalized emails based on the schedule.

## Technology Stack

- **Language:** Node.js
- **Package Manager:** npm
- **Database:** PostgreSQL

## Getting Started

### Prerequisites

- Node.js (version 14 or newer recommended)
- npm
- PostgreSQL

### Installation

1. Clone the repository:

   ```bash
   git clone [https://github.com/Profile-Projects/email-scheduler-api.git](https://github.com/Profile-Projects/email-scheduler-api.git)

2. Install dependcies:

    ```bash
    cd email-scheduler-api
    npm install
    ```
3. Start server:

    ```bash
        nodemon index.js
    ```