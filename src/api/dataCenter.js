import { http } from "@/utils/request";

export function exportChangeRecord(datas) {
  return http.request({
    method: "post",
    url: "/export/exportChangeRecord",
    responseType : 'blob',

    data: datas,
  });
}
export function exportRegisterStatisticsRecord(datas) {
  return http.request({
    method: "post",
    url: "/export/export/merchant/order/statistics",
    responseType : 'blob',

    data: datas,
  });
}
export function exportUserStatisticsRecord(datas) {
  return http.request({
    method: "post",
    url: "/export/export/merchant/order/statistics",
    responseType : 'blob',

    data: datas,
  });
}

export function getChangeRecordPage(datas) {
  return http.request({
    method: "post",
    url: "/changeRecord/getChangeRecordPage",
    data: datas
  });
}
export function getAllPlatformRate(datas) {
  return http.request({
    method: "post",
    url: "/settingCenter/getAllPlatformRate",
    data: datas
  });
}



export function getOrderDetail(datas) {
  return http.request({
    method: "post",
    url: "/bet/order/detail",
    data: datas
  });
}
export function getRuleNameList(datas) {
  return http.request({
    method: "post",
    url: "/bet/order/game/ruleNameList",
    data: datas
  });
}

export function getRegisterList(datas) {
  return http.request({
    method: "post",
    url: "/bet/order/page",
    data: datas
  });
}
export function getShoeResultDetail(datas) {
  return http.request({
    method: "post",
    url: "/bet/order/shoeResult",
    data: datas
  });
}
export function getBetOrderStatisticsDetail(datas) {
  return http.request({
    method: "post",
    url: "/bet/order/betOrderStatistics",
    data: datas
  });
}


export function getStatisticsList(datas) {
  return http.request({
    method: "post",
    url: "/merchant/order/statistics/page",
    data: datas
  });
}

export function getUserStatisticsList(datas) {
  return http.request({
    method: "post",
    url: "/userBetSta/getPage",
    data: datas
  });
}



