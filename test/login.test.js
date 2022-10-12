const request = require('supertest');
const app = require('../app.js');

test('This should log in succesfully', async () => {
    await request(app).post('/flexben/login')
    .send({
        email: 'joanne.abbott@pointwest.com.ph',
        password: '12345',
        role: 'employee'
    })
    .expect(200);
});