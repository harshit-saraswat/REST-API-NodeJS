const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');

// Server Setup
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static('public'));

// MongoDB Setup
mongoose.connect("mongodb://localhost:27017/wikiDB", { useUnifiedTopology: true, useNewUrlParser: true });

// Article Schema
const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "No title specified."]
    },
    content: {
        type: String,
        required: [true, "No content specified."]
    }
});

// Article Model
const Article = mongoose.model("Article", articleSchema);

// articles route
app.route('/articles')
    // Get All Articles
    .get(function (req, res) {
        Article.find(function (err, foundArticles) {
            if (!err) {
                res.send(foundArticles);
            } else {
                res.send('Error Occured:' + err);
            }
        });
    })
    // Post New Article
    .post(function (req, res) {
        const title = req.body.title;
        const content = req.body.content;
        const newArticle = new Article({
            title: title,
            content: content
        });
        newArticle.save(function (err) {
            if (!err) {
                res.send("Successfully Added a new article");
            } else {
                res.send('Error Occured:' + err);
            }
        });
    })
    // Delete all Articles
    .delete(function (req, res) {
        Article.deleteMany(function (err) {
            if (!err) {
                res.send("Successfully Deleted all articles");
            } else {
                res.send('Error Occured:' + err);
            }
        });
    });

// articles/articleTitle route
app.route('/articles/:articleTitle')
    // Get Specific Article
    .get(function (req, res) {
        Article.findOne({ title: req.params.articleTitle }, function (err, foundArticle) {
            if (foundArticle) {
                res.send(foundArticle);
            } else {
                res.send('No Articles found for given title');
            }
        });
    })
    // Put a Specific Article
    .put(function (req, res) {
        Article.update({ title: req.params.articleTitle },
            { title: req.body.title, content: req.body.content },
            { overwrite: true },
            function (err) {
                if (!err) {
                    res.send("Successfully Updated the article");
                } else {
                    res.send('Error Occured:' + err);
                }
            }
        );
    })
    // Delete a Specific Article
    .delete(function (req, res) {
        Article.deleteMany(function (err) {
            if (!err) {
                res.send("Successfully Deleted all articles");
            } else {
                res.send('Error Occured:' + err);
            }
        });
    });



// Run Server
app.listen(3000, function () {
    console.log("Server Started at port 3000.");
});