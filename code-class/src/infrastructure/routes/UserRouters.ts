import { response, Router } from "express";
import { UserApplication } from '../../application/UserApplicationService';
import { UserController } from "../controller/UserController";
import { UserAdapter } from "../adapter/UserAdapter";

const router = Router();

const userAdapter = new UserAdapter();
const userApp = new UserApplication(userAdapter);
const userController = new UserController(userApp);

router.get("/", async (request, response) => {
    try {
        await userController.getAllUsers(request, response);
    } catch (error) {
        response.status(400).json({ message: "Error en consulta de datos 1" });
    }
});

router.get("/:id", async (request, response) => {
    try {
        await userController.getUserById(request, response);
    } catch (error) {
        response.status(400).json({ message: "Error en consulta de datos" });
    }
});

router.post("/", async (request, response) => {
    try {
        await userController.registerUser(request, response);
    } catch (error) {
        response.status(400).json({ message: "Error en creacion de datos" });
    }
});

router.put("/:id", async (request, response) => {
    try {
        await userController.updateUser(request, response);
    } catch (error) {
        response.status(400).json({ message: "Error en actualizacion de datos" });
    }
});

router.put("/users/delete/:id", async (request, response) => {
    try {
        await userController.deleteUser(request, response);
    } catch (error) {
        response.status(400).json({ message: "Error en actualizacion de datos" });
    }
});


export default router;