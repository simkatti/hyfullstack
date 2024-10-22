import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')


  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: title,
      author: author,
      url: url
    })

    setTitle('')
    setAuthor('')
    setUrl('')

  }
  const handleBlogChange = (event) => {
    const { name, value } = event.target
    if (name === 'title') setTitle(value)
    if (name === 'author') setAuthor(value)
    if (name === 'url') setUrl(value)
  }

  return (
    <div>
      <form onSubmit={addBlog}>
        <div>title <input name="title" value={title} onChange={handleBlogChange}/> </div>
        <div>author <input name="author" value={author} onChange={handleBlogChange}/></div>
        <div>URL <input name="url" value={url} onChange={handleBlogChange}/></div>
        <button type="submit">Create</button>
      </form>
    </div>
  )
}

export default BlogForm


