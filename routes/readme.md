# API endpoints

## Endpoint :  `/login`

**Method:** `POST`

**Request Body:**

```json
{  "email": "string",
  "password": "string"
}
```

**Response:**

```json
{  "error": "boolean",
  "message": "string"
}
```

**Error Codes:**

* 400 Bad Request: Invalid request body.
* 401 Unauthorized: Invalid credentials.

**Success:**

* 200 OK: Login successful.

**Notes:**

* The email and password fields are required.
* The password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.
* The user's hashed password is stored in the database. The password is not stored in plain text.
* The user's hashed password is compared to the password entered by the user during login. If the passwords do not match, an error is returned.
* If the login is successful, the user's session is updated with the user's ID. The user is then redirected to the home page.

## Endpoint :  `/sign-up`

**Method:** `POST`

**Request Body:**

```json
{  "account_type": "string", // client or admin
  "email": "string",
  "password": "string",
  "gender": "string", // male or female
  "dob": "string", // YYYY-MM-DD
  "first_name": "string",
  "last_name": "string",
  "company_name": "string" // only required for client account type
}
```

**Response:**

```json
{  "error": "boolean",
  "message": "string"
}
```

**Error Codes:**

* 400 Bad Request: Invalid request body.
* 409 Conflict: Email id already registered.
* 500 Internal Server Error: Something went wrong.

**Success:**

* 201 Created: User created successfully.

**Notes:**

* The account_type field is required.
* The email and password fields are required.
* The password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.
* The gender field is optional.
* The dob field is optional.
* The first_name and last_name fields are required.
* The company_name field is only required for client account type.
* The user's hashed password is stored in the database. The password is not stored in plain text.
* If the sign-up is successful, the user's session is updated with the user's ID. The user is then redirected to the home page.

## Endpoint :  `/logout`

**Method:** `GET`

**Request Body:**

None.

**Response:**

```json
{  "error": "boolean",
  "message": "string"
}
```

**Error Codes:**

* 401 Unauthorized: The user is not logged in.
* 500 Internal Server Error: Something went wrong.

**Success:**

* 200 OK: The user is logged out successfully.

**Notes:**

* The user's session is destroyed.
* The user is then redirected to the login page.

## Endpoint :  `/user/change-password`

**Method:** `POST`

**Request Body:**

```json
{  "password": "string"
}
```

**Response:**

```json
{  "error": "boolean",
  "message": "string"
}
```

**Error Codes:**

* 400 Bad Request: Invalid request body.
* 401 Unauthorized: The user is not logged in.
* 500 Internal Server Error: Something went wrong.

**Success:**

* 200 OK: Password changed successfully.

**Notes:**

* The password field is required.
* The password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.
* The user's password is updated in the database.
* If the password change is successful, the user is redirected to the home page.

## Endpoint :  `/user/update-details`

**Method:** `POST`

**Request Body:**

```json
{
  "first_name": "string",
  "last_name": "string",
  "location": "string",
  "bio": "string",
  "gender": "string",
  "company_name": "string",
  "company_website": "string",
  "industry": "string",
  "company_size": "string",
  "education": "string",
  "skills": "string",
  "programming_languages": "string",
  "languages": "string",
  "databases": "string",
  "other_skills": "string",
  "summary": "string",
}
```

**Response:**

```json
{  "error": "boolean",
  "message": "string"
}
```

**Error Codes:**

* 400 Bad Request: Invalid request body.
* 401 Unauthorized: The user is not logged in.
* 405 Method Not Allowed: The user does not have permission to update their details.
* 500 Internal Server Error: Something went wrong.

**Success:**

* 200 OK: User details updated successfully.

**Notes:**

* The user must be logged in to update their details.
* The following fields are required:
  * first_name
  * last_name
  * location
  * bio
  * gender
* The following fields are optional:
  * company_name
  * company_website
  * industry
  * company_size
  * education
  * skills
  * programming_languages
  * languages
  * databases
  * other_skills
  * summary
* The user's profile image can be updated by uploading a new image file. The file name must be unique.
* The user's details are updated in the database.

## Endpoint :  `/user/get-verified`

**Method:** `GET`

**Request Body:**

None.

**Response:**

```json
{  "error": "boolean",
  "message": "string"
}
```

**Error Codes:**

* 401 Unauthorized: The user is not logged in.
* 500 Internal Server Error: Something went wrong.

**Success:**

* 200 OK: Verification link sent successfully to registered email id.

**Notes:**

* The user must be logged in to request a verification link.
* A verification link is sent to the user's email address.
* The verification link can be used to verify the user's email address.
* Once the user's email address is verified, the user can access all features of the application.

## Endpoint :  `/user/verify`

**Method:** `GET`

**Request Body:**

```json
{  "token": "string"
}
```

**Response:**

```json
{  "error": "boolean",
  "message": "string"
}
```

**Error Codes:**

* 400 Bad Request: Invalid request body.
* 401 Unauthorized: The user is not logged in.
* 403 Forbidden: The user is not authorized to verify their email address.
* 404 Not Found: The verification token is not found.
* 500 Internal Server Error: Something went wrong.

**Success:**

* 200 OK: User verified successfully.

**Notes:**

* The user must be logged in to verify their email address.
* The verification token is sent to the user's email address when they request a verification link.
* The verification token can be used to verify the user's email address.
* Once the user's email address is verified, the user can access all features of the application.

## Endpoint :  `/jobs`

**Method:** `GET`

**Request Body:**

None.

**Response:**

```json
{  "jobs": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "budget": "string",
      "location": "string",
      "category": "string",
      "created_at": "string",
      "updated_at": "string",
    },
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "budget": "string",
      "location": "string",
      "category": "string",
      "created_at": "string",
      "updated_at": "string",
    },
    // ...
  ]
}
```

**Error Codes:**

* 500 Internal Server Error: Something went wrong.

**Success:**

* 200 OK: List of jobs is returned.

**Notes:**

* The `/jobs` endpoint returns a list of all jobs that are currently available on the platform.
* The `jobs` array contains an object for each job.
* The `id` field is the unique identifier for the job.
* The `title` field is the title of the job.
* The `description` field is the description of the job.
* The `budget` field is the budget for the job.
* The `location` field is the location of the job.
* The `category` field is the category of the job.
* The `created_at` field is the date and time the job was created.
* The `updated_at` field is the date and time the job was last updated.

## Endpoint :  `/jobs/create`

**Method:** `POST`

**Request Body:**

```json
{  "title": "string",
  "description": "string",
  "budget": "string",
  "skillset": ["string", "string", ...]
}
```

**Response:**

```json
{  "error": "boolean",
  "message": "string"
}
```

**Error Codes:**

* 400 Bad Request: Invalid request body.
* 401 Unauthorized: The user is not logged in.
* 403 Forbidden: The user does not have permission to create jobs.
* 404 Not Found: The user is not a client.
* 500 Internal Server Error: Something went wrong.

**Success:**

* 200 OK: Job created successfully.

**Notes:**

* The user must be logged in to create a job.
* The user must be a client to create a job.
* The following fields are required:
  * title
  * description
  * budget
  * skillset
* The skillset field is an array of "string"s, where each "string" is the name of a skill that the user is looking for in a freelancer.
* The job is created in the database.
* If the job is created successfully, the user is redirected to the home page.

## Endpoint :  `/jobs/update-details/:id`

**Method:** `POST`

**Request Body:**

```json
{  "title": "string",
  "description": "string",
  "budget": "string",
  "skillset": ["string", "string", ...]
}
```

**Response:**

```json
{  "error": "boolean",
  "message": "string"
}
```

**Error Codes:**

* 400 Bad Request: Invalid request body.
* 401 Unauthorized: The user is not logged in.
* 403 Forbidden: The user does not have permission to update jobs.
* 404 Not Found: The job does not exist.
* 500 Internal Server Error: Something went wrong.

**Success:**

* 200 OK: Job updated successfully.

**Notes:**

* The user must be logged in to update a job.
* The user must be the client who created the job to update it.
* The following fields are optional:
  * title
  * description
  * budget
  * skillset
* The skillset field is an array of "string"s, where each "string" is the name of a skill that the user is looking for in a freelancer.
* The job is updated in the database.
* If the job is updated successfully, the user is redirected to the job details page.

## Endpoint :  `/jobs/get-details/:id`

**Method:** `GET`

**Request Body:**

None.

**Response:**

```json
{  "id": "string",
  "title": "string",
  "description": "string",
  "budget": "string",
  "location": "string",
  "category": "string",
  "created_at": "string",
  "updated_at": "string",
  "client_id": "string",
  "client_name": "string",
  "client_email": "string",
  "client_contact": "string",
  "skillset": ["string", "string", ...],
}
```

**Error Codes:**

* 400 Bad Request: Invalid request body.
* 404 Not Found: The job does not exist.
* 500 Internal Server Error: Something went wrong.

**Success:**

* 200 OK: Job details are returned.

**Notes:**

* The `/jobs/get-details/:id` endpoint returns the details for the job with the given ID.
* The `job_details` object contains the following fields:
  * id
  * title
  * description
  * budget
  * location
  * category
  * created_at
  * updated_at
  * client_id
  * client_name
  * client_email
  * client_contact
  * skillset
* The skillset field is an array of "string"s, where each "string" is the name of a skill that the client is looking for in a freelancer.

## Endpoint :  `/jobs/get-proposals/:id`

**Method:** `GET`

**Request Body:**

None.

**Response:**

```
[
  {
    "id": "string",
    "job_id": "string",
    "freelancer_id": "string",
    "freelancer_name": "string",
    "freelancer_email": "string",
    "freelancer_contact": "string",
    "proposal_message": "string",
    "proposal_budget": "string",
    "proposal_skills": ["string", "string", ...],
    "proposal_status": "string",
    "created_at": "string",
    "updated_at": "string",
  },
  {
    "id": "string",
    "job_id": "string",
    "freelancer_id": "string",
    "freelancer_name": "string",
    "freelancer_email": "string",
    "freelancer_contact": "string",
    "proposal_message": "string",
    "proposal_budget": "string",
    "proposal_skills": ["string", "string", ...],
    "proposal_status": "string",
    "created_at": "string",
    "updated_at": "string",
  },
  // ...
]
```

**Error Codes:**

* 400 Bad Request: Invalid request body.
* 404 Not Found: The job does not exist.
* 500 Internal Server Error: Something went wrong.

**Success:**

* 200 OK: List of proposals for job_id is returned.

**Notes:**

* The `/jobs/get-proposals/:id` endpoint returns a list of all proposals for the job with the given ID.
* The `proposals` array contains an object for each proposal.
* The `id` field is the unique identifier for the proposal.
* The `job_id` field is the ID of the job that the proposal is for.
* The `freelancer_id` field is the ID of the freelancer who submitted the proposal.
* The `freelancer_name` field is the name of the freelancer who submitted the proposal.
* The `freelancer_email` field is the email address of the freelancer who submitted the proposal.
* The `freelancer_contact` field is the contact information of the freelancer who submitted the proposal.
* The `proposal_message` field is the message that the freelancer submitted with their proposal.
* The `proposal_budget` field is the budget that the freelancer submitted for their proposal.
* The `proposal_skills` field is an array of "string"s, where each "string" is the name of a skill that the freelancer has.
* The `proposal_status` field is the status of the proposal. The possible values are:
  * `pending`: The proposal is pending review.
  * `accepted`: The proposal has been accepted.
  * `rejected`: The proposal has been rejected.
* The `created_at` field is the date and time the proposal was created.
* The `updated_at` field is the date and time the proposal was last updated.

## Endpoint :  `/proposals/create/:job_id`

**Method:** `POST`

**Request Body:**

```json
{  "cover_letter": "string",
  "timeframe": "string",
  "bid_amount": "string",
}
```

**Response:**

```json
{  "error": "boolean",
  "message": "string"
}
```

**Error Codes:**

* 400 Bad Request: Invalid request body.
* 401 Unauthorized: The user is not logged in.
* 403 Forbidden: The user does not have permission to create proposals.
* 404 Not Found: The job does not exist.
* 500 Internal Server Error: Something went wrong.

**Success:**

* 200 OK: Proposal created successfully.

**Notes:**

* The user must be logged in to create a proposal.
* The user must be a freelancer to create a proposal.
* The following fields are required:
  * cover_letter
  * timeframe
  * bid_amount
* The cover_letter field is the cover letter that the freelancer submits with their proposal.
* The timeframe field is the timeframe that the freelancer submits for their proposal.
* The bid_amount field is the bid amount that the freelancer submits for their proposal.
* The proposal is created in the database.
* If the proposal is created successfully, the user is redirected to the job details page.

## Endpoint :  `/proposals/update-details/:id`

**Method:** `POST`

**Request Body:**

```json
{  "cover_letter": "string",
  "timeframe": "string",
  "bid_amount": "string",
}
```

**Response:**

```json
{  "error": "boolean",
  "message": "string"
}
```

**Error Codes:**

* 400 Bad Request: Invalid request body.
* 401 Unauthorized: The user is not logged in.
* 403 Forbidden: The user does not have permission to update proposals.
* 404 Not Found: The proposal does not exist.
* 500 Internal Server Error: Something went wrong.

**Success:**

* 200 OK: Proposal details updated successfully.

**Notes:**

* The user must be logged in to update a proposal.
* The user must be the freelancer who created the proposal to update it.
* The following fields are optional:
  * cover_letter
  * timeframe
  * bid_amount
* The cover_letter field is the cover letter that the freelancer submits with their proposal.
* The timeframe field is the timeframe that the freelancer submits for their proposal.
* The bid_amount field is the bid amount that the freelancer submits for their proposal.
* The proposal is updated in the database.
* If the proposal is updated successfully, the user is redirected to the proposal details page.

## Endpoint :  `/jobs/submit/:id`

**Method:** `POST`

**Request Body:**

None.

**Response:**

```json
{  "error": "boolean",
  "message": "string"
}
```

**Error Codes:**

* 400 Bad Request: Invalid request body.
* 401 Unauthorized: The user is not logged in.
* 403 Forbidden: The user does not have permission to submit jobs.
* 404 Not Found: The job does not exist.
* 500 Internal Server Error: Something went wrong.

**Success:**

* 200 OK: Job submitted successfully.

**Notes:**

* The user must be logged in to submit a job.
* The user must be the client who created the job to submit it.
* The job is marked as completed in the database.
* A notification is sent to the client.

## Endpoint :  `/jobs/create-contract/:id`

**Method:** `POST`

**Request Body:**

None.

**Response:**

```json
{  "error": "boolean",
  "message": "string"
}
```

**Error Codes:**

* 400 Bad Request: Invalid request body.
* 401 Unauthorized: The user is not logged in.
* 403 Forbidden: The user does not have permission to create contracts.
* 404 Not Found: The proposal does not exist.
* 500 Internal Server Error: Something went wrong.

**Success:**

* 200 OK: Contract created successfully.

**Notes:**

* The user must be logged in to create a contract.
* The user must be the client who created the proposal to create a contract for it.
* A contract is created in the database.
* A notification is sent to the freelancer.

**Explanation:**

The `router.post("/jobs/create-contract/:id", authenticateSession, async (req, res) => {` function is a ExpressJS route handler that creates a contract for the proposal with the given ID. The function first checks if the proposal ID is valid. If the proposal ID is valid, the function calls the `dbconn.createContract()` function to create the contract in the database. The `dbconn.createContract()` function takes one argument: the proposal ID. The function then calls the `sendMail()` function to send a notification to the freelancer. The `sendMail()` function takes the following arguments:

* subject: The subject of the email.
* senderName: The name of the sender.
* recieverEmailId: The email address of the recipient.
* recieverName: The name of the recipient.
* templateName: The name of the email template.
* templateParams: An object that contains the parameters for the email template.

The `sendMail()` function uses the Mailgun API to send the email. The Mailgun API is a RESTful API that allows you to send and receive emails.

## Endpoint :  `/jobs/end-contract/:id`

**Method:** `POST`

**Request Body:**

None.

**Response:**

```json
{  "error": "boolean",
  "message": "string"
}
```

**Error Codes:**

* 400 Bad Request: Invalid request body.
* 401 Unauthorized: The user is not logged in.
* 403 Forbidden: The user does not have permission to end contracts.
* 404 Not Found: The contract does not exist.
* 500 Internal Server Error: Something went wrong.

**Success:**

* 200 OK: Contract ended successfully.

**Notes:**

* The user must be logged in to end a contract.
* The user must be the client who created the contract to end it.
* The contract is marked as ended in the database.
* A notification is sent to the freelancer.

**Explanation:**

The `router.post("/jobs/end-contract/:id", authenticateSession, async (req, res) => {` function is a ExpressJS route handler that ends the contract with the given ID. The function first checks if the contract ID is valid. If the contract ID is valid, the function calls the `dbconn.endContract()` function to mark the contract as ended in the database. The `dbconn.endContract()` function takes one argument: the contract ID. The function then calls the `sendMail()` function to send a notification to the freelancer. The `sendMail()` function takes the following arguments:

* subject: The subject of the email.
* senderName: The name of the sender.
* recieverEmailId: The email address of the recipient.
* recieverName: The name of the recipient.
* templateName: The name of the email template.
* templateParams: An object that contains the parameters for the email template.

The `sendMail()` function uses the Mailgun API to send the email. The Mailgun API is a RESTful API that allows you to send and receive emails.

## Endpoint :  `/pay-money/:contract_id`

**Method:** `POST`

**Request Body:**

```json
{  "amount": "string"
}
```

**Response:**

```json
{  "error": "boolean",
  "message": "string"
}
```

**Error Codes:**

* 400 Bad Request: Invalid request body.
* 401 Unauthorized: The user is not logged in.
* 403 Forbidden: The user does not have permission to pay for contracts.
* 404 Not Found: The contract does not exist.
* 500 Internal Server Error: Something went wrong.

**Success:**

* 200 OK: Payment processed successfully.

**Notes:**

* The user must be logged in to pay for a contract.
* The user must be the client who created the contract to pay for it.
* The payment amount must be a valid number.
* The payment is processed and the contract is marked as paid in the database.
* A notification is sent to the freelancer.

## Endpoint : `/pay-money/:contract_id`

**Method:** `POST`

**Request Body:**

```json
{
  "contract_id": "string",
  "amount": "string"
}
```

**Response:**

```json
{
  "error": "boolean",
  "message": "string"
}
```

**Error Codes:**

* 400 Bad Request: Invalid request body.
* 403 Forbidden: User is not authorized to pay for a contract.
* 404 Not Found: Contract does not exist.
* 500 Internal Server Error: Something went wrong.

## Endpoint : `/withdraw-money`

**Method:** `POST`

**Request Body:**

```json
{
  "amount": "number"
}
```

**Response:**

```json
{
  "error": "boolean",
  "message": "string"
}
```

**Error Codes:**

* 400 Bad Request: Invalid request body.
* 403 Forbidden: User is not authorized to withdraw money.
* 404 Not Found: Freelancer does not exist.
* 500 Internal Server Error: Something went wrong.

## Endpoint : `/payment-failure`

**Method:** `POST`

**Request Body:**

```json
{
  "amount": "string"
}
```

**Response:**

```json
{
  "error": "boolean",
  "message": "string"
}
```

**Error Codes:**

* 400 Bad Request: Invalid request body.
* 403 Forbidden: User is not authorized to send a payment failure email.
* 500 Internal Server Error: Something went wrong.

## Endpoint : `/withdraw-failure`

**Method:** `POST`

**Request Body:**

```json
{
  "amount": "number"
}
```

**Response:**

```json
{
  "error": "boolean",
  "message": "string"
}
```

**Error Codes:**

* 400 Bad Request: Invalid request body.
* 403 Forbidden: User is not authorized to send a withdraw failure email.
* 500 Internal Server Error: Something went wrong.

## Endpoint : `/user/transaction-history`

**Method:** `GET`

**Response:**

```json
{
  "error": "boolean",
  "message": "string",
  "history": [
    {
      "id": "string",
      "transaction_type": "string",
      "amount": "string",
      "timestamp": "string",
      "description": "string"
    },
    ...
  ]
}
```

**Error Codes:**

* 400 Bad Request: Invalid request body.
* 403 Forbidden: User is not authorized to get transaction history.
* 500 Internal Server Error: Something went wrong.
