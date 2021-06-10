const _ = require('lodash');
const Post = require('../models/Post');

exports.findAllPosts = async (req, res) => {
  try {
    // const posts = await Post.find();
    const {
      name
    } = req.user || {};
    const {
      search
    } = req.query;
    const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const query = search ?
      { post: new RegExp(escapeRegExp(search), 'i') } :
      {};
    const posts = await Post.find(query).sort({_id: -1})
    res.json(posts)
  } catch (error) {
    res.status(500).json({
      message: error.message || "Something goes wrong retieving the posts"
    })
  }
};

exports.findOnePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id)
    if (!post) return res.status(404).json({
      message: `Post with id ${id} does not exists!`
    });
    res.json(post)
  } catch (error) {
    res.status(500).json({
      message: error.message || `Error retrieving Post with id: ${id}`
    })
  }
};

exports.findPostsByCreator = async (req, res) => {
  try {
    const {
      name
    } = req.user || {};
    const {
      search
    } = req.query;
    const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const query = search ?
      {
        'created.user': name,
        post: new RegExp(escapeRegExp(search), 'i')
      } :
      { 'created.user': name };
    const posts = await Post.find(query).sort({_id: -1})

    if (!posts) return res.status(404).json({
      message: `Post(s) created by ${name}.`
    });
    res.json(posts)
  } catch (error) {
    res.status(500).json({
      message: error.message || `Error retrieving Post(s) for ${name}`
    })
  }
};

exports.createPost = async (req, res) => {
  try {
    const {
      post
    } = req.body || {};
    const {
      name
    } = req.user || {};
    const newPost = new Post({
      post,
      created: {
        when: new Date(),
        user: name,
      }
    });
    const postSaved = await newPost.save();

    res.json(postSaved)
  } catch (error) {
    res.status(500).json({
      message: error.message || "Something goes wrong creating a Post"
    })
  }
};

exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await Post.findByIdAndDelete(id)
    res.json({
      message: 'Post was deleted successfully!'
    })
  } catch (error) {
    res.status(500).json({
      message: `Cannot delete Post with id ${id}`
    })
  }
}

exports.updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name
    } = req.user || {};
    const updatePost = _.pick(req.body, ['post', 'created']);
    updatePost.updated = {
      when: new Date(),
      user: name,
    }

    await Post.findByIdAndUpdate(id, updatePost)
    res.json({
      message: "Post was updated successfully"
    })
  } catch (error) {
    res.status(500).json({
      message: `Cannot update Post with id: ${id}`
    })
  }
}