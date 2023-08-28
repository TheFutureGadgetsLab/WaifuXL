/* eslint-disable @typescript-eslint/no-var-requires,@typescript-eslint/no-use-before-define,@typescript-eslint/no-empty-function,prefer-template */
const fs = require("fs");
const path = require("path");
const iniparser = require("iniparser");

const withBundleAnalyzer = require("@next/bundle-analyzer");

/**
 * If you are deploying your site under a directory other than `/` e.g.
 * GitHub pages, then you have to tell Next where the files will be served.
 * We don't need this during local development, because everything is
 * available under `/`.
 */
const usePathPrefix = process.env.PATH_PREFIX === "true";
const pathPrefix = usePathPrefix ? derivePathPrefix() : "";
const nextConfig = {
  output: "export",
  compiler: {
    emotion: true,
  },
  /** Disable the `X-Powered-By: Next.js` response header. */
  poweredByHeader: false,

  /**
   * When set to something other than '', this field instructs Next to
   * expect all paths to have a specific directory prefix. This fact is
   * transparent to (almost all of) the rest of the application.
   */
  basePath: pathPrefix,

  images: {
    loader: "custom",
  },

  swcMinify: true,

  webpack(config, { isServer }) {
    // EUI uses some libraries and features that don't work outside of a
    // browser by default. We need to configure the build so that these
    // features are either ignored or replaced with stub implementations.
    if (isServer) {
      config.externals = config.externals.map((eachExternal) => {
        if (typeof eachExternal !== "function") {
          return eachExternal;
        }

        return (context, callback) => {
          if (context.request.indexOf("@elastic/eui") > -1) {
            return callback();
          }

          return eachExternal(context, callback);
        };
      });

      // Mock HTMLElement on the server-side
      const definePluginId = config.plugins.findIndex(
        (p) => p.constructor.name === "DefinePlugin",
      );

      config.plugins[definePluginId].definitions = {
        ...config.plugins[definePluginId].definitions,
        HTMLElement: function () {},
      };
    }

    config.resolve.mainFields = ["module", "main"];

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
  enabled: process.env.ANALYZE === "true",
})(nextConfig);

/**
 * This starter assumes that if `usePathPrefix` is true, then you're serving the site
 * on GitHub pages. If that isn't the case, then you can simply replace the call to
 * this function with whatever is the correct path prefix.
 *
 * The implementation attempts to derive a path prefix for serving up a static site by
 * looking at the following in order.
 *
 *    1. The git config for "origin"
 *    2. The `name` field in `package.json`
 *
 * Really, the first should be sufficient and correct for a GitHub Pages site, because the
 * repository name is what will be used to serve the site.
 */
function derivePathPrefix() {
  const gitConfigPath = path.join(__dirname, ".git", "config");

  if (fs.existsSync(gitConfigPath)) {
    const gitConfig = iniparser.parseSync(gitConfigPath);

    if (gitConfig['remote "origin"'] != null) {
      const originUrl = gitConfig['remote "origin"'].url;

      // eslint-disable-next-line prettier/prettier
      return (
        "/" +
        originUrl
          .split("/")
          .pop()
          .replace(/\.git$/, "")
      );
    }
  }

  const packageJsonPath = path.join(__dirname, "package.json");

  if (fs.existsSync(packageJsonPath)) {
    const { name: packageName } = require(packageJsonPath);
    // Strip out any username / namespace part. This works even if there is
    // no username in the package name.
    return "/" + packageName.split("/").pop();
  }

  throw new Error(
    "Can't derive path prefix, as neither .git/config nor package.json exists",
  );
}
