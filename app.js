var methodOverride = require("method-override"),
bodyParser         = require("body-parser"),
expressSanitizer   = require("express-sanitizer"),
mongoose           = require("mongoose"),
express            = require("express"),
app                = express();

//APP CONFIG
mongoose.connect("mongodb://localhost:27017/restful_blog_app", { useNewUrlParser: true });
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

//MONGOOSE/MODEL CONFIG
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});
var blog = mongoose.model("Blog", blogSchema);

//RESTful ROUTES CONFIG
app.get("/", function(req, res){
    res.redirect("/blogs")
});
//INDEX ROUTE
app.get("/blogs", function(req, res){
    blog.find({}, function(err, blogs){
        if(err){
            console.log("Errors")
        }else{
            res.render("index", {blogs: blogs})
        }
    })
});

//NEW ROUTE
app.get("/blogs/new", function(req, res){
    res.render("newPost")
});
//CREATE ROUTE
app.post("/blogs", function(req, res){
    //create blog
    req.body.blog.body = req.sanitize(req.body.blog.body);
    blog.create(req.body.blog, function(err, newPost){
        if(err){
            res.render("newPost");
        }else{
            //then redirect
            res.redirect("/blogs");
        }
    })
});
//SHOW ROUTE
app.get("/blogs/:id", function(req, res){
blog.findById(req.params.id, function(err, foundPost){
    if(err){
        res.redirect("/blogs");
    }else{
        res.render("showMore", {blog: foundPost});
    }
})
});
//EDIT ROUTE
app.get("/blogs/:id/edit", function(req, res){
    blog.findById(req.params.id, function(err, foundPost){
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("editPost", {blog: foundPost});
        }
    })
});

//UPDATE ROUTE
app.put("/blogs/:id", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err,updatedPost){
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs/" + req.params.id);
        }
    } )
});

//DELETE
app.delete("/blogs/:id", function(req, res){
    blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs");
        }
    })
})







app.listen(3000, function(){
    console.log("SERVER IS RUNNING");
})

