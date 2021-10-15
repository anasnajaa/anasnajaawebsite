const { merge } = require("lodash");
const sharedSettings = {
  saltingRounds: 10,
  workers: process.env.WEB_CONCURRENCY || 1,
  mongoUri: process.env.ATLAS_URI_RW,
};

const developmentSettings = {
  port: process.env.PORT || 5000,
  corsOptions: {
    origin: "*",
    credentials: true,
  },
  jwtCookieOptions: {
    expires: new Date(Date.now() + 604800000),
    secure: false,
    httpOnly: true,
  },
  jwtSecure: false,
  jwtCookieExpiry: new Date(Date.now() + 604800000),
  session: {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1 * 5 * 60 * 1000, // 5 minutes
    },
  },
};

const productionSettings = {
  port: process.env.PORT || 80,
  corsOptions: {
    origin: [process.env.CORS_URL],
    credentials: true,
  },
  jwtCookieOptions: {
    expires: new Date(2147483647000),
    secure: true,
    httpOnly: true,
    sameSite: "None",
  },
  jwtSecure: true,
  jwtCookieExpiry: new Date(2147483647000),
  session: {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1 * 60 * 60 * 1000, // 60 minutes
    },
  },
};

module.exports = {
  development: merge({ ...sharedSettings }, developmentSettings),
  production: merge({ ...sharedSettings }, productionSettings),
};
