const express = require("express");
const { requireSignIn } = require("../controllers/userController");
const {
  createPostController,
  getAllPostsController,
  getUserPostController,
  deletePostController,
  updatePostController,
} = require("../controllers/postController");

//router object
const router = express.Router();

//create POST|| POST
router.post("/create-post", requireSignIn, createPostController);

//get all posts
router.get("/get-all-post", getAllPostsController);

//get user posts
router.get("/get-user-post",requireSignIn, getUserPostController);

//delete user posts
router.delete("/delete-post/:id",requireSignIn, deletePostController);

//update user posts
router.put("/update-post/:id",requireSignIn, updatePostController);
module.exports = router;
