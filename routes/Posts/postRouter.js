const express = require("express");
const {
	createPost,
	getAllPosts,
	getPost,
	deletePost,
	updatePost,
} = require("../../controllers/Posts/postsController");
const isLoggedIn = require("../../middlewares/isLoggedIn");
const postsRouter = express.Router();

//?Create POST route
postsRouter.post("/", isLoggedIn, createPost);

//?Get All POSTS route
postsRouter.get("/", getAllPosts);

//?Get A Single POST route
postsRouter.get("/:id", getPost);

//?Delete POST
postsRouter.delete("/:id", isLoggedIn, deletePost);

//?Update POST
postsRouter.put("/:id", isLoggedIn, updatePost);

module.exports = postsRouter;
