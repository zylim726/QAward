const port = process.env.VUE_APP_QAWARD_FRONTEND_PORT;

if (!port || isNaN(port) || port < 0 || port >= 65536) {
  console.error('Invalid port configuration: Using default port 8080.');
}

// Export the configuration
module.exports = {
  devServer: {
    // Set the port, defaulting to 8080 if not valid
    port: port && !isNaN(port) && port >= 0 && port < 65536 ? port : 9090,
  },
  chainWebpack: (config) => {
    config.module
      .rule('csv')
      .test(/\.csv$/)
      .use('raw-loader')
      .loader('raw-loader')
      .end();
  },
};