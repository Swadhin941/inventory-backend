require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 4000;
const access_token = process.env.ACCESS_TOKEN || "";
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const mongodb_URL= process.env.MONGO_DB
module.exports = { express, app, cors, port, jwt, bcrypt, saltRounds, access_token, mongodb_URL };
