import React, { Component } from 'react';
import { Row, Col,Spin,message } from 'antd';
import {setCookie, getCookie} from '../../util/Cookie'
import "./InvitePage.css"
import Product from "../../components/Product/Product"
import {getProducts,getUserInfo} from "../../api/index"
import {PublicKey} from '../../util/encryption'
import {Invite} from '../../Language/id'

if(getCookie("publicKey")==null||getCookie("publicKey")==''){
  const publicKey = PublicKey()
  setCookie("publicKey",publicKey,1)
}

const height = document.documentElement.clientHeight
const fromImg = require("../../images/member_img_avatar@2x.png")
class InvitePage extends Component {
  constructor(props){
    super(props);
    this.state={
      fromInfo:[],
      data:[
        {
          id:1,
          imgUrl:'',
          name:'',
          desc:'',
          price:'',
          vipPrice:'',
          productStatus:1,
        },
      ],
      InviterId:'',
      loading:true,
      userType:0,
    }
    if(getCookie("type")){
      this.state.userType=Number(getCookie("type"))
    }
  }
  componentDidMount(){
    window.scrollTo(0,0)
    this.getProductList()
    const url = window.location.href
    let InviterIdArray = url.match(/[^a-zA-Z0-9]InviterId{1,9}=([0-9\-]+)/)
    if(InviterIdArray){
      this.getInviterId(InviterIdArray)
    }
  }
  //获取url上携带的邀请人id
  getInviterId=(InviterIdArray)=>{
    if(InviterIdArray.length>1){
      let InviterId = InviterIdArray[1]
      setCookie('InviterId',InviterId,1)
      this.setState({InviterId:InviterId})
      // 获取邀请人信息
      this.getUserInfo(InviterId)
    }
  }
  // 获取邀请人信息
  getUserInfo=(InviterId)=>{
    let data={
      uid:parseInt(InviterId)
    }
    getUserInfo(data).then((res)=>{
      console.log(res)
      if(res.code==0){
        this.setState({fromInfo:res.data.data})
        let fromInfoStr = JSON.stringify(res.data.data)
        setCookie("fromInfoStr",fromInfoStr,1)
      }
    }).catch((error)=>{
      console.log(error)
    })
  }
  
  // 获取礼包列表
  getProductList=()=>{
    getProducts().then((res)=>{
      console.log(res)
      if(res.code==0){
        let data
        if(res.data.products.length>6){
         data = res.data.products.slice(0,6)
        }else{
          data = res.data.products
        }
        data.map((item)=>{
          if(item.title.length>30){
            item.title=item.title.substring(0,27)+"..."
          }
        })
        this.setState({
          data:data,
          loading:false
        })
      }else{
        message.warning(res.msg)
        this.setState({
          loading:false
        })
      }
    }).catch((error)=>{
      console.log(error)
      this.setState({
        loading:false
      })
    })
  }
  OneClickOpening=()=>{
    if(this.state.userType>0){
      window.postMessage("Share")
    }else{
      const GiftPackages_height = document.getElementById("GiftPackages").offsetTop;
      document.getElementsByClassName("InvitePage")[0].scrollTop=GiftPackages_height
    }
  }
  // 跳转至商品详情页
  gotoProductDetails=(id)=>{
    if(this.state.userType>0){
      message.warning(Invite.You_are_already_a_member_of_our_Hame)
    }else{
      this.props.history.push({pathname: `/ProductDetails`, state: {id:id}})
    }
  }
  render() {
    return (
      <Spin spinning={this.state.loading} tip="Loading...">
        <div className="InvitePage" style={{height:height}} id="abc">
          <div className="InviteHeader">
                {/*头部提示信息*/}
                <div className="InviteText">
                    <Row>
                        <Col span={4}><img src={fromImg} alt=""/></Col>
                        <Col span={20}><p>{this.state.fromInfo.nickName==null?"xxxxxxxx":this.state.fromInfo.nickName} mengajak Anda untuk menjadi member Hamee</p></Col>
                    </Row>
                </div>
                {/* 头部文字 */}
                <div className='Invite_title'>
                    <p>{Invite.SPEND_LESS}</p>
                    <p className="fontBig">{Invite.MONEY}</p>
                    <p>{Invite.BUY_BETTER}</p>
                    <p className="fontBig">{Invite.GOODS}</p>
                    <p className="year">——— 2019 ———</p>
                </div>
          </div>
          {/* 会员福利 */}
          <div className="VipWelfare">
              <p>{Invite.Member_Benefits}</p>
          </div>
          <div className="VipWelfare_info">
              <Row>
                  <Col span={8}>
                      <div className="Left">
                        <p>{Invite.off_shopping_full_of_goods}</p>
                      </div>
                  </Col>
                  <Col span={15} style={{marginLeft:10}}>
                    <div className="Top">
                      <p>{Invite.Member_spree_shopping_coupon_300K}</p>
                    </div>
                    <div className="Center">
                      <p>{Invite.B_A_M_O_V_E_H_O_S_W_S}</p>
                    </div>
                    <div className="Bottom">
                      <p>{Invite.O_V_G_C_S_O_A_S_S_W}</p>
                    </div>
                  </Col>
              </Row>
            </div>
            {/* 购物礼包 */}
            <div className="GiftPackages" id="GiftPackages">
              <p>{Invite.Gift_Packages}</p>
          </div>
          <div className="giftList">
              <div className="list">
                {
                  this.state.data.map((item,index)=>{
                    return <Product key={index} goto={this.gotoProductDetails} product={item} borderStatus={false}/>
                  })
                }
              </div>
              <p className="viewMore" onClick={()=>{
                if(this.state.userType>0){
                  message.warning(Invite.You_are_already_a_member_of_our_Hame)
                }else{
                  this.props.history.push('/ProductList')
                }
              }}>{Invite.View_More}</p>
          </div>
          <div className="viewMoreImg">
            <img src={require("../../images/member_bg_sliding down@2x.png")} alt=""/>
          </div>
          {/* 优惠说明 */}
          <div className="qualityshopping_title">
                <p>{Invite.Save_money_by_purchasing_quality_shopping}</p>
          </div>
          <div className="qualityshopping">
                <ul className="ul_out">
                  <li>
                    {Invite.Invite_Commission}
                    <ul className="ul_top">
                      <li>{Invite.D_L_O_M_U_I_F_T_B_M_A_G_C_T_H_T_L_T_H_T_C}</li>
                      <li>{Invite.sales_of_goods_get_rebates}</li>
                    </ul>
                  </li>
                  <li>
                    {Invite.share_it}
                      <ul className="ul_bottom">
                        <li>{Invite.Member_shopping_membership_price}</li>
                        {/* <li></li> */}
                      </ul>
                  </li>
                </ul>
          </div>
          {/* 关于 */}
          <div className="About_title">
            <p>{Invite.About_Hamme}</p>
          </div>
          <div className="About">
            <p>{Invite.HWBIETBTAYAEPWSTULSRTMSPSTMSTPOTESOTOTSAPTDOIS}</p>
          </div>
          <div className="openingButton" onClick={this.OneClickOpening}>
                <p>{this.state.userType>0?Invite.One_click_sharing:Invite.One_Click_Opening}</p>
          </div>
        </div>
      </Spin>
    );
  }
}

export default InvitePage;