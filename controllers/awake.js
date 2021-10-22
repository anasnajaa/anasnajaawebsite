const { v4 } = require("uuid");
const { contentServer } = require("../util/awake");

module.exports = async (req, res) => {
  const contentServerAwake = await contentServer();
  res.json({
    id: v4(),
    contentServerAwake,
  });
};
