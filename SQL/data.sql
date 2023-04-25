insert into users(
	first_name , 
	last_name,
    email,
    password,
    gender,
    account_type,
    dob
) values(
	'Rohit' , 'Kumar' , 'rohit_kuman@gmail.com' , 'password' , 'male' , 'client' , '1998-09-23'
);

update users
set account_type = 'freelancer';

insert into freelancers(user_id) values(1000);

select * from freelancers;
update freelancers
set skills = "web development,UI/UX,Full Stack developer",
programming_languages = 'javascript,html,css,php',
`databases` = 'mysql,postgres',
languages = 'english,hindi,punjabi',
education="+2"
where freelancer_id = 1;


insert into clients(user_id, company_name) values(
1001, "Rohit productions");

call create_freelancer('Binit',NULL,'binit19@gmail.com','5f4dcc3b5aa765d61d8327deb882cf99',NULL,NULL,NULL,'male','freelancer'
,'2023-04-24', NULL , NULL , NULL , NULL , NULL, NULL);

call create_client('Gaurav',NULL,'gaurav@gmail.com','5f4dcc3b5aa765d61d8327deb882cf99',NULL,NULL,NULL,'male','client'
,'2023-04-24', "cant be null" , NULL , NULL , NULL );

select * from users;

