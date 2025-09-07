import { User } from "../domain/User";
import { UserPort } from "../domain/UserPort";

export class UserApplication {
    private port: UserPort;

    constructor(port: UserPort) {
        this.port = port;
    }
    async createUser(user: Omit<User, "id">): Promise<number> {
        const existingUser = await this.port.getUserByEmail(user.email);
        if (!existingUser) {
            return this.port.createUser(user);
        }
        throw new Error("El usuario ya exite");

    }

    async updateUser(id: number, user: Partial<User>): Promise<boolean> {
        const existingUser = await this.port.getUserById(id);

        if (!existingUser) throw new Error("El usuario no exite");

        if (user.email) {
            const emailTaken = await this.port.getUserByEmail(user.email);
            if (emailTaken && emailTaken.id !== id) {
                throw new Error("Error en actualizar email");
            }
        }

        return await this.port.updateUser(id, user);;
    }

    async getAllUsers(): Promise<User[]> {
        return await this.port.getAllUser();
    }

    async getUserById(id: number): Promise<User | null> {
        return await this.port.getUserById(id);
    }

    async deleteUser(id: number): Promise<boolean> {
        const existingUser = await this.port.getUserById(id);
        if (!existingUser) {
            throw new Error("No se encontro el usuario");
        }

        return await this.port.deleteUser(id);
    }


}
