const express = require('express');
const bodyParser= require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const port = process.env.port || 8000;

const app = express();
app.set('view engine','ejs')
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB",{useNewUrlParser:true});

const wikiSchema = {
    title:String,
    content: String
};

const Article = mongoose.model('Article',wikiSchema);


app.route("/articles")
.get((req,res)=>{
    Article.find({},(err,foundArticle) =>{
    if(err){
        console.log(err);
    }else{
        res.send(foundArticle);
    }
    });
    })
.post( (req,res) =>{
    // console.log(req.body.title);
    // console.log(req.body.content);
        const newArticle = new Article({
            title: req.body.title,
            content:req.body.content
        });
        newArticle.save((err)=>{
            if(!err){
                res.send("success");
            }
            else{
                res.send(err);
            }
        });
})
.delete((req,res) =>{
    Article.deleteMany((err)=>{
        if(!err){
            res.send("success in deleteion");
        }
        else{
            res.send(err);
        }
    })
});


////////////////////////////////Requests Targetting A Specific Article////////////////////////

app.route("/articles/:articleTitle")

.get(function(req, res){

  Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
    if (foundArticle) {
      res.send(foundArticle);
    } else {
      res.send("No articles matching that title was found.");
    }
  });
})

.put(function(req, res){

  Article.update(
    {title: req.params.articleTitle},
    {title: req.body.title, content: req.body.content},
    {overwrite: true},
    function(err){
      if(!err){
        res.send("Successfully updated the selected article.");
      }
    }
  );
})

.patch(function(req, res){

  Article.update(
    {title: req.params.articleTitle},
    {$set: req.body},
    function(err){
      if(!err){
        res.send("Successfully updated article.");
      } else {
        res.send(err);
      }
    }
  );
})

.delete(function(req, res){

  Article.deleteOne(
    {title: req.params.articleTitle},
    function(err){
      if (!err){
        res.send("Successfully deleted the corresponding article.");
      } else {
        res.send(err);
      }
    }
  );
});






app.listen(port,()=>{
    console.log("listing");
});