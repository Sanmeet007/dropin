use campusx;

start transaction ; 

update person  set balance = 800
where id = 1;
commit;
set autocommit = 0; 

update person set balance = 1200
where id = 4;

rollback;

use upwork;
select * from person;

select * from freelancers;
 
 
 CREATE TABLE withdrawals (
  id SERIAL PRIMARY KEY,
  freelancer_id INTEGER UNSIGNED, 
  amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(20) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  constraint `fk_freelancer_withdrawal_key` FOREIGN KEY (freelancer_id) references freelancers(freelancer_id)
);

select * from contracts natural join freelancers natural join users where user_id = 1000 ;
select * from withdrawals natural join freelancers natural join users where user_id = 1000;
select * from proposals where user_id = 1000;


select * from jobs;
select   user_id , client_id,  t.job_id,t.status , t.created_at  , t.updated_at, amount from payments t inner join jobs j on j.job_id = t.job_id 
natural join clients where user_id = 1002;

desc payments;


select *,(select count(*)  from proposals t2 where job_id = t.job_id)  as 'proposal_count'
from jobs t 
join clients c where t.client_id = c.client_id
and user_id = 1002; 



select * from clients;
select * from users;

desc payments;
desc contracts;

desc withdrawals;




select  user_id ,  client_id, t.job_id,t.status , t.created_at  , t.updated_at, amount from payments t inner join jobs j on j.job_id = t.job_id natural join clients where user_id = 1002;




select * from contracts c 
inner join jobs j  on j.job_id = c.job_id;



select * from contracts c inner join freelancers f on f.freelancer_id = c.freelancer_id 
join users u on u.user_id  = f.user_id;



select * from contracts c inner join jobs j on c.job_id = j.job_id 
join clients cl on cl.client_id = j.client_id
join freelancers f on f.freelancer_id = c.freelancer_id
where cl.user_id = ? OR  f.user_id  = ?;


select * from payments p inner join jobs j on j.job_id = p.job_id 
inner join clients c on c.client_id = j.client_id
inner join users u on u.user_id = c.user_id 
where c.user_id = 1002;

select * from payments;


select * from jobs j
inner join clients c on  c.client_id = j.client_id;

update payments 
set status = 'success'
where  job_id  = (select j.job_id from contracts  c
inner join jobs j on  j.job_id = c.job_id  where c.contract_id = 0);

select * from payments;

desc jobs;
desc users;
desc proposals;
desc withdrawals;