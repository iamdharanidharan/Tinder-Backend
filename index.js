const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require('dotenv');
const cors = require('cors');

const port = process.env.PORT || 3000;
dotenv.config();

//DB connection
mongoose.connect(
    process.env.DB_CONNECT,
    { useNewUrlParser : true, useUnifiedTopology: true },
    () => console.log('connected to DB')
    );    

//Routes
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");

//Middlewares
app.use(cors());
app.use(express.json());
app.use("/auth",authRoute);
app.use("/user",userRoute);


app.listen(port,() => {
    console.log("App started at ",port);
});