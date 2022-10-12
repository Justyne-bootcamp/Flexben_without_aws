const request = require('supertest');
const app = require('../app.js');


const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiSm9hbm5lIEFiYm90dCIsImVtYWlsIjoiam9hbm5lLmFiYm90dEBwb2ludHdlc3QuY29tLnBoIiwicm9sZSI6ImVtcGxveWVlIiwiaWF0IjoxNjU4MDc1MjkxLCJleHAiOjE2NTgzMzQ0OTF9.DZh24q1INPMP5Wlg9c09Ckeqfe5Wmofc8BUA6cIBWLw';
test('This should log out succesfully', async () => {
    await request(app).post('/flexben/logout')
    .set('Authorization', `bearer ${token}`)
    .send({
        employeeId: 1
    })
    .expect(200);
});

test('This should respond unauthorized', async () => {
    await request(app).post('/flexben/logout')
    .send({
        employeeId: 1
    })
    .expect(401);
});