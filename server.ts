import * as Loader from "./services/loader"

const express = require('express');
const { Request: ExpressRequest, Response: ExpressResponse } = require('express');
const path = require('path');
const session = require('express-session');
const bodyParser = require('body-parser'); 
const app = express();

// Import Routes
const homeRoutes = require('./routes/home');
const IDERoutes = require('./routes/IDE');
const loginRoutes = require('./routes/login');
const problemRoutes = require('./routes/problem');
const signUpRoutes = require('./routes/signup'); 
const userProfileRoutes = require('./routes/userprofile');

const AppDataSource = require('./models/data-source').default;
const { User } = require('./models/user');

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
app.use('/', userProfileRoutes);
app.use(problemRoutes);

// API to Get User Session
app.get('/api/user/session', async (req: typeof ExpressRequest, res: typeof ExpressResponse) => {
  if (!req.session || !req.session.userId) {
      return res.status(401).json({ error: 'User not logged in' });
  }

  try {
      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOne({ where: { id: req.session.userId } });

      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }

      console.log("Sending user session:", { id: user.id, email: user.email });
      res.json({ id: user.id, email: user.email });
  } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ error: 'Server error' });
  }
});


// Logout Route
app.post('/logout', (req: typeof ExpressRequest, res: typeof ExpressResponse) => {
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
