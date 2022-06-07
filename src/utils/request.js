import axios from 'axios';
import global from '../global/global';
import Vue from 'vue';
import router from '../router';

axios.defaults.baseURL = global.baseURL;

const http = {
    

    request ({ url, data = {}, method = 'GET', responseType, header = {} }) {
        return new Promise((resolve, reject) => {
            this._request(url, resolve, reject, data, method, responseType, header);
        });
    },
    _request (url, resolve, reject, data = {}, method = 'GET', responseType, header) {
        const format = method.toLocaleLowerCase() == 'get' ? 'params' : 'data';
        if(header['Content-Type'] == '' || header['Content-Type'] == undefined) {
            header['Content-Type'] = 'application/x-www-form-urlencoded';
        }
        if(url != "/sys/login") {
            header["Authorization"] = localStorage.getItem("token")
        }

        axios({
            url: url,
            method: method,
            [format]: data,
            headers: header,
            responseType
        }).then(res => {
            // Vue.prototype.$message.success(res.data.message)
            if(res.data.code == 403) {
                router.push("/login")
                return
            }
            resolve(res.data);
        }).catch(error => {
            Vue.prototype.$message.error("服务异常")
            reject(error);
        })
    }
}

export { http };
