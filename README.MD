<h2 align="center">
  RevPay<br/>
</h2>

<center>

[![forthebadge](https://forthebadge.com/images/badges/built-with-love.svg)](https://forthebadge.com) &nbsp;
[![forthebadge](https://forthebadge.com/images/badges/made-with-javascript.svg)](https://forthebadge.com) &nbsp;
[![forthebadge](https://forthebadge.com/images/badges/open-source.svg)](https://forthebadge.com) &nbsp;

</center>

RevPay is a payment management system that allows businesses to create and manage multiple accounts with various functionalities such as deposit, withdrawal, and balance inquiry.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Contributing](#contributing)
- [License](#license)

## Features

- Business registration with username and password
- Creation of multiple accounts with unique identifiers
- Control over credit and debit transactions
- Deposit and withdrawal transactions
- Daily withdrawal limit enforcement
- Balance inquiry

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- bcrypt
- ...

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your_username/revpay.git
   ```

2. Install dependencies:

```cd revpay
npm install
```

3. Set up environment variables:

- Create a `.env` file in the root directory
- Add the necessary env variables (Eg: Mongodb Connection URI, PORT)

4. Run the Application

```
npm start
```
