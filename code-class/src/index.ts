
import app from './inftraestructure/web/app';
import { ServerBoostrap } from './inftraestructure/boostrap/server-boostrap';

const server = new ServerBoostrap(app);
(
    async () => {
        try{
            const instances = [server.init()];
            await Promise.all(instances);
        } catch (error) {
            console.error("Error starting server:", error);
        }
    }
)();

