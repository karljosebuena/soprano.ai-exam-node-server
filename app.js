require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const mongoose = require('./config/connection');
const cors = require('cors');
const bodyParser = require('body-parser');
const pkg = require('./package.json');

const authRoutes = require('./routes/auth.routes');
const postRoutes = require('./routes/post.routes');

const whitelist = ['http://localhost:4200']
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
app.options('*', cors(corsOptions));
app.use(cors());
app.use(morgan('dev'));
// app.use(express.urlencoded({ extended: false }));
// app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Routes
app.get('/', (req, res) => {
    res.json({
        author: app.get('pkg').author,
        name: app.get('pkg').name,
        description: app.get('pkg').description,
        version: app.get('pkg').version
    })
});
app.use('/api/auth', authRoutes);
// protected route
app.use('/api/posts', postRoutes);

app.listen(process.env.SEVER_PORT, () => {
    console.log(`Server running on port: ${process.env.SEVER_PORT}`)
});