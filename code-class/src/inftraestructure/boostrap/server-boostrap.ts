import http from 'http';
import express from 'express';
import envs from '../config/environment-vars';


export class ServerBoostrap {
    //atributos - propiedades - caracteristicas
    private app!: express.Application;

    constructor(app: express.Application) {
        this.app = app;
    }

    init(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            const server = http.createServer(this.app);
            const PORT = envs.PORT || 4300;

            server.listen(PORT)
                .on('listening', () => {
                    console.log(`Server iniciado http://localhost:${PORT}`);
                    resolve(true);
                })
                .on('error', (err) => {
                    console.log(`Error starting server on port ${err}`);
                    reject(false);
                });

        });
    }
}