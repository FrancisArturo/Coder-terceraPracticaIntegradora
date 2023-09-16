import { Router } from "express";
import handlePolicies from "../middleware/handle-police.middleware.js";
import ViewsController from "../controllers/views.controller.js";

export default class viewsRoutes {
    path = "/views";
    router = Router();
    viewsController = new ViewsController();

    constructor() {
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.get(`${this.path}/login`, this.viewsController.loginViewController);
        this.router.get(`${this.path}/register`, this.viewsController.registerViewController);
        this.router.get (`${this.path}/recover`,  this.viewsController.recoverViewController);
        this.router.get (`${this.path}/recover/:tid`, handlePolicies(["pswRecover"]), this.viewsController.recoverAuthorizedController);
        this.router.get(`${this.path}/home`, handlePolicies(["admin", "user", "premium"]), this.viewsController.homeViewController);
        this.router.get(`${this.path}/cart/:cid`, this.viewsController.getProductsCartViewController);
        this.router.get (`${this.path}/addproduct`, this.viewsController.addProductViewController);
        this.router.get (`${this.path}/updateproduct`, this.viewsController.updateProductViewController);
        this.router.get (`${this.path}/ticket`, this.viewsController.ticketViewController);
    }
}