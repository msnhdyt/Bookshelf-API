const { nanoid } = require('nanoid')
const bookshelf = require('./bookshelf')

const addBook = (request, h) => {
  try {
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload

    const id = nanoid(16)
    const finished = pageCount === readPage
    const insertedAt = new Date().toISOString()
    const updatedAt = insertedAt

    const book = {
      id: id,
      name: name,
      year: year,
      author: author,
      summary: summary,
      publisher: publisher,
      pageCount: pageCount,
      readPage: readPage,
      finished: finished,
      reading: reading,
      insertedAt: insertedAt,
      updatedAt: updatedAt
    }

    if (name === undefined) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal menambahkan buku. Mohon isi nama buku'
      })
      response.code(400)
      return response
    } else if (readPage > pageCount) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
      })
      response.code(400)
      return response
    }

    bookshelf.push(book)
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id
      }
    })

    response.code(201)
    return response
  } catch (error) {
    const response = h.response({
      status: 'fail',
      message: 'Buku gagal ditambahkan'
    })
    response.code(500)
    return response
  }
}

const getAllBooks = (request, h) => {
  let booksFiltered = bookshelf
  let { name, reading, finished } = request.query

  reading = parseInt(reading)
  finished = parseInt(finished)

  if (name !== undefined) {
    booksFiltered = booksFiltered.filter(obj => obj.name.toLowerCase().includes(name.toLowerCase()))
  }

  if (reading === 0) {
    booksFiltered = booksFiltered.filter(obj => obj.reading === false)
  } else if (reading === 1) {
    booksFiltered = booksFiltered.filter(obj => obj.reading === true)
  }

  if (finished === 0) {
    booksFiltered = booksFiltered.filter(obj => obj.finished === false)
  } else if (finished === 1) {
    booksFiltered = booksFiltered.filter(obj => obj.finished === true)
  }

  const books = []
  booksFiltered.forEach(element => {
    const { id, name, publisher } = element
    books.push({ id, name, publisher })
  })

  return {
    status: 'success',
    data: {
      books
    }
  }
}

const getDetailBook = (request, h) => {
  const { bookId } = request.params
  const book = bookshelf.filter(obj => obj.id === bookId)[0]
  if (book === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan'
    })
    response.code(404)
    return response
  }

  const response = h.response({
    status: 'success',
    data: {
      book
    }
  })
  response.code(200)
  return response
}

const updateBook = (request, h) => {
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload
  const { bookId } = request.params
  const book = bookshelf.filter(obj => obj.id === bookId)[0]

  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku'
    })
    response.code(400)
    return response
  } else if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
    })
    response.code(400)
    return response
  } else if (book === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan'
    })
    response.code(404)
    return response
  }

  const index = bookshelf.findIndex(obj => obj.id === bookId)
  const updatedAt = new Date().toISOString()
  bookshelf[index] = {
    ...bookshelf[index],
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    updatedAt
  }
  const response = h.response({
    status: 'success',
    message: 'Buku berhasil diperbarui'
  })
  response.code(200)
  return response
}

const deleteBook = (request, h) => {
  const { bookId } = request.params
  const index = bookshelf.findIndex(obj => obj.id === bookId)
  if (index === -1) {
    const response = h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan'
    })
    response.code(404)
    return response
  }

  bookshelf.splice(index, 1)
  const response = h.response({
    status: 'success',
    message: 'Buku berhasil dihapus'
  })
  response.code(200)
  return response
}
module.exports = { addBook, getAllBooks, getDetailBook, updateBook, deleteBook }
