import { http } from "@/utils/request";


export function getAdminManagePage(datas) {
  return http.request({
    method: "post",
    url: "/manage/getAdminManagePage",
    data: datas
  });
}

export function addAndEditAdmin(datas) {
  return http.request({
    method: "post",
    url: "/manage/addAndEditAdmin",
    data: datas
  });
}

export function getAllRoles() {
  return http.request({
    method: "post",
    url: "/manage/getAllRoles",

  });
}

export function resetGoogleKey(datas) {
  return http.request({
    method: "post",
    url: "/manage/resetGoogleKey",
    data: datas
  });
}

export function setWhiteIps(datas) {
  return http.request({
    method: "post",
    url: "/manage/setWhiteIps",
    data: datas
  });
}

export function updateStatus(datas) {
  return http.request({
    method: "post",
    url: "/manage/controlStatus",
    data: datas
  });
}



export function getRoleList(datas) {
  return http.request({
    method: "post",
    url: "/role/getRolePage",
    data: datas
  });
}
export function savePerms(datas) {
  return http.request({
    method: "post",
    url: "/role/savePerms",
    data: datas
  });
}
export function getPermsByRoleId(datas) {
  return http.request({
    method: "post",
    url: "/role/getPermsByRoleId",
    data: datas
  });
}
export function getAllPerms(datas) {
  return http.request({
    method: "post",
    url: "/role/getAllPerms",
    data: datas
  });
}







