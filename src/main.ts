import express from 'express';
import 'express-async-errors'; // no support for typescript
import cookieParser from 'cookie-parser';
import cors from 'cors';
import {deserializeUser} from "./middleware/deserializeUser";

import {loginRouter} from './routers/loginRouter';
import bodyParser from 'body-parser';
import {handleError} from "./utils/error";

import * as dotenv from 'dotenv'
import {requireUser} from "./middleware/requireUser";
import {privateRouter} from "./routers/protected";

dotenv.config()

const app = express()
const port = process.env.PORT || 8080;

app.use(cookieParser());
app.use(bodyParser.json());
app.use(deserializeUser);
app.use(cors(
    {
        origin: 'localhost:8080',
        credentials: true
    }
));

app.use('/', loginRouter())
app.use('/protected', requireUser, privateRouter());
app.use(handleError)

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})