import { UserApplication } from "../../application/UserApplicationService";
import { User } from "../../domain/User";
import { Request, Response } from "express";

export class UserController {
    private app: UserApplication;

    constructor(app: UserApplication) {
        this.app = app;
    }

    async registerUser(req: Request, res: Response): Promise<Response> {
        const { name, email, password } = req.body;

        try {
            const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ]+(?:\s[A-Za-zÁÉÍÓÚáéíóúÑñ]+)?$/;
            if (!nameRegex.test(name.trim())) return res.status(400).json({ message: "Error en el nombre" });
            if (!/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(email)) return res.status(400).json({ error: "Correo electrónico no válido" });
            if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,25}$/.test(password)) return res.status(400).json({ message: "La contraseña debe tener al menos 6 caracteres y máximo 25, incluyendo al menos una letra y un número", });
            const status = 1;
            const user: Omit<User, "id"> = { name, email, password, status };

            const userId = await this.app.createUser(user);
            return res.status(200).json({ message: "Exito el regitrar usuario", userId });

        } catch (error) {
            return res.status(500).json({ messaje: "Error on server!!" });
        }

    }

    async getAllUsers(request: Request, response: Response): Promise<Response> {
        try {
            const users = await this.app.getAllUsers();
            return response.status(200).json(users);
        } catch (error) {
            return response.status(500).json({ message: "Error en consulta" });
        }
    }

    async getUserById(request: Request, response: Response): Promise<Response> {
        try {
            const id = parseInt(request.params.id);
            if (isNaN(id)) {
                return response.status(400).
                    json({ message: "Error en consulta id" });
            }
            const user = await this.app.getUserById(id);

            if (!user) return response.status(404).json({ message: "Usuario no encontrado" });

            return response.status(200).json({ user });
        } catch (error) {
            return response.status(500).json({ message: "Error en consulta" });
        }
    }

    async updateUser(request: Request, response: Response): Promise<Response> {
        try {

            const id = parseInt(request.params.id);

            if (isNaN(id)) return response.status(400).json({ message: "Error en consulta id" });

            let { name, email, password, status } = request.body;

            if (name && !/^[a-zA-Z\s]{3,}$/.test(name.trim()))
                return response.status(400).json({
                    error: "El nombre debe tener al menos 3 caracteres y solo contener letras",
                });

            if (email && !/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(email.trim())) return response.status(400).json({ error: "Correo electrónico no válido" });

            if (password && !/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(password.trim()))
                return response.status(400).json({
                    error: "La contraseña debe tener al menos 6 caracteres, incluyendo al menos una letra y un número",
                });

            status = 1;
            const updated = await this.app.updateUser(id, { name, email, password, status });

            if (!updated) {
                return response.status(404).json({ message: "Error en actualizacion" });
            }
            return response.status(200).json({ message: "Exito en actualizacion" });

        } catch (error) {
            return response.status(500).json({ message: "Server Error!" });
        }
    }

    async deleteUser(request: Request, response: Response): Promise<Response> {
        try {

            const id = parseInt(request.params.id);

            if (isNaN(id)) return response.status(400).json({ message: "Error en consulta id" });

            const updated = await this.app.deleteUser(id);

            if (!updated) {
                return response.status(404).json({ message: "Error en borrado de usuario" });
            }

            return response.status(200).json({ message: "Exito en eliminacion" });

        } catch (error) {
            return response.status(500).json({ message: "Server Error!" });
        }
    }
}