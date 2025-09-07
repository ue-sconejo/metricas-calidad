
import { DataSource } from "typeorm";
import { UserEntity } from "../entities/UserEntity";
import envs from "./environment-vars"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: envs.DB_HOST,
    port: Number(envs.DB_PORT),
    username: envs.DB_USER,
    password: envs.DB_PASSWORD,
    database: envs.DB_NAME,
    synchronize: true,
    logging: false,
    entities: [UserEntity]
});

export const connectDB = async () => {
    try {
        await AppDataSource.initialize();
        console.log("DB Connection success!")
    } catch (error) {
        console.error("Error connecting to the DB:", error)
        process.exit(1);
    }
}