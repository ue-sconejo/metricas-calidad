import { Response, Router } from "express";
import { UserApplication } from '../../application/UserApplicationService';
import { UserController } from "../controller/UserController";
import { UserAdapter } from "../adapter/UserAdapter";
import { authenticateToken } from "../web/authMiddleware";

const router = Router();

const userAdapter = new UserAdapter();
const userApp = new UserApplication(userAdapter);
const userController = new UserController(userApp);

// Ruta abierta sin autenticación
router.post('/login', async (request, response) => {
    await userController.login(request, response);
});

// Rutas protegidas con authenticateToken
router.get("/", authenticateToken, async (request, response) => {
    try {
        await userController.getAllUsers(request, response);
    } catch (error) {
        response.status(400).json({ message: "Error en consulta de datos" });
    }
});

router.get("/:id", authenticateToken, async (request, response) => {
    try {
        await userController.getUserById(request, response);
    } catch (error) {
        response.status(400).json({ message: "Error en consulta de datos" });
    }
});

router.post("/", authenticateToken, async (request, response) => {
    try {
        await userController.registerUser(request, response);
    } catch (error) {
        response.status(400).json({ message: "Error en creacion de datos" });
    }
});

router.put("/:id", authenticateToken, async (request, response) => {
    try {
        await userController.updateUser(request, response);
    } catch (error) {
        response.status(400).json({ message: "Error en actualizacion de datos" });
    }
});

router.put("/users/delete/:id", authenticateToken, async (request, response) => {
    try {
        await userController.deleteUser(request, response);
    } catch (error) {
        response.status(400).json({ message: "Error en actualizacion de datos" });
    }
});

export default router;
