/*********************************************************************************
*  WEB322 – Assignment 02
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name:  Sanya Khurana    Student ID:  146381215    Date:  3rd Feb,2023
*
*  Cyclic Web App URL: ___https://drab-blue-salmon-ring.cyclic.app/___
*
*  GitHub Repository URL: ___https://github.com/Sanya26K/web322-app ______
*
********************************************************************************/ 

const express = require("express");
const path = require("path");
const { initialize, getAllPosts, getPublishedPosts, getCategories } = require("./blog-service.js");

const app = express();

app.use(express.static('public')); 

const HTTP_PORT = process.env.PORT || 8080;

app.get("/", (req,res) => {
  res.redirect("/about");
});

app.get("/about", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "about.html"));
})

app.get("/blog", (req, res) => {
  getPublishedPosts()
  .then((data) => {
    res.send(data)
  })
  .catch((err) => {
    res.send(err);
  })
});

app.get("/posts", (req, res) => {
  getAllPosts()
    .then((data) => {
      res.send(data)
    })
    .catch((err) => {
      res.send(err);
    })
});

app.get("/categories", (req, res) => {
  getCategories()
  .then((data) => {
    res.send(data)
  })
  .catch((err) => {
    res.send(err);
  })
})

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "views", "notFoundPage.html"));
})

initialize().then(() => {
  app.listen(HTTP_PORT, () => {
    console.log("Express http server listening on: " + HTTP_PORT);
  });
})
