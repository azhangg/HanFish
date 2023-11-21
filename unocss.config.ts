import type { Preset } from "unocss";
import presetWeapp from "unocss-preset-weapp";
import {
  extractorAttributify,
  transformerClass,
} from "unocss-preset-weapp/transformer";

const { presetWeappAttributify, transformerAttributify } =
  extractorAttributify();

export default {
  presets: [
    presetWeapp({
      isH5: process.env.TARO_ENV === "h5",
      platform: "taro",
      deviceRatio: {
        640: 2.34 / 2,
        750: 1,
        828: 1.81 / 2,
      },
    }) as Preset,
    presetWeappAttributify(),
  ],
  theme: {
    preflightRoot: ["page,::before,::after"],
  },
  shortcuts: [
    {
      "border-base": "border border-gray-500/10",
      center: "flex justify-center items-center",
    },
  ],

  transformers: [transformerAttributify(), transformerClass()],
};
