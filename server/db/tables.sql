
--- USER TABLE ---
create table users(
 user_id varchar(100) primary key not null unique,
 first_name varchar(255) not null,
 last_name varchar(255),
 user_email varchar(255) not null unique,
 user_password varchar(255),
 gender char(1),
 phone varchar(25) unique,
 user_image varchar(255),
 bio text,
 city varchar(255),
 country_code varchar(10),
 profession varchar(255),
 country varchar(255),
 refresh_token varchar(255) not null unique,
 third_party_login boolean default false,
 created_at timestamp default now()
)

--- USERS SOCIALS --- 
CREATE TABLE user_socials(
 user_id varchar(100) references users(user_id) on delete cascade,
 user_linkedin varchar(150),
 user_github varchar(150),
 user_instagram varchar(150),
 user_twitter varchar(150),
 user_reddit varchar(150),
 user_facebook varchar(150),
 user_random_social varchar(150),
 created_at timestamp default now()
)

--- CHECK_SOCAILS --- 
CREATE TABLE check_socials(
 user_id varchar(100),
 social_link varchar(150),
 primary key (user_id,social_link)
)