"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
exports.config = {
    cloudinary: {
        cloud_name: "dxatiufog",
        api_key: "197428951932886",
        api_secret: "HAQQZKm4z-cmraA1tt-5lSW-mkw",
    },
    mailtrap: {
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        user: "cfe71d1abf2093",
        password: "9dc0c162f5073f",
    },
    port: 1865,
    dbPassword: "szKCR1LGPNDmO0NP",
    dbUrl: `mongodb+srv://mo6192001:<PASSWORD>@cluster0.dny8wim.mongodb.net/vehicles-management?retryWrites=true&w=majority`,
    jwt: {
        jwtSecret: "m-o-h-a-m-m-e-d-r*a*d*w*a*n*2/0/",
        jwtExpiresIn: "24h",
        jwtCookieExpiresIn: 24,
    },
};
