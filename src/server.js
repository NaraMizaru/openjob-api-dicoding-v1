import 'dotenv/config';
import app from './app.js';

const {HOST, PORT} = process.env;

app.listen(PORT, HOST, () => {
    console.log(`Server berjalan pada http://${HOST}:${PORT}`);
});