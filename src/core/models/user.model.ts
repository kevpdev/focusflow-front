export class User {
    public email: string;
    public roles: string[]; 

    constructor({email= '', roles= []} : {
       email?: string;
       roles?: string[]; 
    }) {
        this.email = email;
        this.roles = roles;
    }
}