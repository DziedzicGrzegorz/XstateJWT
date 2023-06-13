import type {Request, Response, Router} from 'express';
import fs from 'fs';

const pathToPng = 'C:\\Webstorm _in_Process\\xstate\\src\\public\\img.png'

export const privateRoute = (router: Router) => {
    router.get('/', (req: Request, res: Response) => {
        // Read the PNG image file
        fs.readFile(pathToPng, (err, data) => {
            if (err) {
                console.error(err);
                res.status(500).send('Internal Server Error');
                return;
            }

            res.setHeader('Content-Type', 'image/png');
            res.setHeader('Content-Length', data.length);
            res.end(data);
        });
    });
};