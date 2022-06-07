import { http } from "@/utils/request";


export function addBusinessInfo(datas) {
  return http.request({
    method: "post",
    url: "/merchant/add",
    data: datas,

  });
}
export function updateBusinessInfo(datas) {
  return http.request({
    method: "post",
    url: "/merchant/update",
    data: datas,

  });
}
export function getBusinessDetail(datas) {
  return http.request({
    method: "post",
    url: "/merchant/detail",
    data: datas,

  });
}
export function resetIp(datas) {
  return http.request({
    method: "post",
    url: "/merchant/resetIp",
    data: datas,

  });
}
export function updateStatus(datas) {
  return http.request({
    method: "post",
    url: "/merchant/status",
    data: datas,

  });
}
export function getBusinessList(datas) {
  return http.request({
    method: "post",
    url: "/merchant/page",
    data: datas,

  });
}
export function updateIsTest(datas) {
  return http.request({
    method: "post",
    url: "/merchant/updateIsTest",
    data: datas,

  });
}

export function resetGoogleKey(datas) {
  return http.request({
    method: "post",
    url: "/merchant/resetGoogleKey",
    data: datas,

  });
}



export function getBillRecord(datas) {
  return http.request({
    method: "post",
    url: "/merchant/userBet/statistics/balancePage",
    data: datas,
  });
}
export function getMerchantList(datas) {
  return http.request({
    method: "post",
    url: "/merchant/userBet/statistics/merchantList",
    data: datas,
  });
}
export function getUserDetail(datas) {
  return http.request({
    method: "post",
    url: "/merchant/userBet/statistics/merchantUserDetail",
    data: datas,
  });
}


export function getPage(datas) {
  return http.request({
    method: "post",
    url: "/merchant/userBet/statistics/page",
    data: datas,
  });
}







