import React, { Component } from 'react';
import { Row, Col,Spin, message} from 'antd';
import {getAddress,createOrder,initiatePay} from '../../api/index';
import {getCookie} from '../../util/Cookie';
import "./OrderPage.css"


class OrderPage extends Component {
  constructor(props){
    super(props)
    this.state={
        loading:false,
        address:null,
        fromInfo:[],
        data:{
          ProductInfo:{},
          addressInfo:null
        },
    }
  }
  componentDidMount(){
    if(getCookie('fromInfoStr')){
      let fromInfoStr= getCookie('fromInfoStr')
      let fromInfo = JSON.parse(fromInfoStr)
      this.setState({fromInfo:fromInfo})
    }
    if(this.props.location.state){
          this.setState({
            data:this.props.location.state.data,
          })
          this.getaddress()
     }else if(localStorage.getItem('order')){
        // 从Storage中取订单预计算数据
        let orderString= localStorage.getItem('order')
        let orderData = JSON.parse(orderString)
        this.setState({
          data:orderData
        })
        this.getaddress()
     }else{
        this.props.history.push({pathname: `/ProductDetails`})
     }
  }
  // 付款按钮
  payButton=()=>{
    if(this.state.address!=null){
      this.setState({loading:true})
      let uid=getCookie('uid')
      let data = {
        addressId:this.state.address.id,
        uid:uid,
        discountId:0,
        fromUid:getCookie("InviterId"),
        variants:[
          {
            product_id:this.state.data.ProductInfo.product_id,
            variant_id:this.state.data.ProductInfo.variant_id,
            quantity:this.state.data.ProductInfo.count,
          }
        ]
      }
      createOrder(data).then((res)=>{
        console.log(res)
        if(res.code==0){
          this.initiatePay(res.data.id)
        }else{
          this.setState({loading:false})
        }
      }).catch((error)=>{
        console.log(error)
        this.setState({loading:false})
      })
    }else{
      message.warning("Please add a shipping address!")
    }
  }
  // 发起支付
  initiatePay=(id)=>{
    initiatePay({orderID:id}).then((res)=>{
      console.log(res)
      let that = this
      if(res.code==0){
        this.setState({loading:false})
        window.location.href=res.data.url
        // window.snap.pay(res.data.token,{
        //   onSuccess: function(result){console.log('success');console.log(result);message.success("payment successful!"); that.props.history.push({pathname: `/GoDownloadPage`})},//付款成功回调
        //   onPending: function(result){console.log('pending');console.log(result);message.error("Payment pending callback!")},//付款待处理回拨
        //   onError: function(result){console.log('error');console.log(result);message.error("Payment error callback!")},//付款错误回拨
        //   onClose: function(){console.log('customer closed the popup without finishing the payment');message.error("Exited halfway, payment is not completed!")}//未完成付款的情况下关闭了付款弹出窗口
        // })
      }else{
        this.setState({loading:false})
      }
    }).catch((error)=>{
      console.log(error)
      this.setState({loading:false})
    })
  }

  //获取默认地址
  getaddress=()=>{
    let uid = getCookie('uid')
    getAddress({uid:uid}).then((res)=>{
      console.log(res)
      if (res.code==0&&res.data.list){
        for(let i=0;i<res.data.list.length;i++){
            if(res.data.list[i].isDefault===1){
              this.setState({
                address:res.data.list[i]
              })
            }
        }
      }
    })
  }
  //无收货地址
  NoDeliveryAddress=()=>{
    return(
      <Row className="addDeliveryInfo" onClick={()=>{
        this.props.history.push({pathname: `/addAreaPage`})
      }}>
        <Col span={2}>
           <img src={require("../../images/home_icon_add@2x.png")} alt=""/>
        </Col>
        <Col span={22}>
           <p>Add the delivery address</p>
        </Col>
      </Row>
    )
  }
  // 有收货地址
  ShippingAddress=()=>{
    return(
      <Row className="addDeliveryInfo" onClick={()=>{
        this.props.history.push({pathname: `/addAreaPage`, state: {data:this.state.data}})
      }}>
        <Col span={2}>
           <img src={require("../../images/home_icon_address@2x.png")} alt=""/>
        </Col>
        <Col span={22}>
           <p>{this.state.address.name}  {this.state.address.mobile}</p>
           <p style={{lineHeight:1.5}}>{this.state.address.area} {this.state.address.address}</p>
        </Col>
      </Row>
    )
  }

  render() {
    return (
      <Spin spinning={this.state.loading} tip="Loading...">
      <div className="OrderPage">
         <div className="Inviter">
            <p className="InviterName">Inviter: {this.state.fromInfo.nickName==null?"xxxxxxxx":this.state.fromInfo.nickName} </p>
            <p className="InviterID">ID: {this.state.fromInfo.id==null?"xxxxxxxxxxxx":this.state.fromInfo.id}</p>
         </div>
         <div className="DeliveryInfo">
           <p className="DeliveryInfo_title">Maklumat penghantaran</p>
           {
             this.state.address==null?this.NoDeliveryAddress():this.ShippingAddress()
           }
         </div>
         <div className="ProductInfo">
            <Row>
              <Col span={9}>
                <img src={this.state.data.ProductInfo.image} alt=""/>
              </Col>
              <Col span={15}>
                <p className="ProductInfo_text"><span>{this.state.data.ProductInfo.title}</span> {this.state.data.title}</p>
                <p className="ProductInfo_price">Rp {this.state.data.ProductInfo.price} x{this.state.data.ProductInfo.count}</p>
                <Row className="ProductInfo_CashBack">
                  <Col span={10}>
                    <p>Offer <span className="span_CashBack">{this.state.data.coupon_offer_amount!=null?"Rp":null} {this.state.data.coupon_offer_amount}</span></p>
                  </Col>
                  <Col span={14}><p>Total <span className="span_price">Rp {this.state.data.close_amount}</span></p></Col>
                </Row>
              </Col>
            </Row>
         </div>
         <div className="payButton" onClick={this.payButton}>
              <p>Bayar sekarang</p>
         </div>
      </div>
      </Spin>
    );
  }
}

export default OrderPage;
