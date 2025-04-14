import * as Loader from "./services/loader"
import * as ProgressTracker from "./services/progresstracker"
import { Request, Response } from 'express';

const express = require('express');
const path = require('path');
const session = require('express-session');
const bodyParser = require('body-parser'); 
const app = express();
declare module 'express-session' {
    interface SessionData {
      userId?: number;
    }
  }

// Import Routes
const homeRoutes = require('./routes/home');
const IDERoutes = require('./routes/IDE');
const loginRoutes = require('./routes/login');
const problemRoutes = require('./routes/problem');
const signUpRoutes = require('./routes/signup'); 
const userEditRoutes = require('./routes/useredit');
const userProfileRoutes = require('./routes/userprofile');
const sandboxRoutes = require('./routes/sandbox');

const AppDataSource = require('./models/data-source').default;
const { User } = require('./models/user');
import { UserAchievement } from './models/user-achievement';


// Resolve configurations
const config = require('./config/config.js');
const port = config.port;


// Initialize Database
AppDataSource.initialize()
    .then(() => {
        console.log("DB connection success");

        // Load/sync achievements
        Loader.loadAllAchievements("./assets/achievements/data");

        // Load/sync problems
        Loader.loadAllProblems("./assets/problems");
    })
    .catch((error: any) => {
        console.error("Database connection error:", error);
        process.exit(1);
    });

// Middleware
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// Serve Static Files
app.use(express.static(path.join(__dirname, 'controllers', 'static')));
app.use(express.static(path.join(__dirname, 'views', 'static')));

app.use('/', homeRoutes);
app.use('/', signUpRoutes); 
app.use('/', loginRoutes);
app.use('/IDE', IDERoutes);
app.use('/', userEditRoutes);
app.use('/', userProfileRoutes);
app.use(problemRoutes);
app.use(sandboxRoutes)

// API to Get User Session
app.get('/api/user/session', async (req: Request, res: Response) => {
    if (!req.session || !req.session.userId) {
      return res.status(401).json({ error: 'User not logged in' });
    }
  
    try {
      const userRepository = AppDataSource.getRepository(User);
  
      // Step 1: Get basic user
      const user = await userRepository.findOneBy({ id: req.session.userId });
  
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      // Step 2: Manually get achievements for this user
      const userAchievementRepository = AppDataSource.getRepository(UserAchievement);
      const userAchievements = await userAchievementRepository.find({
        where: { userId: user.id },
        relations: ["achievement"]
      });
  
      const achievements = userAchievements.map((ua: UserAchievement) => ua.achievement);
  
      // Step 3: Return everything together
      res.json({
        id: user.id,
        username: user.username,
        email: user.email,
        achievements
      });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ error: "Server error" });
    }
  });

// Logout Route
app.post('/logout', (req: Request, res: Response) => {
    req.session.destroy((error: any) => {
        if (error) {
            return res.status(500).json({ error: 'Logout failed' });
        }
        res.redirect('/login');
    });
});

// Start the Server
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
