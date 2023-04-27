# Router

Contains details about different routes

## API

### Login Route

```js
    fetch("/api/login", {
        method :"POST",
        headers: {
            "Content-Type" : "application/json"
        },
        body : {
            "email" : "someone@gmail.com",
            "password" : "password"
        }
    })
```

### Sign Up Route

```js
    // For freelancer registration 

    fetch("/api/sign-up", {
        method :"POST",
        headers: {
            "Content-Type" : "application/json"
        },
        body : {
            "gender" : "male",
            "first_name" : "fname",
            "last_name" : "lname",
            "password" : "password",
            "email" : "someone@gmail.com",
            "dob" : "2012-04-30T02:15:12.356Z",
            "account_type" : "freelancer", 
        }
    })
    
    // For Client registration 
    // company_name param can't be null when registering for client

    fetch("/api/sign-up", {
        method :"POST",
        headers: {
            "Content-Type" : "application/json"
        },
        body : {
            "gender" : "male",
            "first_name" : "fname",
            "last_name" : "lname",
            "password" : "password",
            "email" : "supersam123@gmail.com",
            "dob" : "2012-04-30T02:15:12.356Z",
            "account_type" : "client", 
            "company_name": "My Comapnny" 
        }
    })
    
```

### Logout

```js
    fetch("/api/logout");
```
