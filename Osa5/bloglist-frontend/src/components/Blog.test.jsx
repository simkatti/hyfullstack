import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'
import { expect } from 'vitest'

test('renders content', () => {
  const blog = {
    title: 'Why cats are superior species',
    author: 'science cat'
  }

  render(<Blog blog={blog} />)

  const titleElement = screen.getByText('Why cats are superior species')
  expect(titleElement).toBeDefined()

})

test('clicking the button shows all blog details', async () => {
  const blog = {
    title: 'Why cats are superior species',
    author: 'science cat',
    url: 'www.catsdoscience.uk',
    likes: 12,
    user: { name: 'Fluffy' }
  }

  const mockHandler = vi.fn()

  render(<Blog blog={blog} user={blog.user} handleView={mockHandler} />)

  const userSetup = userEvent.setup()
  const button = screen.getByText('view')
  await userSetup.click(button)

  const urlElement = screen.getByText('www.catsdoscience.uk')
  const likesElement = screen.getByText('likes: 12')
  const userElerment = screen.getByText('added by Fluffy')

  expect(urlElement).toBeVisible()
  expect(likesElement).toBeVisible()
  expect(userElerment).toBeVisible()


})


test('clicking the like button  twice calls event handler twixe', async () => {
  const blog = {
    title: 'Why cats are superior species',
    author: 'science cat',
    url: 'www.catsdoscience.uk',
    likes: 12,
    user: { name: 'Fluffy', username: 'orangecat' }
  }

  const mockHandler = vi.fn()

  render(
    <Blog blog={blog} handleLikes={mockHandler} />
  )

  const user = userEvent.setup()
  const viewButton = screen.getByText('view')
  await user.click(viewButton)
  const button = screen.getByText('like')
  await user.click(button)
  await user.click(button)

  expect(mockHandler.mock.calls).toHaveLength(2)
})



