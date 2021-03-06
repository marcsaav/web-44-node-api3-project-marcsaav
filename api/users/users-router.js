const express = require('express');

// You will need `users-model.js` and `posts-model.js` both

const Users = require('./users-model')
const Posts = require('../posts/posts-model')

// The middleware functions also need to be required

const { validateUserId, validateUser, validatePost } = require('../middleware/middleware')

const router = express.Router();

router.get('/', async (req, res) => {
  // RETURN AN ARRAY WITH ALL THE USERS
  try {
    let users = await Users.get()
    res.status(200).json(users)
  } catch(err) {
    res.status(500).json({ message: err.message})
  }
});

router.get('/:id', validateUserId, (req, res) => {
  // RETURN THE USER OBJECT
  // this needs a middleware to verify user id
    let user = req.user
    res.status(200).json(user)
});

router.post('/', validateUser, async (req, res) => {
  // RETURN THE NEWLY CREATED USER OBJECT
  // this needs a middleware to check that the request body is valid
  try {
    let user = await Users.insert(req.body)
    res.status(201).json(user)
  } catch(err) {
    res.status(500).json({ message: err.message })
  }
});

router.put('/:id', validateUserId, validateUser, async (req, res) => {
  // RETURN THE FRESHLY UPDATED USER OBJECT
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  try {
    let { id } = req.params
    const user = await Users.update(id, req.body)
    res.status(200).json(user)
  } catch(err) {
    res.status(500).json({ message: err.message })
  }
});

router.delete('/:id', validateUserId, async (req, res) => {
  // RETURN THE FRESHLY DELETED USER OBJECT
  // this needs a middleware to verify user id
  try {
    await Users.remove(req.params.id)
    res.status(200).json(req.user)
  } catch(err) {
    res.status(500).json({ message: err.message })
  }
});

router.get('/:id/posts', validateUserId, async (req, res) => {
  // RETURN THE ARRAY OF USER POSTS
  // this needs a middleware to verify user id
  try {
    let { id } = req.params
    let userPosts = await Users.getUserPosts(id)
    res.status(200).json(userPosts)
  } catch(err) {
    res.status(500).json({ message: err.message })
  }
});

router.post('/:id/posts', validateUserId, validatePost, async (req, res) => {
  // RETURN THE NEWLY CREATED USER POST
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  try {
    let { id } = req.params
    let post = await Posts.insert({...req.body, user_id: id})
    res.status(201).json(post)
  } catch(err) {
    res.status(500).json({ message: err.message })
  }
});

// do not forget to export the router

module.exports = router
