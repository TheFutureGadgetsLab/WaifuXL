const withBundleAnalyzer = require('@next/bundle-analyzer');

const nextConfig = {
  output: 'export',
  compiler: {
    emotion: true,
  },
  /** Disable the `X-Powered-By: Next.js` response header. */
  poweredByHeader: false,

  images: {
    loader: 'custom',
  },

  swcMinify: true,

  webpack(config, { isServer }) {
    // EUI uses some libraries and features that don't work outside of a
    // browser by default. We need to configure the build so that these
    // features are either ignored or replaced with stub implementations.
    if (isServer) {
      config.externals = config.externals.map((eachExternal) => {
        if (typeof eachExternal !== 'function') {
          return eachExternal;
        }

        return (context, callback) => {
          if (context.request.indexOf('@elastic/eui') > -1) {
            return callback();
          }

          return eachExternal(context, callback);
        };
      });

      // Mock HTMLElement on the server-side
      const definePluginId = config.plugins.findIndex((p) => p.constructor.name === 'DefinePlugin');

      config.plugins[definePluginId].definitions = {
        ...config.plugins[definePluginId].definitions,
        HTMLElement: function () {},
      };
    }

    config.resolve.mainFields = ['module', 'main'];

    return config;
  },
};

/**
 * Enhances the Next config with the ability to:
 * - Analyze the webpack bundle
 * - Load images from JavaScript.
 * - Load SCSS files from JavaScript.
 */
module.exports = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})(nextConfig);
