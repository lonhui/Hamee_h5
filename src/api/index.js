import request from '../util/request.js';
import {getCookie} from '../util/Cookie'

const ED_UUID = getCookie('publicKey') 

// 获取商品列表
const getProducts=(params)=>{
  return request({
    url: '/product/getProductsForVip',
    method: 'get',
    headers:{"ED-UUID":ED_UUID},
    params
  })
}

// 获取商品详情
const getProductDetails=(id)=>{
  return request({
    url: '/product/detail/'+Number(id),
    method: 'get',
  })
}

//新增收货地址
const addArea=(data)=>{
  return request({
    url:'/user/address/add',
    method:'post',
    headers:{"Content-Type":"application/json","ED-UUID":ED_UUID},
    data
  })
} 

//获取用户信息
const getUserInfo=(params)=>{
  return request({
    url:'/user/info',
    method:'get',
    params
  })
}

//获取收货地址
const getAddress=(params)=>{
  return request({
    url:'/user/address/list',
    headers:{
      "ED-UUID":ED_UUID,
      "User-Agent":"origin",
      "NETWORKSTATE":"wifi",
      "User-Platform":"web",
      "Market":"default",
      "Accept-Language":navigator.language,
      "n":"web"
    },
    method:'post',
    params
  })
}
//创建订单
const createOrder=(data)=>{
  return request({
    url:'/order/create',
    method:'post',
    headers:{
      "Content-Type":"application/json",
      "ED-UUID":ED_UUID,
      "User-Agent":"origin",
      "NETWORKSTATE":"wifi",
      "User-Platform":"web",
      "Market":"default",
      "Accept-Language":navigator.language,
      "n":"web"
    },
    data
  })
}
//发起支付
const initiatePay=(data)=>{
  return request({
    url:'/order/pay',
    method:'post',
    headers:{
      "Content-Type":"application/json",
      "ED-UUID":ED_UUID,
      "User-Agent":"origin",
      "NETWORKSTATE":"wifi",
      "User-Platform":"web",
      "Market":"default",
      "Accept-Language":navigator.language,
      "n":"web"
    },
    data
  })
}
//价格预计算
const priceCalculation=(data)=>{
  return request({
    url:'/order/prepare',
    method:'post',
    headers:{"Content-Type":"application/json","ED-UUID":ED_UUID},
    data
  })
}

//获取验证短信
const getSMS=(params)=>{
  return request({
    url:'/sms/send',
    method:'post',
    headers:{"ED-UUID":ED_UUID},
    params
  })
}

//手机注册
const signUp=(data)=>{
  return request({
    url:'/user/register',
    method:'post',
    headers:{"Content-Type":"application/json","ED-UUID":ED_UUID},
    data
  })
} 

// 手机登录
const login=(data)=>{
  return request({
    url:'/user/login',
    method:'post',
    headers:{"Content-Type":"application/json","ED-UUID":ED_UUID},
    data
  })
}

//获取公钥
const getPublicKey=()=>{
  return request({
    url:'/user/getKey',
    method:'post',
    headers:{"Content-Type":"application/x-www-form-urlencoded"},
  })
}

export{
  getProducts,
  login,
  getProductDetails,
  addArea,
  getUserInfo,
  getSMS,
  signUp,
  priceCalculation,
  getAddress,
  createOrder,
  initiatePay,
  getPublicKey
}