import { response, Router } from "express";
import { UserApplication } from '../../application/UserApplicationService';
import { UserController } from "../controller/UserController";
import { UserAdapter } from "../adapter/UserAdapter";

const router = Router();

const userAdapter = new UserAdapter();
const userApp = new UserApplication(userAdapter);
const userController = new UserController(userApp);

router.get("/", async (request, reponse)=>{
    try {
        await userController.getAllUsers(request, response);
    } catch (error) {
        reponse.status(400).json({message: "Error en consulta de datos"});
    }
});

router.get("/users/:id", async (request, reponse)=>{
    try {
        await userController.getUserById(request, response);
    } catch (error) {
        reponse.status(400).json({message: "Error en consulta de datos"});
    }
});

router.put("/users/:id", async (request, reponse)=>{
    try {
        await userController.updateUser(request, response);
    } catch (error) {
        reponse.status(400).json({message: "Error en actualizacion de datos"});
    }
});


export default router;