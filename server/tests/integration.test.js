const request = require('supertest');
const app = require('../src/app');
const { PrismaClient } = require('@prisma/client');
const { execSync } = require('child_process');

describe('API + DB System Integration', () => {
  let prisma;

  beforeAll(async () => {
    // 1. Fallback to local postgres test database if DATABASE_URL is not set by CI
    if (!process.env.DATABASE_URL) {
      process.env.DATABASE_URL = 'postgresql://postgres:password123@localhost:5432/shopsmart';
    }

    // 2. Synchronize the Prisma schema strictly to the dedicated SQLite testing database
    execSync('npx prisma migrate deploy', { stdio: 'ignore' });

    prisma = new PrismaClient();
    await prisma.book.deleteMany();
  });

  afterAll(async () => {
    // Teardown connections
    await prisma.book.deleteMany();
    await prisma.$disconnect();
  });

  afterEach(async () => {
    await prisma.book.deleteMany();
  });

  it('should successfully persist a new book and file into the database and retrieve it via the API', async () => {
    // STEP A: Create the new Book metadata via the API module
    const createRes = await request(app)
      .post('/api/books')
      .field('book_name', 'System Architecture')
      .field('book_author', 'Alan Turing')
      .field('book_publication', 'Tech Press')
      .field('book_cost', '45.00');

    expect(createRes.statusCode).toBe(201);
    expect(createRes.body.book_id).toBeDefined();

    const bookId = createRes.body.book_id;

    // STEP B: Upload a mock file via the API module to trigger the S3 hook and DB update
    const uploadRes = await request(app)
      .post(`/api/books/${bookId}/upload`)
      .attach('book_file', Buffer.from('mock pdf binary content'), 'architecture.pdf');

    expect(uploadRes.statusCode).toBe(200);
    expect(typeof uploadRes.body.book_link).toBe('string');
    expect(uploadRes.body.book_link.length).toBeGreaterThan(0);

    // STEP C: Cross-verify the DB and Backend modules integration using a GET retrieval
    const getRes = await request(app).get('/api/books');
    expect(getRes.statusCode).toBe(200);
    expect(getRes.body.length).toBe(1);

    // Assert the stored constraints match our original submission
    const storedBook = getRes.body[0];
    expect(storedBook.book_name).toBe('System Architecture');
    expect(storedBook.book_author).toBe('Alan Turing');
    expect(typeof storedBook.book_link).toBe('string');
  });
});
