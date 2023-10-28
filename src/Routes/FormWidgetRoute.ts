import { FormWidgetController } from "../Controller/FormWidgetController";
import { Router } from "express";
import isAuth from "../middlewares/isAuth";
import { authMiddleware } from "../middlewares/attachCurrentUser";

const routes = Router();
const formWidgetController = new FormWidgetController();

routes.post("/formWidget",isAuth, authMiddleware, formWidgetController.createWidget);
routes.post("/elementTypes", formWidgetController.createElementTypes);
routes.get("/widgets/:id",isAuth, authMiddleware, formWidgetController.getFormWidget);
export default routes;
