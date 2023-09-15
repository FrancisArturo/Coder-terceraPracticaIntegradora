

export default class UsersRepository {
    constructor(dao) {
        this.dao = dao;
    }

    createUser = async (user) => {
        let result = await this.dao.createUserDao(user);
        return result;
    }
    loginUser = async (user) => {
        let result = await this.dao.loginUserDao(user);
        return result;
    }
    recoverPassword = async (user) => {
        let result = await this.dao.recoverPasswordDao(user);
        return result;
    }
    recoverCompletePsw = async (email, psw) => {
        let result = await this.dao.recoverCompletePswDao(email, psw);
        return result;
    }
    updateUser = async (uid, userUpdate) => {
        let result = await this.dao.updateUserDao(uid, userUpdate);
        return result;
    }
    getUserById = async (uid) => {
        let result = await this.dao.getUserByIdDao(uid);
        return result;
    }
}