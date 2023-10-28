import bodyparser from "body-parser";
import express from "express";
import formWidgetRoutes from "./FormWidgetRoute";
import userRoutes from "./UserRoutes";

const app = express();

app.use(bodyparser.json());
app.use(formWidgetRoutes);
app.use(userRoutes);


export default app;
