# dare-test

## Description
-------------
This is a RESTful api that manages some information regarding insurance policies and company clients
There is one service that provides all of the data needed:

- https://dare-nodejs-assessment.herokuapp.com/api/
- The list of company policies can be found at: https://dare-nodejs-assessment.herokuapp.com/api/policies

- The list of company clients can be found at: https://dare-nodejs-assessment.herokuapp.com/api/clients

I have created the following endpoints:

### User authentification -> Can be accessed by users with role "users" and "admin"
---
```
    - POST REQUEST: /api/login
    - Headers
      Content-type: application/json
    - Recieves on valid email
    - {
        "token": "YOUR_TOKEN",
        "refreshToken": "YOUR_REFRESH_TOKEN",
        "expiresIn": "Expire time",
    }

    - Example Request:
        - http://localhost:3000/api/user/auth
        - Payload:
        
        {
            "username": "YOUR_EMAIL"
        }
        
```

### Refresh Token -> Can be accessed by users with role "users" and "admin"
---
```
    - POST REQUEST: /api/refreshToke
    - Headers
      Content-type: application/json
      BEARER: YOUR_REFRESH_TOKEN
    - Recieves on valid refresh token
    - {
        "token": "YOUR_NEW_TOKEN",
        "expiresIn": "Expire time",
    }

    - Example Request:
        - http://localhost:3000/api/refreshToken
        - Payload: NO PAYLOAD
        
```

### Get policy data -> Can be accessed by users with role "users"  (it will retrieve its own policies)  and "admin" (it will retrieve all the policies). Paginated to 10 by default. A limit query parameter can be added to change pagination
-----
```
 - GET REQUEST: /api/policies
    - Headers: 
      Bearer: YOUR_TOKEN
    - Recieves on valid token
    {
    "message": "policies found",
    "data":
        [
            {
                "id": "7b624ed3-00d5-4c1b-9ab8-c265067ef58b",
                "amountInsured": 399.89,
                "email": "inesblankenship@quotezart.com",
                "inceptionDate": "2015-07-06T06:55:49Z",
                "installmentPayment": true,
                "clientId": "a0ece5db-cd14-4f21-812f-966633e7be86"
            }
        ]
    }

    - Example Request:
        - http://localhost:3000/api/policies?limit=5
        - Payload: NO PAYLOAD
```
### Get policy linked to a policyid -> Can be accessed by users with role "users" (it will retrieve its own policy) and role "admin" (it will retrieve all the policies)
---
```
- POST REQUEST: /api/policy/:id
    - Headers: 
      Bearer: YOUR_TOKEN
    - Recieves on valid token and id
    ```
    "message": "policies found",
    "data": [
        [
            {
                "id": "7b624ed3-00d5-4c1b-9ab8-c265067ef58b",
                "amountInsured": 399.89,
                "email": "inesblankenship@quotezart.com",
                "inceptionDate": "2015-07-06T06:55:49Z",
                "installmentPayment": true,
                "clientId": "a0ece5db-cd14-4f21-812f-966633e7be86"
            }
        ]
    ]

    - Example Request:
        - http://localhost:3000/api/policy/:id
        - Payload: NO PAYLOAD
```  
### Get client data -> Can be accessed by users with role "users"  (it will retrieve its own client details as only element of the list)  and "admin" (it will retrieve all the clients list)
----
```
- POST REQUEST: /api/clients
    - Headers: 
      Bearer: YOUR_TOKEN
    - Recieves on valid token
    ```
    "message": "clients successfully retrieved",
    "data": [
            "id": "SEARCHED_ID",
            "name": "SEARCHED_NAME",
            "email": "SEARCHED_EMAIL",
            "role": "SEARCHED_ROL"
    ]

    - Example Request:
        - http://localhost:3000/api/clients
        - Payload: NO PAYLOAD
```

### Get client data filtered by client id -> Can be accessed by users with role "users"  (it will retrieve its own client details as only element of the list)  and "admin" (it will retrieve all the clients list)
----
```
- POST REQUEST: /api/clients
    - Headers: 
      Bearer: YOUR_TOKEN
    - Recieves on valid token
    ```
    "message": "clients successfully retrieved",
    "data": [
            "id": "SEARCHED_ID",
            "name": "SEARCHED_NAME",
            "email": "SEARCHED_EMAIL",
            "role": "SEARCHED_ROL"
    ]

    - Example Request:
        - http://localhost:3000/api/clients/:id
        - Payload: NO PAYLOAD
```
### Get the list of policies linked to a client -> Can be accessed by users with role "admin"  (it will retrieve any client policy list) and role "users" (it will retrieve its own client policy list)
---
```
- POST REQUEST: /api/clients/:id/policies
    - Headers: 
      Bearer: YOUR_TOKEN
    - Recieves on valid token and id
    ```
    "message": "policies found",
    "data": [
        [
            {
                "id": "7b624ed3-00d5-4c1b-9ab8-c265067ef58b",
                "amountInsured": 399.89,
                "email": "inesblankenship@quotezart.com",
                "inceptionDate": "2015-07-06T06:55:49Z",
                "installmentPayment": true,
                "clientId": "a0ece5db-cd14-4f21-812f-966633e7be86"
            }
        ]
    ]

    - Example Request:
        - http://localhost:3000/api/clients/a0ece5db-cd14-4f21-812f-966633e7be86/policies
        - Payload: NO PAYLOAD
```

There is authification using jsonwebtoken where only the email is needed, as there is no data regarding
the password.

Tests have been done using Mocha Chai and Sinon to stub the http calls.

### **Running the application**

1. Open the folder dare in the console
2. Install npm modules
2. Start the application

```
$ npm i
```

```
$ node server.js
```

nodemon can also be used for development purposes

```
$ npm run nodemon
```

### Running tests
---

1. In the console:

For unit tests
```
$ npm run unit-test
```

For integration tests
```
$ npm run integration-test
```


## Technical Description

The Api was done using Node.js and the Express framework. JSON web tokens were used for authentification.
Custom middlewares were used in order to handle access to the endpoints for certain roles.
Morgan and winston were used for logging, that logs everytime a user makes an api call to an endpoint and when 
a the user is started and abruptly shut down.


The JWT_SECRET and the .env file has been kept and uploaded to be able to start and use the APP as quickly as possible.

As a guideline to review the API, I suggest first taking a look at the .env file, then the config file to review 
how they get exported.
Then I sugggest looking at the server.js file
Afterwards I suggest looking at the routes files then the logic files.
I believe this will give a general idea of how the arquitecture and the workflow works.





