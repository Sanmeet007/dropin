# Database design

## Basic

Designing a database for applications like Upwork or LinkedIn can be a complex task as these applications involve managing a large amount of user data and interactions. Here are some steps you can follow to plan a database for these types of applications:

1. Identify the entities: The first step in planning a database is to identify the entities that need to be represented in the database. For an application like Upwork, these entities could include users, jobs, proposals, contracts, payments, etc. For LinkedIn, entities could include users, companies, job postings, messages, connections, etc.

1. Determine the relationships: Once you have identified the entities, the next step is to determine the relationships between them. For example, in Upwork, a job would be posted by a user and could have multiple proposals from other users, and if a proposal is accepted, it would result in a contract between the two users. In LinkedIn, a user could apply to a job posted by a company, and if hired, they would become an employee of that company.

1. Define the attributes: For each entity, you need to define the attributes that need to be stored in the database. For example, for a user entity, attributes could include name, email, password, location, skills, etc. For a job entity, attributes could include job title, job description, skills required, payment amount, etc.

1. Normalization: It is important to ensure that the database is normalized to eliminate data redundancy and inconsistencies. Normalization involves breaking down entities into smaller entities and defining relationships between them.

1. Create tables: Once you have defined the entities, relationships, and attributes, you can create tables in the database to store the data. Each entity should have its own table,

## Tables

### User Table

| Column Name | Data Type | Description |
|-------------|----------|-------------|
| user_id | int | unique identifier for each user |
| name | varchar | user's name |
| email | varchar | user's email address |
| password | varchar | user's password |
| location | varchar | user's location |
| skills | varchar | user's skills |
| bio | varchar | user's bio |
| profile_image | varchar | URL to user's profile image |
| account_type | varchar | type of account (freelancer, client, etc.) |

The User Table contains information about the users on the platform. The `user_id` is the primary key for this table. Other tables, such as the Proposal and Contract tables, will use the `user_id` as a foreign key to link data about proposals and contracts to specific users.

### Job Table

| Column Name | Data Type | Description |
|-------------|----------|-------------|
| job_id | int | unique identifier for each job |
| client_id | int | foreign key to the client who posted the job |
| title | varchar | title of the job |
| description | varchar | description of the job |
| budget | decimal | budget for the job |
| status | varchar | status of the job (open, closed, in progress, etc.) |
| created_at | datetime | date and time the job was posted |
| closed_at | datetime | date and time the job was posted |

The Job Table contains information about the jobs that clients post on the platform. The `job_id` is the primary key for this table. The `client_id` column is a foreign key to the Client Table, which identifies the client who posted the job. Other tables, such as the Proposal and Contract tables, will use the `job_id` as a foreign key to link data about proposals and contracts to specific jobs.

### Client Table

| Column Name | Data Type | Description |
|-------------|----------|-------------|
| client_id | int | unique identifier for each client |
| user_id | int | foreign key to the user who is the client |
| company_name | varchar | name of the client's company |
| company_website | varchar | website of the client's company |
| company_size | varchar | size of the client's company |
| industry | varchar | industry of the client's company |

The Client Table contains information about the clients who post jobs on the platform. The `client_id` is the primary key for this table. The `user_id` column is a foreign key to the User Table, which identifies the user who is a client. Other tables, such as the Job and Contract tables, will use the `client_id` as a foreign key to link data about jobs and contracts to specific clients.

### Proposal Table

| Column Name | Data Type | Description |
|-------------|----------|-------------|
| proposal_id | int | unique identifier for each proposal |
| user_id | int | foreign key to the user who submitted the proposal |
| job_id | int | foreign key to the job the proposal is for |
| cover_letter | varchar | cover letter for the proposal |
| bid_amount | decimal | bid amount for the proposal |
| created_at | datetime | date and time the proposal was submitted |
| status | string | status of the proposal submmitted (accpeted , declined or pending) |
| timeframe | int | timeframe proposed for completing the job in number of days |

The Proposal Table contains information about the proposals that freelancers submit for jobs on the platform. The `proposal_id` is the primary key for this table. The `user_id` column is a foreign key to the User Table, which identifies the user who submitted the proposal. The `job_id` column is a foreign key to the Job Table, which identifies the job the proposal is for.

### Contract Table

| Column Name | Data Type | Description |
|-------------|----------|-------------|
| contract_id | int | unique identifier for each contract |
| freelancer_id | int | foreign key to the freelancer who accepted the job |
| job_id | int | foreign key to the job the contract is for |
| payment_amount | decimal | payment amount for the job |
| start_date | date | date the job was started |
| end_date | date | date the job was completed |

The Contract Table contains information about the contracts between clients and freelancers on the platform. The `contract_id` is the primary key for this table. The `freelancer_id` column is a foreign key to the User Table, which identifies the freelancer who accepted the job. The `job_id` column is a foreign key to the Job Table, which identifies the job the contract is for.

Payments

| Column Name | Description |
|-------------|-------------|
| `id` | A unique identifier for each payment. |
| `job_id` | A foreign key reference to the `jobs` table to associate the payment with a particular job. |
| `amount` | The amount of the payment, stored as a decimal with two decimal places. |
| `status` | The status of the payment, which could be one of several values such as "pending", "paid", or "failed". |
| `created_at` | The date and time when the payment was created. |
| `updated_at` | The date and time when the payment was last updated. |
