const dummy = (blogs) => {
  return 1
}


const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  const maxlikes = blogs.reduce(function(prev, current) {
    return (prev && prev.likes > current.likes) ? prev : current
  })
  return {
    title: maxlikes.title,
    author: maxlikes.author,
    likes: maxlikes.likes
  }
}


module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}
