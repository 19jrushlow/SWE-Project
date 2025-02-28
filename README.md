# SWE-Project
**Setup & Installation instructions:**

Node.js is required to initialize the project, it can be installed at: https://nodejs.org/en.

Once you have installed Node.js, run setup.bat to automatically install dependencies. 

Or, you can manually do this by changing directory to the project directory and then running the command npm run setup.

**Running and testing:**

If you are doing this in a terminal, run the command npm run compile to compile all typescript files into javascript. Run the command npm run server to start the webserver. 

If you are doing this in vscode:

Once you have downloaded the repository, in the top right of the explorer menu click this button, and then ensure that NPM Scripts has a check next to it.
![Step1](https://github.com/user-attachments/assets/ab932a66-394f-4b82-abef-33768771c5d6)
![Step2](https://github.com/user-attachments/assets/3c35fdce-fe97-4536-ad55-9d4ce96f463b)

Then, navigate to the bottom of the explorer:

![Step2](https://github.com/user-attachments/assets/1da2ab2f-bb53-4176-b84a-c03dc979f1a4)

You can run the NPM scripts from here. Setup performs a clean install of the dependencies, compile will compile all typescript files, and server will run the webserver.

To start the server, run the command "npm run server".

Sources:

- Compiler explorer: https://godbolt.org/
- Ace editor: https://ace.c9.io/
