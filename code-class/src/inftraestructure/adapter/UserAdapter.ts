import { Repository } from "typeorm";
import { User as UserDomain } from "../../domain/User";
import { UserPort } from "../../domain/UserPort";
import { UserEntity } from "../entities/UserEntity";
import { AppDataSource } from "../config/con_data_base";

export class UserAdapter implements UserPort {

    private userRepository: Repository<UserEntity>

    constructor() {
        this.userRepository = AppDataSource.getRepository(UserEntity);
    }

    private toDomain(user: UserEntity): UserDomain {
        return {
            id: user.id_user,
            name: user.name_user,
            email: user.email_user,
            password: user.password_user,
            status: user.status_user
        }
    }

    private toEntity(user: Omit<UserDomain, 'id'>): UserEntity {
        const userEntity = new UserEntity();
        userEntity.name_user = user.name;
        userEntity.email_user = user.email;
        userEntity.password_user = user.password;
        userEntity.status_user = user.status;
        return userEntity;
    }

    async createUser(user: Omit<UserDomain, "id">): Promise<number> {
        try {
            const newUser = this.toEntity(user);
            const savedUser = await this.userRepository.save(newUser);
            return savedUser.id_user;
        } catch (error) {
            console.log('Error on create user', error);
            throw new Error("Error on crete user");
        }
    }
    updateUser(id: number, user: Partial<UserDomain>): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    deleteUser(id: number): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    async getAllUser(): Promise<UserDomain[]> {
        try {
            const users = await this.userRepository.find();
            return users.map(this.toDomain);
        } catch (error) {
            console.log('Error on get users', error);
            throw new Error("Error on get users");
        }
    }
    async getUserById(id: number): Promise<UserDomain | null> {
        try {
            const user = await this.userRepository.findOne({where:{id_user:id}});
            return user ? this.toDomain(user): null;
        } catch (error) {
            console.log('Error on create user', error);
            throw new Error("Error on crete user");
        }
    }
    async getUserByEmail(email: string): Promise<UserDomain | null> {
        try {
            const user = await this.userRepository.findOne({where:{email_user:email}});
            return user ? this.toDomain(user): null;
        } catch (error) {
            console.log('Error on search user', error);
            throw new Error("Error on search user");
        }
    }

}