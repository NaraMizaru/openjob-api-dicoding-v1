import express from 'express';
import pool from './config/database.js';
import {userRoute} from "./routes/users.js";
import {errorHandler} from "./middlewares/errHandler.js";
import {authRoute} from "./routes/auth.js";
import {companyRoute} from "./routes/company.js";
import {categoryRoute} from "./routes/category.js";
import {jobRoute} from "./routes/job.js";
import {applicationRoute} from "./routes/application.js";
import {bookmarkRoute} from "./routes/bookmark.js";
import {profileRoute} from "./routes/profile.js";
import {documentRoute} from "./routes/document.js";

const app = express();

app.use(express.json());
app.use(errorHandler)

app.get('/', (req, res) => {
    res.json({
        status: 'success',
        message: 'OpenJob API is running',
    });
});

app.get('/db-test', async (req, res, next) => {
    try {
        const result = await pool.query('SELECT NOW()');

        res.json({
            status: 'success',
            message: 'Database connected',
            data: result.rows[0],
        });
    } catch (error) {
        next(error);
    }
});

app.use('/users', userRoute());
app.use('/authentications', authRoute())
app.use('/companies', companyRoute())
app.use('/categories', categoryRoute())
app.use('/jobs', jobRoute())
app.use('/applications', applicationRoute())
app.use('/', bookmarkRoute())
app.use("/profile", profileRoute());
app.use('/documents', documentRoute())

export default app;