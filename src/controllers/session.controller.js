import { ADMIN_EMAIL, ADMIN_PASSWORD } from "../config/config.js";
import UserDTO from "../dao/DTOs/user.dto.js";
import { CartsService, UsersService } from "../repositories/index.js";
import {generateJWT} from "../utils/jwt.js";


export default class SessionController {
    usersService;
    CartsService
    constructor() {
        this.usersService = UsersService; 
        this.cartsService = CartsService;
    }

    createUserController = async (req, res) => {
        try {
            const newUser = await this.usersService.createUser(req.body);
            if (newUser === "User already exists") {
                return res.status(401).render('register', {error: "User already exists"})
            }
            const cartUser = await this.cartsService.addCart();
            const cartUserId = cartUser._id;
            const addCartUser = await this.usersService.updateUser(newUser._id, {carts : cartUserId })
            return res.render('register', {RegisterSuccessfully: "User added successfully"})
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }

    loginUserController = async (req, res) => {
        try {
            const userSubmitted = req.body
            if (userSubmitted.email == ADMIN_EMAIL && userSubmitted.password == ADMIN_PASSWORD) {
                const signUser = {
                    firstName: "adminCoder",
                    email: ADMIN_EMAIL,
                    role: "admin",
                };
                const token = generateJWT({...signUser});
                console.log(token)
                return res.cookie("cookieToken", token, {
                    maxAge:60*60*1000,
                    httpOnly: true
                }).redirect('/views/home');
            }
            const userLogin = await this.usersService.loginUser(userSubmitted);
            if (userLogin === "User not found") {
                return res.status(401).render('login', {error: "User not found"})
            }
            if (userLogin === "Incorrect password") {
                return res.status(401).render('login', {error: "Incorrect password"})
            }
            const signUser = {
                user: userLogin._id,
                firstName: userLogin.firstName,
                lastName: userLogin.lastName,
                email: userLogin.email,
                role: userLogin.role,
            };
            const token = generateJWT({...signUser});
            //console.log(token)
            res.cookie("cookieToken", token, {
                maxAge:60*60*1000,
                httpOnly: true
            }).redirect('/views/home');
        } catch (error) {
            return res.status(400).json({ message: error.message});
        }
    }
    logoutUserController = (req, res) => {
        try {
            res.clearCookie("cookieToken");
            return res.redirect('/views/login');
        } catch (error) {
            return console.log(error);
        }
    }
    getUserByIdController = async (req, res) => {
        try {
            const userId = req.user;
            const cart = await this.usersService.getUserById(userId.user.user);
            return res.send(cart);
        } catch (error) {
            return console.log(error);
        }
    }

    recoverPasswordController = async (req, res) => {
        try {
            const user = await this.usersService.recoverPassword(req.body);
            if (user === "User not found") {
                return res.render("recover", {error: "User not found"});
            }
            return res.redirect("/views/login");
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    currentController = async (req, res) => {
        const user = req.user.user;
        const currentUser = new UserDTO(user)
        return res.json({message: "Current access information", currentUser});
    }

    githubLoginController  = async (req, res) => {
        try {
            const userLogin = req.user;
            const signUser = {
                user: userLogin._id,
                firstName: userLogin.firstName,
                lastName: userLogin.lastName,
                email: userLogin.email,
                role: userLogin.role,
            };
            const token = generateJWT({...signUser});
                //console.log(token)
                return res.cookie("cookieToken", token, {
                    maxAge:60*60*1000,
                    httpOnly: true
                }).redirect('/views/home');
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }
}