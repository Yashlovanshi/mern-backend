const asyncHandler = require("express-async-handler");
const Category = require("../../models/Categories/Category");
const Post =  require("../../models/Posts/Post");
const User = require("../../models/Users/User");

//@desc Create a new post
//@route POST /api/v1/posts
//@access private

exports.createPost = asyncHandler(async(req,resp,next) => {
    //Get the payload
    const {title, content, categoryId} = req.body;
    console.log("title", title);


    //Check if post is present
    const postFound = await Post.findOne({title});
    if(postFound) {
        let error = new Error("Post already existing");
        next(error);
        return;
    }


    //Create the Object
    const post = await Post.create({
        title,
        content,
        category: categoryId,
        author:req?.userAuth?._id,
    });


    //Update user by adding post in it
    const user = await User.findByIdAndUpdate(
        req?.userAuth?._id,
        {
            $push: {posts: post._id},
        },
        {
            new: true,
        }
    );

    //Update Category by adding in it
    const catg = await Category.findByIdAndUpdate(
        categoryId,
        {$push: { posts: post._id}},
        {new: true }
    );

    // send the response
    resp.json ({
        status: "success",
        message: "Post created successfully",
        post,
        user,
        catg,
    });
});

//@desc Get All Posts
//@route GET /api/v1/posts
//@access public
exports.getAllPosts = asyncHandler(async(req,res)=> {
    //fetch all the posts from the DB
    const allposts = await Post.find()
    //send the response
    resp.json({
        status: "success",
        message: "All posts fetched successfully",
        allposts,
    });
});

//@desc Get Single Posts
//@route GET /api/v1/posts/:id
//@access public
exports.getPost = asyncHandler(async(req,resp)=> {
    // get the id
    const postId = req.params.id;
    //fetch the post corresponding to this id
    const post = await Post.findById(postId);
    if(post) {
        //send the response
        resp.json({
            status: "success",
            message: "Post fetched successfully",
            post,
            });
    } else {
        //send the response
        resp.json({
            status: "success",
            message: "No post available for the given id",
            });
    }

});

//@desc Delete Post
//@route DELETE /api/v1/posts/:id
//@access private
exports.deletePost = asyncHandler(async(req,res)=> {
    // Get the id
    const postId = req.params.id;

    //Delete this post from the DB
    await Post.findByIdAndDelete(postId);
    //send the response
    resp.json({
        status: "success",
        message: "Post deleted Successfully"
        });
});

//@desc Update Post
//@route PUT /api/v1/posts/:id
//@access private
  exports.updatePost = asyncHandler(async(req,res)=> {
    // Get the id
    const postId = req.params.id;
    // Get the post object from req
    const post = req.body;
   
    //Update this post in the DB
    const updatedPost = await Post.findByIdAndUpdate(postId, post, {
        new: true,
        runValidators: true,
        });
        //send the response
        resp.json({
            status: "success",
            message: "Post updated successfully",
            updatedPost,
    });
  });
    
    

