import { Router } from "express";
import passport from "passport";
import handlePolicies from "../middleware/handle-police.middleware.js";
import SessionController from "../controllers/session.controller.js";




export default class sessionRoutes {
    path = "/session";
    router = Router();
    sessionController = new SessionController();

    constructor() {
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.post(`${this.path}/register`, this.sessionController.createUserController);
        this.router.post(`${this.path}/login`, this.sessionController.loginUserController);
        this.router.get(`${this.path}/logout`, this.sessionController.logoutUserController);
        this.router.post(`${this.path}/recover`, this.sessionController.recoverPasswordController);
        this.router.get(`${this.path}/premium/:uid`, this.sessionController.updatePremiumController);
        this.router.post(`${this.path}/recover/complete`, handlePolicies(["pswRecover"]), this.sessionController.recoverCompletePswController);
        this.router.get(`${this.path}/user`, handlePolicies(["admin", "user", "premium"]), this.sessionController.getUserByIdController);
        this.router.get(`${this.path}/github`, passport.authenticate("github", { scope: [ 'user:email' ], session: false}));
        this.router.get(`${this.path}/github/callback`, passport.authenticate("github", { failureRedirect: "/api/v1/session/failedlogin", session: false }), this.sessionController.githubLoginController);
        this.router.get(`${this.path}/current`,  handlePolicies(["admin", "user", "premium"]), this.sessionController.currentController);
    }
}

