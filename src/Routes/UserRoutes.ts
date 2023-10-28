import { UserController } from './../Controller/UserController';
import { Router } from "express";

const routes = Router();
const userController = new UserController();

routes.post("/login", userController.login);
routes.post("/signup", userController.signUp);
export default routes;
