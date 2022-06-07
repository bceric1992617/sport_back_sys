import { http } from "@/utils/request";


export function login(datas) {
  return http.request({
    method: "post",
    url: "/sys/login",
    data: datas,
    header : {
      "Content-Type" : "application/x-www-form-urlencoded"
    }
  });
}

export function firstEnter(datas) {
  return http.request({
    method: "post",
    url: "/sys/firstEnter",
    data: datas,
  });
}

export function generateGoogleKey() {
  return http.request({
    method: "post",
    url: "/sys/generateGoogleKey",
  });
}

export function verifyGoogleCode(datas) {
  return http.request({
    method: "post",
    url: "/sys/verifyGoogleCode",
    data: datas,
  });
}

export function loginout() {
  return http.request({
    method: "post",
    url: "/sys/quit",
    data: {}
  });
}




