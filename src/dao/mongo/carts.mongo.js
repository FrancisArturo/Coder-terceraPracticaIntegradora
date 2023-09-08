import { cartModel } from "../../models/cart.models.js";
import { productsModel } from "../../models/products.models.js";

export default class CartsDao {
    addCartDao = async () => {
        try {
            const cart = {
            products: []
            }
            const newCart = await cartModel.create(cart);
            return newCart;
        } catch (error) {
            throw new Error("creating cart error");
        }
        
    }
    getProductsCartDao = async (cid) => {
        try {
            const cart = await cartModel.findById(cid).populate("products.product");
            if (!cart) {
                return "Cart does not exist";
            }
            return cart.products;
        } catch (error) {
            throw new Error("get products cart error");
        }

    }
    addProductCartDao = async (cid, pid, quantityProduct) => {
        try {
            const cart = await cartModel.findById(cid);
            const product = await productsModel.findById({ _id: pid });
            if (!cart) {
                return "Cart not found";
            }
            if (!product) {
                return "Product not found";
            }
            if (cart.products.length === 0) {
                cart.products.push({product: pid, quantity: quantityProduct});
                await cart.save();
                return cart;
            }
            if (cart.products.length > 0) {
                for (let obj in cart.products) {
                    if (cart.products[obj].product == pid) {
                        cart.products[obj].quantity += parseInt(quantityProduct);
                        await cart.save();
                        return cart;
                    }
                }
            }
            cart.products.push({product: pid, quantity: quantityProduct});
            await cart.save(); 
            return cart;
        } catch (error) {
            throw new Error(error);
        }
    }
    deleteProductCartDao = async (cid, pid) => {
        try {
            const cart = await cartModel.findById(cid);
            if (!cart) {
                return "Cart not found";
            }
            for (let obj in cart.products) {
                if (cart.products[obj].product == pid) {
                    cart.products.splice(obj, 1);
                    await cart.save();
                    return cart;
                }
            }
            return "Product not found";
        } catch (error) {
            throw new Error(error);
        }

    }
    // deleteCart = async (id) => {
    //     const cart = await cartModel.findById(id);
    //     if (!cart) {
    //         return "Cart not found";
    //     }
    //     await cart.deleteOne();
    //     return "Cart deleted";
    // }
    deleteProductsCartDao = async (cid) => {
        try {
            const cart = await cartModel.findById(cid);
            if (!cart) {
                return "Cart not found";
            }
            cart.products = [];
            await cart.save();
            return cart;
        } catch (error) {
            throw new Error("delete products cart error");
        }
        
    }

    updateProductCartDao = async (cid, pid, quantity) => {
        try {
            const cart = await cartModel.findById(cid);
            const product = await productsModel.findById(pid);
            if (!cart) {
                return "Cart not found";
            }
            if (!product) {
                return "Product not found";
            }
            for (let obj in cart.products) {
                if (cart.products[obj].product == pid) {
                    cart.products[obj].quantity = quantity;
                    await cart.save();
                    return cart;
                }
            }
            return "Product not found";
        } catch (error) {
            throw new Error("update product cart error");
        }
    }
    updateProductsCartDao = async (cid, products) => {
        try {
            const cart = await cartModel.findById(cid);
            if (!cart) {
                return "Cart not found";
            }
            for (let obj in products) {
                const productInList = await productsModel.findById(products[obj].product);
                if (!productInList) {
                    return "Product not found";
                }
            }
            cart.products = products;
            await cart.save();
            return cart;
        } catch (error) {
            throw new Error("update products cart error");
        }   
    }
    purchaseCartDao = async (cid) => {
        try {
            let productsOrder = [];
            let productPrice;
            const cart = await cartModel.findById(cid);
            if (!cart) {
                return "Cart not found";
            }
            for (let obj in cart.products) {
                const productInList = await productsModel.findById(cart.products[obj].product);
                if (productInList.stock >= cart.products[obj].quantity) {
                    productPrice = cart.products[obj].quantity * productInList.price;
                    let product = {
                        id: cart.products[obj].product,
                        quantity: cart.products[obj].quantity,
                        price: productPrice
                    }
                    productsOrder.push(product);
                    await productsModel.updateOne({ _id: cart.products[obj].product }, {stock: productInList.stock - cart.products[obj].quantity});
                }
            }
            return productsOrder;
        } catch (error) {
            throw new Error("Purchase products in cart error");
        }
    }
}


