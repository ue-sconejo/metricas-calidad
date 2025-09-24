import { Repository } from "typeorm";
import { User as UserDomain } from "../../domain/User";
import { UserPort } from "../../domain/UserPort";
import { UserEntity } from "../entities/UserEntity";
import { AppDataSource } from "../config/data-base";


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

    async updateUser(id: number, user: Partial<UserDomain>): Promise<boolean> {
        try {
            const existingUser = await this.userRepository.findOneBy({ id_user: id });

            if (!existingUser) {
                throw new Error(`User with ID ${id} not found`);
            }

            if (user.name !== undefined) existingUser.name_user = user.name;
            if (user.email !== undefined) existingUser.email_user = user.email;
            if (user.password !== undefined) existingUser.password_user = user.password;
            if (user.status !== undefined) existingUser.status_user = user.status;

            await this.userRepository.save(existingUser);

            return true;
        } catch (error) {
            console.error('Error on update user', error);
            return false;
        }
    }

    async deleteUser(id: number): Promise<boolean> {
        try {
            const existingUser = await this.userRepository.findOneBy({ id_user: id });

            if (!existingUser) {
                throw new Error(`User with ID ${id} not found`);
            }

            existingUser.status_user = 0;
            await this.userRepository.save(existingUser);
            return true;
        } catch (error) {
            console.error('Error on delete user (logical)', error);
            return false;
        }
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
            const user = await this.userRepository.findOne({ where: { id_user: id } });
            return user ? this.toDomain(user) : null;
        } catch (error) {
            console.log('Error on create user', error);
            throw new Error("Error on crete user");
        }
    }

    async getUserByEmail(email: string): Promise<UserDomain | null> {
        try {
            const user = await this.userRepository.findOne({ where: { email_user: email } });
            return user ? this.toDomain(user) : null;
        } catch (error) {
            console.log('Error on search user', error);
            throw new Error("Error on search user");
        }
    }

}