import { EMAIL, PHONE } from "../config/config.js";
import { CartsService, TicketsService, UsersService } from "../repositories/index.js";
import { transporter } from "../utils/transporter.js";
//import { client } from "../utils/twilioClient.js";


export default class CartsController {
    cartsService;
    ticketService;
    usersService;
    constructor() {
        this.cartsService = CartsService;
        this.ticketService = TicketsService;
        this.usersService = UsersService;
    }
    getProductsCartController = async (req, res) => {
        try {
            const { cid } = req.params;
            const cartProducts = await this.cartsService.getProductsCart(cid);
            if (cartProducts === "Cart does not exist") {
                return res.json({
                    message: "Cart does not exist",
                    data: cartProducts,
                })
            }
            return res.json({
                message: "Cart retrieved successfully",
                data: cartProducts,
            })
            //res.render("cart", { cartProducts, cid });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    addProductCartController = async (req, res) => {
        try {
            const { cid, pid } = req.params;
            const quantityProduct = req.body;
            const cart = await this.cartsService.addProductCart(cid, pid, quantityProduct.quantity);
            if (cart === "Cart not found") {
                return res.json({
                    message: "Cart not found",
                    data: cart
                })
            }
            if (cart === "Product not found") {
                return res.json({
                    message: "Product not found",
                    data: cart
                })
            }
            return res.json({
                message: "Product added successfully",
                data: cart
            })
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    deleteProductCartController = async (req, res) => {
        try {
            const { cid, pid } = req.params;
            const cart = await this.cartsService.deleteProductCart(cid, pid);
            if (cart === "Cart not found") {
                return res.json({
                    message: "Cart not found",
                    data: cart
                })
            }
            if (cart === "Product not found") {
                return res.json({
                    message: "Product not found",
                    data: cart
                })
            }
            return res.json({
                message: "Product deleted successfully",
                data: cart
            })
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    deleteProductsCartController = async (req, res) => {
        try {
            const { cid } = req.params;
            const cart = await this.cartsService.deleteProductsCart(cid);
            if (cart === "Cart not found") {
                return res.json({
                    message: "Cart not found",
                    data: cart
                })
            }
            return res.json({
                message: "Cart products deleted successfully",
                data: cart
            })
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    updateProductCartController = async (req, res) => {
        try {
            const { cid, pid } = req.params;
            const { quantity } = req.body;
            const cart = await this.cartsService.updateProductCart(cid, pid, quantity);
            if (cart === "Cart not found") {
                return res.json({
                    message: "Cart not found",
                    data: cart
                })
            }
            if (cart === "Product not found") {
                return res.json({
                    message: "Product not found",
                    data: cart
                })
            }
            return res.json({
                message: "Product quantity updated successfully",
                data: cart
            })
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    updateProductsCartController = async (req, res) => {
        try {
            const { cid } = req.params;
            const products = req.body;
            const cart = await this.cartsService.updateProductsCart(cid, products);
            if (cart === "Cart not found") {
                return res.json({
                    message: "Cart not found",
                    data: cart
                })
            }
            if (cart === "Product not found") {
                return res.json({
                    message: "Some of the products are not found",
                    data: cart
                })
            }
            return res.json({
                message: "Cart updated successfully",
                data: cart
            })
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    purchaseCartController = async (req, res) => {
        try {
            const { cid } = req.params;
            const user = req.user;
            let total = 0;
            let order;
            const result = await this.cartsService.purchaseCart(cid);
            if (!result) {
                return res.json({ message: "Purchase error, products without stock"})
            }
            for (let obj in result) {
                let objectId = String(result[obj].id);
                let objectIdMatch = objectId.match(/[0-9a-f]{24}/i);
                let productId = objectIdMatch[0]
                await this.cartsService.deleteProductCart(cid, productId);
                total += result[obj].price;
            }
            if (total === 0) {
                const cartProducts = await this.cartsService.getProductsCart(cid);
                return res.render('ticket', {cartProducts});
            }
            order = {
                code:  Math.floor(Math.random() * (1000000000 - 10000000 + 1) + 10000000),
                purchase_datetime: Date.now(),
                amount: total,
                purchaser: user.user.email,
            }
            const cartProducts = await this.cartsService.getProductsCart(cid);
            const Ticketcreate = await this.ticketService.createTicket(order);
            const sendEmail = await transporter.sendMail({
                from: EMAIL,
                to: user.user.email,
                subject: `Purchase ticket ecommerce`,
                html: `
                <div>
                    <h2>Ticket N°: ${Ticketcreate.code}</h2>
                    <div>
                        <p>purchase_datetime: ${Ticketcreate.purchase_datetime}</p>
                        <p>amount: ${Ticketcreate.amount}</p>
                        <p>purchaser: ${Ticketcreate.purchaser}</p>
                    </div>
                </div>
                `,
            })
            // const userFound = await this.usersService.getUserById(user.user.user);
            // if (userFound.phone) {
            //     const sendSms = await client.messages.create({
            //     body: `Thanks for your Purchase ${user.user.firstName} ${user.user.lastName}, your ticket N° is: ${Ticketcreate.code}`,
            //     from: PHONE,
            //     to: `+${userFound.phone}`,
            //     })
            // };
            return res.render('ticket', {Ticketcreate, cartProducts})
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}
