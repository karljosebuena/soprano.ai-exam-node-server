const mongoose = require('mongoose');

// Config DB Connection
const mongoDB = process.env.DB_CONNECTION;

mongoose.connect(mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
});
mongoose.Promise = global.Promise;

module.exports = mongoose;
