const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

//bring routes
const blogRoutes = require('./routes/blog');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

//app
const app = express();

//db
mongoose
.connect(process.env.DATABASE_CLOUD, {useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false})
.then(() => console.log('DB connected'))
.catch(err => {
    console.log(err);
});

//const uri = "mongodb+srv://blogAdmin:Mahmoud2020@newshuescluster.48hxz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
//const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
//console.log('DB connected');

//middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());

//cors
if (process.env.NODE_ENV === 'development') {
    app.use(cors({ origin: `${process.env.CLIENT_URL}` }));
}

//routes middleware
app.use('/api',blogRoutes);
app.use('/api',authRoutes);
app.use('/api',userRoutes);

//port
const port = process.env.PORT || 8000;
app.listen(port, ()=>{
  console.log(`Server is running on port ${port}`);
});
