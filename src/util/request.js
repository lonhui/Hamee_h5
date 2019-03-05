import axios from 'axios'
import { message } from 'antd';
import {encryption} from './encryption'

// 创建axios实例
const service = axios.create({
  baseURL: 'https://api.hamee.id', // http://staging.yogrt.co:801
  timeout: 15000 // 请求超时时间
})

axios.defaults.withCredentials = true

let configUrl=null

// request拦截器
service.interceptors.request.use(config => {
  configUrl = config.url
  console.log(configUrl)
  if(config.url!="/user/getKey"){
    config.headers['decry-content'] = encryption()
  }
  return config
}, error => {
  console.error(error) 
})

// respone拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    if(res.code){
        if (res.code === 1002) {
            message.error('res.code = 1002');
            console.log(res)
        }else if(res.code === 502){
            message.error(res.msg);
        }else if(res.code === 503){
            message.error(res.msg);
        }else if(res.code === 504){
            message.error(res.msg);
        }else if(res.code == 500){
          if(configUrl!="/user/info"){
            message.error(res.msg);
          }
        }
    }
    return response.data
  },
  error => {
    message.error(error.message)
    console.log(error)
  }
)

export default service
