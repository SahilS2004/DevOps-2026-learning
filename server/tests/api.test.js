const request = require('supertest');
const app = require('../src/app');
const { PrismaClient } = require('@prisma/client');

// Mock Prisma completely using Jest to ensure pure Unit Testing
jest.mock('@prisma/client', () => {
  const mPrismaClient = {
    book: {
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mPrismaClient) };
});

describe('Book API Endpoints Unit Tests', () => {
  let mPrisma;

  beforeAll(() => {
    mPrisma = new PrismaClient();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('GET /api/books should return 200 and a list of all books', async () => {
    const mockBooks = [
      { book_id: 1, book_name: 'Test Book 1', book_cost: 10.99 },
      { book_id: 2, book_name: 'Test Book 2', book_cost: 15.99 }
    ];
    mPrisma.book.findMany.mockResolvedValue(mockBooks);

    const res = await request(app).get('/api/books');
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(mockBooks);
    expect(mPrisma.book.findMany).toHaveBeenCalledTimes(1);
  });

  it('POST /api/books should return 201 and successfully create book metadata', async () => {
    const newBook = { book_id: 3, book_name: 'New Book', book_cost: 20.0, book_link: '' };
    mPrisma.book.create.mockResolvedValue(newBook);

    const res = await request(app)
      .post('/api/books')
      .send({ book_name: 'New Book', book_cost: '20' });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toEqual(newBook);
    expect(mPrisma.book.create).toHaveBeenCalledTimes(1);
  });
  
  it('PUT /api/books/:id should return 200 and update the book attributes', async () => {
    const updatedBook = { book_id: 1, book_name: 'Updated Book', book_cost: 12.0 };
    mPrisma.book.update.mockResolvedValue(updatedBook);

    const res = await request(app)
      .put('/api/books/1')
      .send({ book_name: 'Updated Book' });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(updatedBook);
    expect(mPrisma.book.update).toHaveBeenCalledWith({
      where: { book_id: 1 },
      data: { book_name: 'Updated Book' }
    });
  });
});
