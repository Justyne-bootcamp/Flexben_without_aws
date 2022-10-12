const app = require('./app');

app.listen(process.env.PORT, () => console.log(`Server is at http://localhost:${process.env.PORT}`));