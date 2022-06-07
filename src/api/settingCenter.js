import { http } from "@/utils/request";


export function getMerchantLevelPage(datas) {
  return http.request({
    method: "post",
    url: "/settingCenter/getMerchantLevelPage",
    data: datas
  });
}
export function getRatePage(datas) {
  return http.request({
    method: "post",
    url: "/settingCenter/getRatePage",
    data: datas
  });
}

export function addMerchantLevel(datas) {
  return http.request({
    method: "post",
    url: "/settingCenter/merchantLevelAddAndEdit",
    data: datas
  });
}
export function addRate(datas) {
  return http.request({
    method: "post",
    url: "/settingCenter/rateAddAndEdit",
    data: datas
  });
}






