import path from "path";

const config = {
  projectName: "HanFish",
  date: "2023-7-23",
  designWidth: 750,
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2,
  },
  extensions: [".ts", ".scss", ".vue", "json"],
  alias: {
    "@/components": path.resolve(__dirname, "..", "src/components"),
    "@/enums": path.resolve(__dirname, "..", "src/enums"),
    "@/pages": path.resolve(__dirname, "..", "src/pages"),
    "@/assets": path.resolve(__dirname, "..", "src/assets"),
    "@/models": path.resolve(__dirname, "..", "src/models"),
  },
  sourceRoot: "src",
  outputRoot: "dist",
  plugins: [],
  defineConstants: {},
  copy: {
    patterns: [
      {
        from: "src/assets/icon",
        to: "dist/assets/icon",
      },
      {
        from: "src/assets/images",
        to: "dist/assets/images",
      },
    ],
    options: {},
  },
  framework: "vue3",
  compiler: {
    type: "webpack5",
    prebundle: {
      enable: false,
      force: true,
    },
  },
  sass: {
    resource: ["src/assets/css/var.scss", "src/app.scss"],
    projectDirectory: path.resolve(__dirname, ".."),
  },
  cache: {
    enable: true, // Webpack 持久化缓存配置，建议开启。默认配置请参考：https://docs.taro.zone/docs/config-detail#cache
  },
  mini: {
    webpackChain(chain) {
      chain.merge({
        module: {
          rule: {
            mjsScript: {
              test: /\.mjs$/,
              include: [/pinia/],
              use: {
                babelLoader: {
                  loader: require.resolve("babel-loader"),
                },
              },
            },
          },
        },
      });
    },
    postcss: {
      pxtransform: {
        enable: true,
        config: {},
      },
      url: {
        enable: true,
        config: {
          limit: 1024, // 设定转换尺寸上限
        },
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: "module", // 转换模式，取值为 global/module
          generateScopedName: "[name]__[local]___[hash:base64:5]",
        },
      },
    },
  },
  h5: {
    publicPath: "/",
    staticDirectory: "static",
    postcss: {
      autoprefixer: {
        enable: true,
        config: {},
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: "module", // 转换模式，取值为 global/module
          generateScopedName: "[name]__[local]___[hash:base64:5]",
        },
      },
    },
  },
};

module.exports = function (merge) {
  if (process.env.NODE_ENV === "development") {
    return merge({}, config, require("./dev"));
  }
  return merge({}, config, require("./prod"));
};
