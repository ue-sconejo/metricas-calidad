
import { DataSource } from "typeorm";
import { UserEntity } from "../entities/UserEntity";
import envs from "../config/environment-vars"

export const  AppDataSource = new DataSource({
    type: "mysql",
    host: envs.DB_HOST,
    port: Number(envs.DB_PORT),
    username: envs.DB_USER,
    password: envs.DB_PASSWORD,
    database: envs.DB_NAME,
    synchronize: true,
    logging: true,
    entities:[UserEntity]
});

export const connectDB = async ()=>{
    try{
        AppDataSource.initialize();
        console.log("Connection success!")
    }catch (error){
        console.error("Error connecting to the DB:", error)
        process.exit(1);
    }
}