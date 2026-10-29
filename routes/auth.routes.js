
import { Router } from "express";
import token from "../middleware/authMiddlewares.js";

import {
    registerController,
    loginController,
    getCurrentUser,
    logoutController
} from "../controllers/auth.controllers.js";

const AuthRouter = Router();

AuthRouter.post("/register", registerController);

AuthRouter.post("/login", loginController);



AuthRouter.get("/get-current-user", token, getCurrentUser);

AuthRouter.get("/logout", logoutController);


export default AuthRouter;
