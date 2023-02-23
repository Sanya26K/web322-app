/*********************************************************************************
*  WEB322 – Assignment 02
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name:  Sanya Khurana    Student ID:  146381215    Date:  3rd Feb,2023
*
*  Cyclic Web App URL: https://drab-blue-salmon-ring.cyclic.app
*
*  GitHub Repository URL: ___https://github.com/Sanya26K/web322-app ______
*
********************************************************************************/ 

const express = require("express");
const multer = require("multer");
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

const path = require("path");
const { initialize, getAllPosts, getPublishedPosts, getCategories, addPost, getPostById, getPostsByMinDate, getPostsByCategory} = require("./blog-service.js");
const app = express();

app.use(express.static('public')); 

cloudinary.config({
  cloud_name: 'dr5snoefj',
  api_key: '469577987212484',
  api_secret: 'EvyRhA3lPThceE-Es68hZbkn-Uw',
  secure: true
});

const upload = multer(); 

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
    const { category, minDate } = req.query;
  
    if (category) {
      getPostsByCategory(category)
        .then(posts => res.json(posts))
        .catch(error => res.status(500).json({ error: error.message }));

    } else if (minDate) {
      getPostsByMinDate(minDate)
        .then(posts => res.json(posts))
        .catch(error => res.status(500).json({ error: error.message }));

    } else {
    getAllPosts()
      .then((data) => {
      res.send(data)
    })
    .catch((err) => {
      res.send(err);
    })
  }
  });
  
  
app.get("/post/:value", (req, res) => {
  getPostById(req.params.value)
  .then((data) => {
    res.send(data);
  })
  .catch((err) => {
    res.send(err);
    });
})


app.get("/categories", (req, res) => {
  getCategories()
  .then((data) => {
    res.send(data)
  })
  .catch((err) => {
    res.send(err);
  })
})

app.get('/posts/add', (req, res) => {
  res.sendFile(path.join(__dirname, "views", "addPost.html"));
});

app.post('/posts/add', upload.single('featureImage'), (req, res) => {
  if (req.file) {
    let streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream(
          (error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          }
        );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };

    async function upload(req) {
      let result = await streamUpload(req);
      console.log(result);
      return result;
    }

    upload(req).then((uploaded) => {
      processPost(uploaded.url, req, res);
    });
  } else {
    processPost('', req, res);
  }

  function processPost(featureImage, req, res) {
    const postData = req.body;
    postData.featureImage = featureImage;
  
    addPost(postData).then((newPost) => {
      console.log(`Added new post: ${JSON.stringify(newPost)}`);
      res.redirect('/posts');
    }).catch((err) => {
      console.error(`Error adding new post: ${err}`);
      res.status(500).send('Internal Server Error');
    });
  }
});


app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "views", "notFoundPage.html"));
})

initialize().then(() => {
  app.listen(HTTP_PORT, () => {
    console.log("Express http server listening on: " + HTTP_PORT);
  });
})
