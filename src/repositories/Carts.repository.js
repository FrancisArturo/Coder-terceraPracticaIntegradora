

export default class CartsRepository {
    constructor(dao) {
        this.dao = dao;
    }

    addCart = async () => {
        let result = await this.dao.addCartDao();
        return result;
    }
    getProductsCart = async (cid) => {
        let result = await this.dao.getProductsCartDao(cid);
        return result;
    }
    addProductCart = async (cid, pid, quantityProduct) => {
        let result = await this.dao.addProductCartDao(cid, pid, quantityProduct);
        return result;
    }
    deleteProductCart = async (cid, pid) => {
        let result = await this.dao.deleteProductCartDao(cid, pid);
        return result;
    }
    deleteProductsCart = async (cid) => {
        let result = await this.dao.deleteProductsCartDao(cid);
        return result;
    }
    updateProductCart = async (cid, pid, quantity) => {
        let result = await this.dao.updateProductCartDao(cid, pid, quantity);
        return result;
    }
    updateProductsCart = async (idUpdate, products) => {
        let result = await this.dao.updateProductsCartDao(idUpdate, products);
        return result;
    }
    purchaseCart = async (cid) => {
        let result = await this.dao.purchaseCartDao(cid);
        return result
    }
}