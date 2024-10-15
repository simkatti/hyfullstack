const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const assert = require('assert') 
const Blog = require('../models/blog')
const helper = require('./test_helper')
const bcrypt = require('bcrypt')
const User = require('../models/user')


const app = require('../app')

const api = supertest(app)

  
  beforeEach(async () => {
    await Blog.deleteMany({})
    let blogObject = new Blog(helper.initialBlogs[0])
    await blogObject.save()
    blogObject = new Blog(helper.initialBlogs[1])
    await blogObject.save()
  })

  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'kingofthestreets', name: 'scar', passwordHash })

    await user.save()
  })

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are two blogs', async () => {
    const response = await api.get('/api/blogs')
  
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })
  
test('the first blog is about cats being best', async () => {
    const response = await api.get('/api/blogs')
  
    const contents = response.body.map(e => e.title)
    assert(contents.includes('Cats are best'))
})

test('blog ids are returned as id', async () => {
    const response = await api.get('/api/blogs')
    response.body.forEach(b => {
        assert.strictEqual(typeof b.id === 'string', true)
    })
})

test('a blog can be added ', async () => {
    const newBlog = {
        title: "How to trick your servants into feeding you twice",
        author: "Black Cat",
        url: "catsinpower.com",
        likes: 13
    }
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  
    const response = await api.get('/api/blogs')
  
    const contents = response.body.map(r => r.title)
  
    assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)
  
    assert(contents.includes('How to trick your servants into feeding you twice'))
  })

test('a blog can be deleted', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]
  
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)
  
    const blogsAtEnd = await helper.blogsInDb()
  
    const contents = blogsAtEnd.map(r => r.title)
    assert(!contents.includes(blogToDelete.title))
  
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
  })

test('blog can be updated', async () => {
    const allBlogs = await helper.blogsInDb()
    const updateBlog = allBlogs[0]

    const update = {
        title: updateBlog.title,
        author: updateBlog.author,
        url: updateBlog.url,
        likes: updateBlog.likes + 1
    }

    await api
    .put(`/api/blogs/${updateBlog.id}`)
    .send(update)
    .expect(200)
    .expect('Content-Type', /application\/json/)

    const updatedBlogs = await helper.blogsInDb()
    const updatedBlog = updatedBlogs.find(b => b.id === updateBlog.id)

    assert.strictEqual(updatedBlog.likes, updateBlog.likes +1)
})



test('creation succeeds with a fresh username', async () => {
const usersAtStart = await helper.usersInDb()

const newUser = {
    username: 'orangeone',
    name: 'Fluffy',
    password: 'salainen',
}

await api
    .post('/api/users')
    .send(newUser)
    .expect(201)
    .expect('Content-Type', /application\/json/)

const usersAtEnd = await helper.usersInDb()
assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

const usernames = usersAtEnd.map(u => u.username)
assert(usernames.includes(newUser.username))
})

test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'kingofthestreets',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('expected `username` to be unique'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })


after(async () => {
  await mongoose.connection.close()
})
