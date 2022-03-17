const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");

// router.get("/timeline/:userId", async (req, res) => {
//     try {
//       const currentUser = await User.findById(req.params.userId);
//       const userPosts = await Post.find({ userId: currentUser._id });
//       const friendPosts = await Promise.all(
//         currentUser.followings.map((friendId) => {
//           return Post.find({ userId: friendId });
//         })
//       );
//       res.status(200).json(userPosts.concat(...friendPosts));
//     } catch (err) {
//       res.status(500).json(err);
//     }
//   });