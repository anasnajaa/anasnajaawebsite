# Anas Najaa Website
This is the source code for Anas Najaa main [website](https://anas.najaa.org).

## Technologies used

### Server Side
- NodeJS
- Express
- Postgres
- MogoDB
- EJS

### Client Side
- Bootstrap
- Jquery
- FontAwesome
- MasonryJS

### Environmnet Variables
#### DB
- ATLAS_URI_RW: MongoDB URI
- JAWSDB_URL: MySQL URI


#### General Config
- NODE_ENV: Process Environemt (development/production)
- PORT: Port Number
- SESSION_SECRET: Session Secret
- JWT_SECRET: JSON Web Token Secret
- JWT_REFRESH_SECRET: JSON Web Token refresh secret
- ISSUER: JWT Issuer


#### Emails
- EMAIL_DEV: Development Email
- EMAIL_INFO: Info Email
- EMAIL_DBADMIN: Database Admin Email
- EMAIL_SUPPORT: Support Email
- EMAIL_PAYMENT: Payment Email


#### Mobile
- INFO_MOBILE: Info Mobile


#### Other Config
- PUBLIC_ROOT_URL: Production root URL


#### Integrations
##### Twilio
- TWILIO_ACC_SID: TWILIO SID
- TWILIO_AUTH: TWILIO Auth
- TWILIO_FROM: TWILIO From


##### Google
- GOOGLE_RECAPTCHA_SECRET_KEY: Recaptch Server Key


##### SendGrid
- SENDGRID_API_KEY: SendGrid API Key


##### Ghost
- BLOG_API_KEY: Ghost API Key
- BLOG_API_URL: Ghost API URL
