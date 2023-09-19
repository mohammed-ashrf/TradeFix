export class User {
    _id! : string;
    username !:string;
    password !: string;
    email !:string;
    role !: string;
    access!: string[];
}

export interface GUser {
    user: object;
}