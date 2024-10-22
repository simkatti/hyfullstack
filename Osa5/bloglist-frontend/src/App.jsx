import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import { Notification, ErrorMessage } from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import './index.css'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [notification, setNotification] = useState(null)
  const [user, setUser] = useState(null)
  const [formVisible, setFormVisible] = useState(false)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('Wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const createBlog = async (blogObject) => {
    try {
      const newBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(newBlog))
      setNotification(`A new blog "${blogObject.title}" by ${blogObject.author} has been added`)
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    } catch (error) {
      setErrorMessage(error.response.data.error)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedUser')
    setUser(null)
  }

  const handleLikes = async (id) => {
    const likedBlog = blogs.find(b => b.id === id)

    const updatedBlog = {
      title: likedBlog.title,
      author: likedBlog.author,
      url: likedBlog.url,
      likes: likedBlog.likes + 1
    }
    try {
      const sendBlog = await blogService.update(id, updatedBlog)
      setBlogs(blogs.map(blog => blog.id !== id ? blog : sendBlog))
    } catch (error) {
      setErrorMessage('Something went wrong')
      setTimeout(() =>
        setErrorMessage(null), 5000)
    }
  }

  const handleDelete = async (id) => {
    const deleteBlog = blogs.find(b => b.id === id)
    if (window.confirm(`Remove blog ${deleteBlog.title} by ${deleteBlog.author}?`)) {
      blogService.remove(id)
        .then(() => {
          setBlogs(blogs.filter(b => b.id !== id))
          setNotification(`blog ${deleteBlog.title} by ${deleteBlog.author} has been removed`)
          setTimeout(() => {
            setNotification(null)
          }, 5000)
        })
        .catch(error => {
          setErrorMessage('this blog has already been removed')
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        })
    }

  }

  return (
    <div>
      <Notification message={notification} />
      <ErrorMessage message={errorMessage} />

      {!user && (
        <LoginForm
          handleSubmit={handleLogin}
          handleUsernameChange={({ target }) => setUsername(target.value)}
          handlePasswordChange={({ target }) => setPassword(target.value)}
          username={username}
          password={password}/>)}
      {user && (
        <div>
          <h3>Hello, {user.name} &#128075; <button onClick={handleLogout}>Logout</button></h3>
          <button onClick={() => setFormVisible(!formVisible)}>{formVisible ? 'Cancel' : 'Add a blog'}</button>
          {formVisible && (
            <BlogForm createBlog={createBlog}/>)}
          <div>
            <h2>Blogs:</h2>
            {blogs.sort((a,b) => b.likes - a.likes).map(b => (<Blog key={b.id} blog={b} handleLikes={() => handleLikes(b.id)} handleDelete={() => handleDelete(b.id)} user={user} />))}
          </div>
        </div>)}
    </div>
  )
}


export default App

