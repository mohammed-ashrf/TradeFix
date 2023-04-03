module.exports = {
    port: process.env.PORT || 4000,
    dbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/repair-app',
}