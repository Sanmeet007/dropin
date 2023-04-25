-- Creating Databse

CREATE DATABASE IF NOT EXISTS `upwork`;

USE `upwork`;

-- USER TABLE

DROP TABLE IF EXISTS `users`;

CREATE TABLE
    `users`(
        user_id INTEGER UNSIGNED PRIMARY KEY AUTO_INCREMENT,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255),
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        location VARCHAR(255),
        bio VARCHAR(255) DEFAULT 'Feeling Lucky',
        profile_image VARCHAR(255),
        gender ENUM('male', 'female', 'others') NOT NULL,
        dob DATE NOT NULL,
        account_type ENUM(
            'admin',
            'client',
            'freelancer'
        ) DEFAULT 'client' NOT NULL,
        verified BOOLEAN default false not null
    );

ALTER TABLE `users` AUTO_INCREMENT = 1000;

-- Freelancer  Table

DROP TABLE IF EXISTS `freelancers`;

CREATE TABLE
    `freelancers`(
        freelancer_id INTEGER UNSIGNED PRIMARY KEY AUTO_INCREMENT,
        user_id INTEGER UNSIGNED,
        skills VARCHAR(255),
        programming_languages SET(
            'java',
            'javascript',
            'html',
            'css',
            'rust',
            'c',
            'c++',
            'go',
            'dart',
            'php',
            'kotlin'
        ),
        `databases` SET(
            'mysql',
            'postgres',
            'mongodb',
            'dyanmodb',
            'redis'
        ),
        languages SET(
            'punjabi',
            'hindi',
            'english',
            'spanish'
        ) DEFAULT 'english',
        other_skills VARCHAR(255),
        education LONGTEXT,
        CONSTRAINT `fk_user_key` FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
    );

-- CLIENT TABLE

DROP TABLE IF EXISTS `clients`;

CREATE TABLE
    `clients`(
        client_id INTEGER UNSIGNED PRIMARY KEY AUTO_INCREMENT,
        user_id INTEGER UNSIGNED,
        company_name VARCHAR(255) NOT NULL,
        company_website VARCHAR(255),
        company_size INT,
        industry VARCHAR(255),
        CONSTRAINT `fk_client_user_key` FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
    );

-- JOB TABLE

DROP TABLE IF EXISTS `jobs`;

CREATE TABLE
    `jobs`(
        job_id INTEGER UNSIGNED PRIMARY KEY AUTO_INCREMENT,
        client_id INTEGER UNSIGNED,
        title VARCHAR(255),
        description VARCHAR(255),
        budget DECIMAL DEFAULT 5.0,
        status ENUM('closed', 'open', 'progress') DEFAULT 'open',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT `min_job_price` CHECK (budget > 5),
        CONSTRAINT `fk_job_client_key` FOREIGN KEY (client_id) REFERENCES clients(client_id) ON DELETE CASCADE
    );

-- Proporsal table

-- timeframe in days (int)

DROP TABLE IF EXISTS `proposals`;

CREATE TABLE
    `proposals`(
        proposal_id INTEGER UNSIGNED PRIMARY KEY AUTO_INCREMENT,
        user_id INTEGER UNSIGNED,
        job_id INTEGER UNSIGNED,
        cover_letter LONGTEXT NOT NULL,
        bid_amount DECIMAL DEFAULT 5,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        timeframe INT NOT NULL,
        CONSTRAINT `fk_proposals_user_key` FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
        CONSTRAINT `fk_propoals_job_key` FOREIGN KEY (job_id) REFERENCES jobs(job_id) ON DELETE CASCADE,
        CONSTRAINT `min_bid_amount` CHECK (bid_amount > 5)
    );

-- contract table

DROP TABLE IF EXISTS `contracts` ;

CREATE TABLE
    `contracts`(
        contact_id INTEGER UNSIGNED PRIMARY KEY AUTO_INCREMENT,
        freelancer_id INTEGER UNSIGNED,
        job_id INTEGER UNSIGNED,
        payment_amount DECIMAL NOT NULL,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        CONSTRAINT `fk_freelancer_key` FOREIGN KEY (freelancer_id) REFERENCES freelancers(freelancer_id) ON DELETE CASCADE,
        CONSTRAINT `fk_job_key` FOREIGN KEY (job_id) REFERENCES jobs(job_id) ON DELETE CASCADE
    );

DROP procedure IF EXISTS `create_freelancer`;

DELIMITER $$

CREATE PROCEDURE `CREATE_FREELANCER`(IN FIRST_NAME 
VARCHAR(255), IN LAST_NAME VARCHAR(255), IN EMAIL 
VARCHAR(255), IN PASSWORD VARCHAR(255), IN LOCATION 
VARCHAR(255), IN BIO LONGTEXT, IN PROFILE_IMAGE VARCHAR
(255), IN GENDER VARCHAR(255), IN ACCOUNT_TYPE VARCHAR
(255), IN DOB DATE, IN SKILLS VARCHAR(255), IN PROGRAMMING_LANGUAGES 
VARCHAR(255), IN DB VARCHAR(255), IN LANGS VARCHAR
(255), IN OTHER_SKILLS VARCHAR(255), IN EDU VARCHAR
(255)) BEGIN 
	declare k int;
	set k = (
	        select user_id + 1
	        from users
	        order by user_id desc
	        limit 1
	    );
	start transaction;
	INSERT INTO
	    users(
	        user_id,
	        first_name,
	        last_name,
	        email,
	        password,
	        location,
	        bio,
	        profile_image,
	        gender,
	        account_type,
	        dob
	    )
	VALUES (
	        k,
	        first_name,
	        last_name,
	        email,
	        password,
	        location,
	        bio,
	        profile_image,
	        gender,
	        account_type,
	        dob
	    );
	INSERT INTO
	    freelancers(
	        user_id,
	        skills,
	        programming_languages,
	        `databases`,
	        languages,
	        other_skills,
	        education
	    )
	VALUES (
	        k,
	        skills,
	        programming_languages,
	        db,
	        langs,
	        other_skills,
	        edu
	    );
	commit;
END$ 

$ 

DELIMITER ;

DROP procedure IF EXISTS `create_client`;

DELIMITER $$

CREATE PROCEDURE `CREATE_CLIENT`(IN FIRST_NAME VARCHAR
(255), IN LAST_NAME VARCHAR(255), IN EMAIL VARCHAR
(255), IN PASSWORD VARCHAR(255), IN LOCATION VARCHAR
(255), IN BIO LONGTEXT, IN PROFILE_IMAGE VARCHAR(255
), IN GENDER VARCHAR(255), IN ACCOUNT_TYPE VARCHAR
(255), IN DOB DATE, IN COMPANY_NAME VARCHAR(255), 
IN COMPANY_WEBSITE VARCHAR(255), IN COMPANY_SIZE INT
, IN INDUSTRY VARCHAR(255)) BEGIN 
	declare k int;
	set k = (
	        select user_id + 1
	        from users
	        order by user_id desc
	        limit 1
	    );
	start transaction;
	INSERT INTO
	    users(
	        user_id,
	        first_name,
	        last_name,
	        email,
	        password,
	        location,
	        bio,
	        profile_image,
	        gender,
	        account_type,
	        dob
	    )
	VALUES (
	        k,
	        first_name,
	        last_name,
	        email,
	        password,
	        location,
	        bio,
	        profile_image,
	        gender,
	        account_type,
	        dob
	    );
	INSERT INTO
	    clients(
	        user_id,
	        company_name,
	        company_website,
	        company_size,
	        industry
	    )
	VALUES (
	        k,
	        company_name,
	        company_website,
	        company_size,
	        industry
	    );
	commit;
END$ 

$ 

DELIMITER ;