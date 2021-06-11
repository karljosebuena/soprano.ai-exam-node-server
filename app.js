require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const mongoose = require('./config/connection');
const cors = require('cors');
const pkg = require('./package.json');

const authRoutes = require('./routes/auth.routes');
const postRoutes = require('./routes/post.routes');
const bodyParser = require('body-parser');
const { json } = require('body-parser');

const whitelist = [
    'http://localhost',
    'http://localhost:4200'
]
const corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
}

const app = express();

// DB settings
mongoose.connection.on('connecting', function () {
    console.info("trying to establish a connection to mongo");
});
mongoose.connection.on('connected', function () {
    console.info("connection established successfully");
});
mongoose.connection.on('error', function (err) {
    console.error('connection to mongo failed ' + err);
});
mongoose.connection.on('disconnected', function () {
    console.info('mongo db connection closed');
});

// Settings
app.set('pkg', pkg);

// Middlewares
// for addressing preflight cors issue
app.options('*', cors(corsOptions));
// for securing requests (right now I only allow requests from localhost and localhost:4200)
app.use(cors(corsOptions));
// for handling logs output (dev argument gives concise output colored by response status for development use)
app.use(morgan('dev'));
// express.urlencoded replaces bodyParser used in earlier versions of express json.
// This is used to tell express to recognize the incoming request object as strings or arrays.
// And by setting extended option to false the URL-encoded data will be parsed with the querystring library.
app.use(express.urlencoded({ extended: false }));
// We are just telling express  to recognize the incoming Request Object as a JSON Object
app.use(express.json());

// Routes
// Route just to give info about the server (details in package.json)
app.get('/', (req, res) => {
    res.json({
        author: app.get('pkg').author,
        name: app.get('pkg').name,
        description: app.get('pkg').description,
        version: app.get('pkg').version
    })
});
// Route mapped to endpoints signup and login
// We don't need to make this authenticated (we don't have the token yet)
app.use('/api/auth', authRoutes);
// Route mapped to endpoints for posts CRUD
// Each endpoints for posts are secured via middleware authToken.verifyToken
// where it checks is login has the required token and is NOT expired
app.use('/api/posts', postRoutes);

// Just telling express to listen requests coming from port 3000 (this is what we specify in .env file)
app.listen(process.env.SEVER_PORT, () => {
    console.log(`Server running on port: ${process.env.SEVER_PORT}`)
});