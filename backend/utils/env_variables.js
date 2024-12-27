const getMongoURI = () => {
  return process.env.MONGO_URI.
    replace('{password}', process.env.MONGO_PASSWORD).
    replace('{username}', process.env.MONGO_USERNAME);
};

module.exports = { getMongoURI };