const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
    {
        title: "Cats are best",
        author: "That Orange Cat",
        url: "catsrock.org",
        likes: 1
    },
    {
        title: "How to dominate the world",
        author: "Black Cat",
        url: "catsinpower.com",
        likes: 10
    }
  ]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(b => b.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}
module.exports = {
  initialBlogs, blogsInDb, usersInDb
}





