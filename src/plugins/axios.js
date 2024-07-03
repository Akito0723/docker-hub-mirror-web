import Vue from 'vue'
import axios from "axios"

//请求超时的时间设定
axios.defaults.timeout = 60 * 1000
axios.interceptors.request.use(function (config) {
    config.metadata = { startTime: new Date()}
    return config;
}, function (error) {
    return Promise.reject(error);
});

axios.interceptors.response.use(function (response) {
    response.config.metadata.endTime = new Date()
    response.duration = response.config.metadata.endTime - response.config.metadata.startTime
    return response;
}, function (error) {
    error.config.metadata.endTime = new Date();
    error.duration = error.config.metadata.endTime - error.config.metadata.startTime;
    return Promise.reject(error);
});


Vue.prototype.$axios = axios