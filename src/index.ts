import app from './infrastructure/web/app';
import { ServerBootstrap } from './infrastructure/bootstrap/server-bootstrap';
import { connectDB } from './infrastructure/config/data-base';

const server = new ServerBootstrap(app);

(async () => {
    try {
        await connectDB();
        const instances = [server.init()];
        await Promise.all(instances);
    } catch (error) {
        console.log('Error on server initialization', error);
        process.exit(1);
    }
})();