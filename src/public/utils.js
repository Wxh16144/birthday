/**
 * 时间戳格式转换以及计算
 * */
export function formatTime(date = new Date(), fmt = "yyyy-MM-dd hh:mm:ss") {
  if (Object.prototype.toString.call(date).slice(8, -1) !== "Date") {
    date = new Date(date);
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  }
  let o = {
    "M+": date.getMonth() + 1,
    "d+": date.getDate(),
    "h+": date.getHours(),
    "m+": date.getMinutes(),
    "s+": date.getSeconds()
  };
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + "";
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? str : str.padStart(2, 0)
      );
    }
  }
  return fmt;
}

export function getMorningTime(date = new Date()) {
  const _date = formatTime(new Date(date).getTime(), "yyyy/MM/dd");
  return new Date(_date).getTime();
}

export function equipment() {
  let u = navigator.userAgent;
  const isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1; // android终端
  const isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
  return (isAndroid && "android") || (isiOS && "ios");
}
