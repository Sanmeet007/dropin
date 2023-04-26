-- MySQL dump 10.13  Distrib 8.0.32, for Win64 (x86_64)
--
-- Host: localhost    Database: dropin
-- ------------------------------------------------------
-- Server version	8.0.29

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `clients`
--

DROP TABLE IF EXISTS `clients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clients` (
  `client_id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int unsigned DEFAULT NULL,
  `company_name` varchar(255) NOT NULL,
  `company_website` varchar(255) DEFAULT NULL,
  `company_size` int DEFAULT NULL,
  `industry` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`client_id`),
  KEY `fk_client_user_key` (`user_id`),
  CONSTRAINT `fk_client_user_key` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clients`
--

LOCK TABLES `clients` WRITE;
/*!40000 ALTER TABLE `clients` DISABLE KEYS */;
INSERT INTO `clients` VALUES (1,1001,'Rohit productions',NULL,NULL,NULL),(2,1002,'cant be null',NULL,NULL,NULL),(3,1003,'superman',NULL,NULL,NULL);
/*!40000 ALTER TABLE `clients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contracts`
--

DROP TABLE IF EXISTS `contracts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contracts` (
  `contract_id` int unsigned NOT NULL AUTO_INCREMENT,
  `freelancer_id` int unsigned DEFAULT NULL,
  `job_id` int unsigned DEFAULT NULL,
  `payment_amount` double DEFAULT NULL,
  `start_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `end_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`contract_id`),
  KEY `fk_freelancer_key` (`freelancer_id`),
  KEY `fk_job_key` (`job_id`),
  CONSTRAINT `fk_freelancer_key` FOREIGN KEY (`freelancer_id`) REFERENCES `freelancers` (`freelancer_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_job_key` FOREIGN KEY (`job_id`) REFERENCES `jobs` (`job_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contracts`
--

LOCK TABLES `contracts` WRITE;
/*!40000 ALTER TABLE `contracts` DISABLE KEYS */;
INSERT INTO `contracts` VALUES (1,1,9,76,'2023-04-25 18:30:00','2023-04-25 18:30:00');
/*!40000 ALTER TABLE `contracts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `freelancers`
--

DROP TABLE IF EXISTS `freelancers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `freelancers` (
  `freelancer_id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int unsigned DEFAULT NULL,
  `skills` varchar(255) DEFAULT NULL,
  `programming_languages` set('java','javascript','html','css','rust','c','c++','go','dart','php','kotlin') DEFAULT NULL,
  `databases` set('mysql','postgres','mongodb','dyanmodb','redis') DEFAULT NULL,
  `languages` set('punjabi','hindi','english','spanish') DEFAULT 'english',
  `other_skills` varchar(255) DEFAULT NULL,
  `education` longtext,
  `balance` int unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`freelancer_id`),
  KEY `fk_user_key` (`user_id`),
  CONSTRAINT `fk_user_key` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `freelancers`
--

LOCK TABLES `freelancers` WRITE;
/*!40000 ALTER TABLE `freelancers` DISABLE KEYS */;
INSERT INTO `freelancers` VALUES (1,1000,'web development,UI/UX,Full Stack developer','javascript,html,css,php','mysql,postgres','punjabi,hindi,english',NULL,'+2',0);
/*!40000 ALTER TABLE `freelancers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jobs` (
  `job_id` int unsigned NOT NULL AUTO_INCREMENT,
  `client_id` int unsigned DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` longtext,
  `budget` double DEFAULT NULL,
  `status` enum('closed','open','progress') DEFAULT 'open',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `closed_at` timestamp NULL DEFAULT NULL,
  `skillset` text,
  PRIMARY KEY (`job_id`),
  KEY `fk_job_client_key` (`client_id`),
  CONSTRAINT `fk_job_client_key` FOREIGN KEY (`client_id`) REFERENCES `clients` (`client_id`) ON DELETE CASCADE,
  CONSTRAINT `min_job_price` CHECK ((`budget` > 5))
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobs`
--

LOCK TABLES `jobs` WRITE;
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
INSERT INTO `jobs` VALUES (1,1,'Android App Development','I want to create an android app which does nothing',10,'open','2023-04-25 17:15:02',NULL,NULL),(9,2,'Hello World app in Python','Create me a hello world app in python programming language',100.32,'closed','2023-04-25 18:11:28','2023-04-26 15:27:29',NULL);
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `job_id` int unsigned DEFAULT NULL,
  `amount` double NOT NULL,
  `status` enum('pending','failed','success') NOT NULL DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `fk_job_payment_key` (`job_id`),
  CONSTRAINT `fk_job_payment_key` FOREIGN KEY (`job_id`) REFERENCES `jobs` (`job_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
INSERT INTO `payments` VALUES (1,9,76,'success','2023-04-26 14:42:50','2023-04-26 15:38:15');
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `proposals`
--

DROP TABLE IF EXISTS `proposals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `proposals` (
  `proposal_id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int unsigned DEFAULT NULL,
  `job_id` int unsigned DEFAULT NULL,
  `cover_letter` longtext NOT NULL,
  `bid_amount` decimal(10,0) DEFAULT '5',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `timeframe` int NOT NULL,
  `status` enum('accepted','declined','pending') NOT NULL DEFAULT 'pending',
  PRIMARY KEY (`proposal_id`),
  KEY `fk_proposals_user_key` (`user_id`),
  KEY `fk_propoals_job_key` (`job_id`),
  CONSTRAINT `fk_propoals_job_key` FOREIGN KEY (`job_id`) REFERENCES `jobs` (`job_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_proposals_user_key` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `min_bid_amount` CHECK ((`bid_amount` > 5))
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `proposals`
--

LOCK TABLES `proposals` WRITE;
/*!40000 ALTER TABLE `proposals` DISABLE KEYS */;
INSERT INTO `proposals` VALUES (2,1000,9,'This is a sample cover letter',76,'2023-04-26 13:28:23',2,'accepted');
/*!40000 ALTER TABLE `proposals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int unsigned NOT NULL AUTO_INCREMENT,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `location` varchar(255) DEFAULT NULL,
  `bio` varchar(255) DEFAULT 'Feeling Lucky',
  `profile_image` varchar(255) DEFAULT NULL,
  `gender` enum('male','female','others') NOT NULL,
  `account_type` enum('admin','client','freelancer') NOT NULL DEFAULT 'client',
  `dob` date NOT NULL,
  `verified` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=1013 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1000,'Sanmeet','Singh','ssanmeet123@gmail.com','c0d922b3a29268975b481a6fea588da5',NULL,'hello world',NULL,'male','freelancer','2002-01-01',1),(1001,'Rohit','Kumar','rohit_kuman@gmail.com','5f4dcc3b5aa765d61d8327deb882cf99',NULL,'Feeling Lucky',NULL,'male','client','1998-09-23',0),(1002,'Gaurav',NULL,'gaurav@gmail.com','5f4dcc3b5aa765d61d8327deb882cf99',NULL,NULL,NULL,'male','client','2023-04-24',1),(1003,'Bunny',NULL,'honeybunny@gmail.com','5f4dcc3b5aa765d61d8327deb882cf99',NULL,NULL,NULL,'male','client','2023-04-25',0);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'upwork'
--

--
-- Dumping routines for database 'upwork'
--
/*!50003 DROP PROCEDURE IF EXISTS `create_client` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `create_client`(
	in first_name  varchar(255), 
    in last_name varchar(255), 
    in email varchar(255),
    in password  varchar(255), 
    in location varchar(255), 
    in bio longtext, 
    in profile_image varchar(255), 
    in gender varchar(255), 
    in account_type varchar(255), 
    in dob date,
	in company_name varchar(255),
    in company_website varchar(255), 
    in company_size int, 
    in industry varchar(255)
)
BEGIN
		declare k int;
        set k = (select user_id + 1 from users order by user_id desc limit 1);
        
        start transaction;
	
        INSERT INTO users( user_id,first_name , last_name , email ,password , location , bio , profile_image ,
        gender , account_type, dob)
        VALUES(
          k,first_name ,last_name,email,password,location,bio,profile_image,gender,account_type ,
          dob
        );
        
        INSERT INTO  
        clients(user_id,company_name , company_website, company_size , industry) 
        VALUES (
          k, company_name , company_website , company_size , industry
        );
        commit;
		
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `create_concract` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `create_concract`(
  in  _pid int
)
BEGIN
	declare _fid int;
    declare _uid int;
    declare _jid int;
    declare amnt double;
    
    select  user_id  , bid_amount  , job_id into  _uid , amnt  , _jid from proposals where proposal_id = _pid;
    select freelancer_id into _fid from freelancers where user_id = _uid;
    
    if _fid is not null then 
		start transaction;
		
        insert into contracts (freelancer_id , job_id , payment_amount, start_date)
		values (
			fid  , _jid , amnt , current_date 
        );
        
        update jobs set status = 'progress' where job_id = _jid;
        update proposals set status = 'accepted' where proposal_id = _pid;
        
        commit;
    end if;
    
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `create_conract` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `create_conract`(
  in  _pid int
)
BEGIN
	declare _fid int;
    declare _uid int;
    declare _jid int;
    declare amnt double;
    
    select  user_id  , bid_amount  , job_id into  _uid , amnt  , _jid from proposals where proposal_id = _pid;
    select freelancer_id into _fid from freelancers where user_id = _uid;
    
    if _fid is not null then 
		start transaction;
		
        insert into contracts (freelancer_id , job_id , payment_amount, start_date)
		values (
			fid  , _jid , amnt , current_date 
        );
        
        update jobs set status = 'progress' where job_id = _jid;
        update proposals set status = 'accepted' where proposal_id = _pid;
        
        commit;
    end if;
    
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `create_contract` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `create_contract`(
  in  _pid int
)
BEGIN
	declare _fid int;
    declare _uid int;
    declare _jid int;
    declare amnt double;
    
    select  user_id  , bid_amount  , job_id into  _uid , amnt  , _jid from proposals where proposal_id = _pid;
    select freelancer_id into _fid from freelancers where user_id = _uid;
    
    if _fid is not null then 
		start transaction;
		
        insert into contracts (freelancer_id , job_id , payment_amount, start_date)
		values (
			_fid  , _jid , amnt , current_date 
        );
        
        update jobs set status = 'progress' where job_id = _jid;
        update proposals set status = 'accepted' where proposal_id = _pid;
        
        commit;
    end if;
    
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `create_freelancer` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `create_freelancer`(
	in first_name  varchar(255), 
    in last_name varchar(255), 
    in email varchar(255),
    in password  varchar(255), 
    in location varchar(255), 
    in bio longtext, 
    in profile_image varchar(255), 
    in gender varchar(255), 
    in account_type varchar(255), 
    in dob date,
    in skills varchar(255),
    in programming_languages varchar(255),
    in db varchar(255),
       in   langs varchar(255),
         in other_skills varchar(255),
          in edu varchar(255)
)
BEGIN
		declare k int;
        set k = (select user_id + 1 from users order by user_id desc limit 1);
        
        start transaction;
	
        INSERT INTO users( user_id,first_name , last_name , email ,password , location , bio , profile_image ,
        gender , account_type, dob)
        VALUES(
          k,first_name ,last_name,email,password,location,bio,profile_image,gender,account_type ,
          dob
        );
        
        INSERT INTO  
        freelancers(user_id, skills,programming_languages,`databases`,languages,other_skills,education) 
        VALUES (
          k,skills,programming_languages,db,
          langs, other_skills, edu
        );
        commit;
		
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `create_job` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `create_job`(
	in _user_id int,
    in title varchar(255),
    in description longtext,
    in budget double
)
BEGIN
	declare k int ;
	set k = (select client_id from clients where user_id = _user_id limit 1);
    
    if k is not null then 
		start transaction;
		insert into jobs (client_id , title , description , budget  , status)
		values 
		(k , title , description , budget , 'open');
		commit; 
	end if; 
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `create_proposal` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `create_proposal`(
	in _uid int,
    in _jid int ,
    in cover_letter longtext,
    in timeframe int,
    in bid_amount double
)
BEGIN
	declare _fid int;
    
	select freelancer_id into _fid from freelancers where user_id = _uid;
    
    if _fid is not null then 
		INSERT INTO proposals(user_id, job_id , cover_letter , timeframe , bid_amount , status) 
		VALUES (
			_uid,_jid, cover_letter , timeframe ,bid_amount, 'pending'
        );
    end if;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `end_contract` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `end_contract`(
	in _cid int
)
BEGIN
	declare _jid int;
    declare _fid int;
    declare _job_status varchar(255);
    declare _amnt double;
    
	select job_id  , freelancer_id   , payment_amount into _jid  , _fid , _amnt 
    from contracts where contract_id = _cid;
    
    select status into _job_status from jobs where job_id = _jid;
    
    if _job_status = 'closed' then 
		start transaction ; 
			
			update contracts set end_date = current_date
			where contract_id = _cid;
			
            insert into payments (job_id  , amount , status ) 
            values(_jid , _amnt , 'pending');

		commit;
    end if;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `end_job` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `end_job`(
	in _jid int
)
BEGIN
	start transaction ;
		update jobs set status = 'closed',
        closed_at = current_timestamp
        where job_id = _jid;
    commit;    
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-04-26 21:12:05
