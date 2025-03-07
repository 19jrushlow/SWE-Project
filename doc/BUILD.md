# Build



## Running and testing (Windows):

If you are doing this in a terminal, the following commands are available:
- `npm run clean-install`: Performs a clean install of dependencies.
- `npm run setup`: Performs a regular install of dependencies (Must be used if package.json & package-lock.json aren't synced)
- `npm run win-build`: Creates a dist folder which contains a copy of the project's architecture. Compiles all typescript files, and copies over /views,  the .env and any plain javascript files.
- `npm run start`: Starts the webserver.
- `npm run win-build & start`: self explanatory
- `npm run test`: Nothing yet



If you are doing this in vscode:

Once you have downloaded the repository, in the top right of the explorer menu click this button, and then ensure that NPM Scripts has a check next to it.

![Step1](https://github.com/user-attachments/assets/ab932a66-394f-4b82-abef-33768771c5d6)

![Step2](https://github.com/user-attachments/assets/3c35fdce-fe97-4536-ad55-9d4ce96f463b)

Then, navigate to the bottom of the explorer:

![image](https://github.com/user-attachments/assets/45b97c69-be46-4c4d-8f55-cc4d957dc2d0)

You can run the NPM scripts listed above from here.

