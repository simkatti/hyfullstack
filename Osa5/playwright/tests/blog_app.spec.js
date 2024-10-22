const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http:localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        username: 'orangecat',
        password: 'secret'
      }
    })

    await page.goto('http://localhost:5173')
  })

  test('login form is shown', async ({ page }) => {
    await page.goto('http://localhost:5173')
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible();

    await page.getByRole('button', { name: 'login' }).click()
  })
})

describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
    await page.goto('http://localhost:5173')
    await page.getByRole('button', { name: 'login' }).click()
    await page.getByRole('textbox').first().fill('orangecat')
    await page.getByRole('textbox').last().fill('secret')
    await page.getByRole('button', { name: 'login' }).click()
    await expect(page.getByText('Hello, Fluffy')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
        await page.goto('http://localhost:5173')
        await page.getByRole('button', { name: 'login' }).click()
        await page.getByRole('textbox').first().fill('fake')
        await page.getByRole('textbox').last().fill('fake')
        await page.getByRole('button', { name: 'login' }).click()
        await expect(page.getByText('Wrong username or password')).toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
        await page.goto('http://localhost:5173')
        await page.getByRole('button', { name: 'login' }).click()
        await page.getByRole('textbox').first().fill('orangecat')
        await page.getByRole('textbox').last().fill('secret')
        await page.getByRole('button', { name: 'login' }).click()
        await expect(page.getByText('Hello, Fluffy')).toBeVisible()
    })
  
    test('a new blog can be created', async ({ page }) => {
        await page.getByRole('button', { name: 'Add a blog' }).click()
        const textboxes = await page.getByRole('textbox').all()
        await textboxes[0].fill('Test blog')
        await textboxes[1].fill('Tester')
        await textboxes[2].fill('www.testerblog.net')
        await page.getByRole('button', { name: 'Create' }).click()
        await expect(page.getByText('A new blog "Test blog" by Tester has been added')).toBeVisible()
    })

    test('remove button can only be seen by posts posted by logged user', async ({ page }) => {
        await page.getByRole('button', { name: 'view' }).nth(0).click()
        await expect(page.getByText('added by Mr Pepper')).toBeVisible()
        const deleteButton = page.getByRole('button', { name: 'remove' })
        await expect(deleteButton).not.toBeVisible()
    })

    test('make sure you can like a post', async ( { page}) => {
        await page.getByRole('button', { name: 'view' }).nth(0).click()
        await expect(page.getByText('www.catchronicles.com')).toBeVisible()
        await page.getByRole('button', { name: 'like' }).click()
        await expect(page.getByText('likes: 15')).toBeVisible()
    })

    test('blog that just created can be deleted', async ( { page}) => {
        const title = 'Test Blog'; 
        await page.locator(`li:has-text("${title}")`).getByRole('button', { name: 'view' }).click();
        await expect(page.getByText('www.testerblog.net')).toBeVisible()
        await page.evaluate(() => {window.confirm = () => true})
        await page.getByRole('button', { name: 'remove' }).click()
        await expect(page.getByText('Test blog by Tester has been removed')).toBeVisible()


    })  
})