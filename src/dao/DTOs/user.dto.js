export default class UserDTO {
    constructor(user){
        this.user = user.user,
        this.firstname = user.firstName,
        this.lastname = user.lastName,
        this.role = user.role
    }
}