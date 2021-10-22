require("es6-promise").polyfill();
require("isomorphic-fetch");
require("dotenv").config();

exports.contentServer = async () => {
  try {
    // eslint-disable-next-line no-undef
    const response = await fetch("https://hecked-blog.herokuapp.com/ghost", {
      method: "get",
    });
    return response.ok;
  } catch (error) {
    console.log(error);
    return false;
  }
};
