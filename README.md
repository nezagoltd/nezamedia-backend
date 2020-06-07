# nezamedia-backend
[![Build Status](https://travis-ci.com/nezago/nezamedia-backend.svg?token=xYuqSZofX88oaDGxJwTY&branch=develop)](https://travis-ci.com/nezago/nezamedia-backend) [![codecov](https://codecov.io/gh/nezago/nezamedia-backend/branch/develop/graph/badge.svg?token=HIM9MFC4FE)](https://codecov.io/gh/nezago/nezamedia-backend)

# Introduction
This is a nezago project of managing media (videos, audios, documents). This part is for backend

# Vision
Since the rise of technology, everyhing is easier to be maintened, for the media such as:
    * Videos
    * Audios
    * Documents
We are here to provide the easiest way of maintening them!

# Tools

Tools used for development of these APIs are;
- Code Editor: [VSCode](https://code.visualstudio.com/).
- Languages :
    * Backend:
        * [NodeJS](https://nodejs.org/en/) => [Express (framework)](https://expressjs.com/)
        * [PostgreSQL](https://www.postgresql.org/)

- API Testing tools: 
    * [Postman](https://www.getpostman.com/)
    * [Mocha](https://mochajs.org/) and [chai](https://www.chaijs.com/)

* Test Coverage, maintainability, and CI:
    * [Travis CI](https://travis-ci.org/ "Continuous Integration (CI)"), 
    * [Codecov](https://codecov.io/ "Test Coverrage") 

* Version control system: [Git](https://git-scm.com/)

# Testing endpoint locally

### Prerequisites
Make sure you have:
- [NodeJS 10 or newer](https://nodejs.org/en/)
- [PostgreSQL](https://www.postgresql.org/)

Clone the Repo.
-------------
1. `git clone https://github.com/nezago/nezamedia-backend.git`
2. `cd nezamedia-backend`
3. create a `.env` file in parent directory of the project 
4. copy all fields from `.env.example` file and paste them in `.env` file, and give them values
5. `yarn` or `npm i`
5. `yarn run migrations` or `npm run migrations`
6. `yarn start` or `npm start`
7. If you have [Postman](https://www.getpostman.com/) already installed on your local machine, then test all of the above listed endpoints
8. Remember to run [PostgreSQL 9 or above](https://www.postgresql.org/) on your local machine or in a container
   
## Deployment
- Heroku (Backend) : [NezaMedia Backend](https://nezamedia-backend-staging.herokuapp.com)

## Key contributor to development
* [MUGIRASE Emmanuel (descholar)](https://github.com/descholar-ceo/)

# API Endpoints Specifications

- Api Roots : https://nezamedia-backend-staging.herokuapp.com/api/

| Endpoint | Request | Status | Description |
| --- | --- | --- | --- |
| / | GET | 200 OK | Helps users to access to the parent api for the whole application|
| /users/signup | POST | 201 CREATED | Helps users to create their accounts, by signup|
| /users/verify-user?token=token | GET | 200 OK | Verifies a user after a successful registration|
| /users/login | POST | 200 OK | Enables user to login after their account has been verified|
| /users/resend-verification-email?email=requesterEmail | POST | 200 OK | Enables user to request resend verification email|
| /users/reset-password-request?email=requesterEmail | POST | 200 OK | Enables user to request to reset the password|
| /users/reset-password/:token | PATCH | 200 OK | Enables user to reset their password|
| /users/login-google | GET | 200 OK | Enables user to login via their google accounts|
| /users/login-facebook | GET | 200 OK | Enables user to login via their facebook accounts|
| /users/logout | GET | 200 OK | Enables user to logout |
