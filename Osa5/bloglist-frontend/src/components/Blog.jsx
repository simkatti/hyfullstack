import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, handleLikes, handleDelete, user }) => {
  const [visible, setVisible] = useState(false)

  const handleView = () => {
    setVisible(!visible)
  }

  Blog.protoTypes = {
    blog: PropTypes.shape({
      title: PropTypes.string.isRequired,
      author: PropTypes.string,
      url: PropTypes.string.isRequired,
      likes: PropTypes.number.isRequired,
      user: PropTypes.shape({
        name: PropTypes.string.isRequired,
      }), }).isRequired,
    handleLikes: PropTypes.func.isRequired,
    handleDelete: PropTypes.func.isRequired,
    user: PropTypes.shape({
      username: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired
    }).isRequired,
  }

  return (
    <div>
      <ul>
        <li className='blog'>
          <i>{blog.title}</i>
          <button onClick={handleView}>{visible ? 'hide' : 'view'}</button>
          {blog.author && <p>by: {blog.author}</p>}{visible && (<>
            <p>{blog.url}</p>
            <p>likes: {blog.likes} <button onClick={handleLikes}>like</button></p>
            <p>added by {blog.user.name}</p>
            {user?.username === blog.user.username && (<p><button onClick={handleDelete}>remove</button></p>)}</>)}
          <hr width='30%' color='purple' align='left'/>
        </li>
      </ul>
    </div>
  )
}

export default Blog