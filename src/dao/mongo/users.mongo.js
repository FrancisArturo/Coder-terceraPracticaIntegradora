import userModel from "../../models/user.models.js";
import { hashPassword, comparePassword } from "../../utils/encrypt.js";


export default class UsersDao {
    createUserDao = async (user) => {
        try {
            const userFound = await userModel.findOne({ email: user.email })
            if (userFound) {
                return "User already exists"
            }
            const pswHashed = await hashPassword(user.password);
            const newUser = {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                password: pswHashed,
                phone: user.phone,
                age : user.age,
                role: "user",
            }
            const userCreated = await userModel.create(newUser);
            return userCreated;
        } catch (error) {
            throw new Error("creating user error");
        }

    }
    loginUserDao = async (user) => {
        try {
            const userFound = await userModel.findOne({ email: user.email });
            if (!userFound) {
                return "User not found";
            }
            const isMatch = await comparePassword(user.password, userFound.password);
            if (!isMatch) {
                return "Incorrect password";
            }
            return userFound;
        } catch (error) {
            throw new Error("logging user error");
        }
        
    }
    recoverPasswordDao = async (user) => {
        try {
            const userFound = await userModel.findOne({ email: user.email });
            if (!userFound) {
                return "User not found";
            }
            return userFound;
        } catch (error) {
            throw new Error("password recovery error");
        }
        
    }
    recoverCompletePswDao = async (email, psw) => {
        try {
            const userFound = await userModel.findOne({ email: email });
            const isMatch = await comparePassword(psw, userFound.password);
            if (isMatch) {
                return "the password must be different from the previous one";
            }
            const pswHashed = await hashPassword(psw);
            userFound.password = pswHashed;
            await userFound.save();
            return userFound;
        } catch (error) {
            throw new Error("password recovery error");
        }
    }
    updateUserDao = async (uid, userUpdate) => {
        try {
            const updateUser = await userModel.updateOne({ _id: uid }, userUpdate);
            return updateUser;
        } catch (error) {
            throw new Error("Update user error");
        }
    }
    getUserByIdDao = async (uid) => {
        try {
            const userFound = await userModel.findOne({ _id: uid });
            return userFound;
        } catch (error) {
            throw new Error(error);
        }
    }
}