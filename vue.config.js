module.exports = {
  devServer: {
    proxy: {
      "/birthday": {
        target: "http://wxhboy.cn"
      }
    }
  },
  publicPath: process.env.NODE_ENV === "production" ? "/birthday/" : "/"
};
