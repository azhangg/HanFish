import Taro from "@tarojs/taro";
import moment from "moment";

export const loading = () => {
  Taro.showLoading({ title: "加载中" });
  setTimeout(() => {
    Taro.hideLoading();
  }, 10000);
};

export const msg = (msg: string) =>
  Taro.showToast({
    title: msg,
    icon: "none",
  });

export const goLogin = () => Taro.redirectTo({ url: "/package/login/login" });

export const clearObject = (raw: object, config?: { numberTo?: any }) => {
  const ignoreKeys = ["isTrusted", "_vts", "pointerId"];
  for (const key in raw) {
    if (ignoreKeys.includes(key)) return;
    const type = typeof raw[key];
    switch (type) {
      case "string":
        raw[key] = "";
        break;
      case "number":
        raw[key] = config?.numberTo ?? 0;
        break;
      case "object":
        if (Array.isArray(raw[key])) raw[key] = [];
        else if (raw[key] == null) return;
        else clearObject(raw[key], config);
        break;
      default:
        break;
    }
  }
  return raw;
};

export const getTime = (time: string | Date) => {
  const momentTime = moment(time);
  if (momentTime.format("YYYYMMDD") == moment(Date.now()).format("YYYYMMDD"))
    return momentTime.format("HH:mm");
  else if (momentTime.format("YYYYMM") == moment(Date.now()).format("YYYYMM"))
    return momentTime.format("MM-DD");
  else return momentTime.format("YYYY-MM-DD HH:mm");
};

export const jsonParse = (data: any) => JSON.parse(JSON.stringify(data));

export const testTelPhoneNumber = (number: string) => {
  const regex =
    /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
  return regex.test(number);
};

export const pcaSplit = (pacString: string) => {
  const regex =
    "(?<province>[^省]+自治区|.*?省|.*?行政区|.*?市)(?<city>[^市]+自治州|.*?地区|.*?行政单位|.+盟|市辖区|.*?市|.*?县)(?<county>[^县]+县|.+区|.+市|.+旗|.+海域|.+岛)?(?<village>.*)";
  return pacString.match(regex) ?? [];
};
