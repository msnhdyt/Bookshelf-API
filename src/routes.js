const { addBook, getAllBooks, getDetailBook, updateBook, deleteBook } = require('./handler')
const routes = [
  {
    method: 'POST',
    path: '/books',
    handler: addBook
  },
  {
    method: 'GET',
    path: '/books',
    handler: getAllBooks
  },
  {
    method: 'GET',
    path: '/books/{bookId}',
    handler: getDetailBook
  },
  {
    method: 'PUT',
    path: '/books/{bookId}',
    handler: updateBook
  },
  {
    method: 'DELETE',
    path: '/books/{bookId}',
    handler: deleteBook
  }

]

module.exports = routes
