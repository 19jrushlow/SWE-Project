# Dependencies



## Node.Js Setup Instructions:

Node.js is required to initialize the project, it can be installed at: https://nodejs.org/en.

To set up the config file, navigate to ./config/. Make a copy of the file ".env.example", and rename it to ".env".

Npm is used to install dependencies. Further information can be found in BUILD.md



##  Postgres Setup Instructions

If you are using a database hosted online, fill out the .env with the information necessary to connect. If set up correctly, it will connect successfully.

To host a database locally, first download the postgreSQL server at https://www.postgresql.org/. Once you have done that, launch the pgAdmin gui to perform a couple setup steps.
The first thing you need to do is create a database. Navigate to the top left, and open up the Server tab and the PostgreSQL tab.

![image](https://github.com/user-attachments/assets/b71df0c2-a086-4e1c-bff9-f6bd5911c545)

It should look like this. Right click the Databases(1) tab, and create a new database. Name it whatever you like.

![image](https://github.com/user-attachments/assets/87314651-8b1a-4543-b858-29dcfe348a10)

Next, we will need to create a user profile. Navigate to the Login/Group Roles section below Databases.

![image](https://github.com/user-attachments/assets/9156fa49-c766-426c-be97-00eeec1581da)

![image](https://github.com/user-attachments/assets/e4e769d7-4860-42ac-b71b-836b017309e8)


Right click the tab, and create a new login/group role. The name you set will be the username. Go into the definition tab, and set the password. Then go to the privileges tab, and set necessary privileges. Make sure the user can login.

Finally, we will set up the .env. The name of the database you created is what you will set PGDatabase to in the .env. Set PGPort to whatever you chose during installation. PGHost can stay localhost if you are hosting locally.  Set PGUser and PGPassword according to the user profile you created.
