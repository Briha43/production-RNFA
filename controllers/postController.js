const postModel = require("../models/postModel");

//create post
const createPostController = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title || !description) {
      return res.status(500).send({
        success: false,
        message: "please provide all Fields",
      });
    }
    const post = await postModel({
      title,
      description,
      postedBy: req.auth._id,
    }).save();
    res.status(201).send({
      success: true,
      message: "post created sucessfully",
      post,
    });
    console.log("req.auth is", req.auth);
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: "error in create post api",
      err,
    });
  }
};

//get all posts
const getAllPostsController = async (req, res) => {
  try {
    const posts = await postModel.find().populate('postedBy',"_id name").sort({createdAt:-1});
    res.status(200).send({
      success: true,
      message: "all posts data",
      posts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error in getAllPostAPI",
      error,
    });
  }
};

const getUserPostController= async (req,res)=>{
  try{
    const userPosts=await postModel.find({postedBy:req.auth._id});
    res.status(200).send({
      success:true,
      message:"user posts",
      userPosts
    })
  }catch(error){
    console.log(error);
    return res.status(500).send({
      success:false,
      message:"error in user Post API",
      error
    })
  }
}

//delete post
const deletePostController=async (req,res)=>{
 try{
  const {id}=req.params;
  await postModel.findByIdAndDelete({_id:id});
  res.status(200).send({
    success:true,
    message:'your post has been deleted',
  })
 }catch(error){
  console.log(error);
  res.status(500).send({
    success:false,
    message:"error in delete post api",
    error,
  })
 }
}

//updatePost
const updatePostController=async (req,res)=>{
 try{
  const {title,description}=req.body;
  //post finding that needs to be updated
  const post=await postModel.findById({_id:req.params.id});
  //validation
  if(!title||!description)
  {
    return res.status(500).send({
      success:false,
      message:'please provide post title or description',
    })
  }
  const updatedPost=await postModel.findByIdAndUpdate({_id:req.params.id},{
    title:title || post?.title,
    description:description ||post.description
  },{new:true});
  res.status(200).send({
    success:true,
    message:"Post updated successfully",
    updatedPost,
  })

 }
 catch(error){
  console.log(error);
  res.status(500).send({
    success:false,
    message:"error in update post api",
    error,
  })
  }
}

module.exports = { createPostController, getAllPostsController,getUserPostController,deletePostController,updatePostController };
