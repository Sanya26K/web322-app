const fs = require('fs');
const { resolve } = require('path');
const path = require("path");
let posts = [];
let categories = [];


function initialize() {
    return new Promise((resolve, reject) => {
      fs.readFile('./data/posts.json', 'utf8', (err, data) => {
        if (err) {
          reject("Unable to read posts file");
          return;
        }
  
        posts = JSON.parse(data);
  
        fs.readFile('./data/categories.json', 'utf8', (err, data) => {
          if (err) {
            reject("Unable to read categories file");
            return;
          }
  
          categories = JSON.parse(data);
          resolve();
        });
      });
    });
  }
  
function getAllPosts() {
    return new Promise((resolve, reject) => {
        if (posts.length === 0) {
            reject("No results returned");
        } else {
            resolve(posts);
        }
    })
}

function getPublishedPosts() {
    return new Promise((resolve, reject) => {
        let publishedPosts = [];
        posts.forEach((post) => {
            if (post.published === true) {
                publishedPosts.push(post);
            }
        })

        if (publishedPosts.length > 0) {
            resolve(publishedPosts);
        } else {
            reject("No results returned");
        }
    })    
}

function getCategories() {
    return new Promise((resolve, reject) => {
        if (categories.length === 0) {
            reject("No results returned");
        } else {
            resolve(categories);
        }
    })
}

function getPostsByCategory(category) {
    return new Promise((resolve, reject) => {
      const updatedPosts = posts.filter(post => post.category === category);
      if (updatedPosts.length > 0) {
        resolve(updatedPosts);
      } else {
        reject("no results returned");
      }
    });
  }

  function getPostsByMinDate(minDateStr) {
    return new Promise((resolve, reject) => {
      const updatedPosts = getPosts().filter(post => {
        const postDate = new Date(post.postDate);
        const minDate = new Date(minDateStr);
        return postDate >= minDate;
      });
  
      if (updatedPosts.length > 0) {
        resolve(updatedPosts);
      } else {
        reject("No results returned");
      }
    });
  }  

  function getPostById(id) {
    return new Promise((resolve, reject) => {
      const updatedPost = posts.find(post => post.id === id);
      if (updatedPost) {
        resolve(updatedPost);
      } else {
        reject("no result returned");
      }
    });
  }
  
  

function addPost(postData) {
  return new Promise((resolve, reject) => {
    postData.published = !!postData.published;
    postData.id = posts.length + 1;
    posts.push(postData);
    resolve(postData);
  });
}

module.exports = { initialize, getAllPosts, getPublishedPosts, getCategories, addPost, getPostById, getPostsByMinDate, getPostsByCategory };