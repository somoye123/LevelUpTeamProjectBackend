module.exports = {
  mongodb_url: process.env.MONGODB_URL,
  jwt_secret: process.env.JWT_SECRET,
  port: process.env.PORT || 3030,
  sendgrid_api_key: process.env.SENDGRID_API_KEY
};
