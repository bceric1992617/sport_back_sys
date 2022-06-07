import { http } from "@/utils/request";









export function getCurrency() {
  return http.request({
    method: "post",
    url: "/common/currencyList",

  });
}

export function getRuleName() {
  return http.request({
    method: "post",
    url: "/bet/order/game/ruleNameList",

  });
}