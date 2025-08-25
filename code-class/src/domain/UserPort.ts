import { User } from "./User";

export interface UserPort{
    createUser(user: Omit<User, "id">): Promise <number>;
    updateUser(id:number, user:Partial<User>):Promise<boolean>;
    deleteUser(id:number):Promise<boolean>;
    getAllUser():Promise<User[]>;
    getUserById(id:number): Promise<User|null>;
    getUserByEmail(email:string):Promise<User|null>;
}