export class UserResponse {

    public email: string;
    public message: string;
    public roles: string[];

    constructor({ email = '', message = '', roles = [] }: {
        email?: string;
        message?: string;
        roles?: string[];
    }) {
        this.email = email;
        this.message = message;
        this.roles = roles;
    }

}