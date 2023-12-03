export const config = {
  adminData: {
    role: "admin",
    name: "admin",
    email: "admin@vehicle.com",
    password: "1234asdf",
    passwordConfirm: "1234asdf",
    phoneNumber: "51111111",
  },
  cloudinary: {
    cloud_name: "dkaaygc7q",
    api_key: "374594396521555",
    api_secret: "DUTLACwrpf3FkNI_wW5WGMMuwt8",
  },
  mailtrap: {
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    user: "f19d2775cc6552",
    password: "d4e7672c6f5084",
  },
  port: 1865,
  dbPassword: "szKCR1LGPNDmO0NP",
  dbUrl: `mongodb+srv://mo6192001:<PASSWORD>@cluster0.dny8wim.mongodb.net/vehicles-management?retryWrites=true&w=majority`,
  jwt: {
    jwtSecret: "m-o-h-a-m-m-e-d-r*a*d*w*a*n*2/0/",
    jwtExpiresIn: "24h",
    jwtCookieExpiresIn: 24,
  },
  contentData: {
    adminLogo:
      "https://png.pngtree.com/png-vector/20201128/ourmid/pngtree-sports-car-png-image_2434987.jpg",
    appLogo:
      "https://png.pngtree.com/png-vector/20201128/ourmid/pngtree-sports-car-png-image_2434987.jpg",
    adminTitle: "ROM",
    appTitle: "ROM",
  },
};
