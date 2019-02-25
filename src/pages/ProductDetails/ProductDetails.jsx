import React, { Component } from 'react';
import './ProductDetails.css'
import { Row, Col, Drawer, Radio, message,Button,Spin,Carousel  } from 'antd';
import {getCookie, setCookie} from "../../util/Cookie"
import {getProductDetails,priceCalculation,getUserInfo} from "../../api/index"
import {PublicKey} from "../../util/encryption"

const height = document.documentElement.clientHeight
const RadioGroup = Radio.Group;
const fromImg = require("../../images/member_img_avatar@2x.png")
class ProductDetails extends Component {
    constructor(props){
        super(props);
        this.state={
            loading:true,
            visible:false,
            fromInfo:{},
            image:'',
            images:[],
            variants:[{
                compare_at_price:'',
                price:''
            }],
            data:{},
            DrawerImage:'',
            DrawerPrice:'',
            //请求参数
            count:1,
            selectID:null,
            
        }
        
    }
    componentDidMount(){
        window.scrollTo(0,0)
        let inviterinfo = getCookie('fromInfoStr')
        if(inviterinfo!=null&&inviterinfo!=''){
            let fromInfoStr= getCookie('fromInfoStr')
            let fromInfo = JSON.parse(fromInfoStr)
            this.setState({fromInfo:fromInfo})
        }
        if(this.props.location.state){
            this.getDetails(this.props.location.state.id)
        }else if(getCookie('selectedProductId')!=null){
            this.getDetails(getCookie('selectedProductId'))
        }else{
            const url = window.location.href
            let productIdArr = url.match(/[^a-zA-Z0-9]id{1,2}=([0-9\-]+)/)
            if(productIdArr){
                if(productIdArr.length>1){
                    let productId = productIdArr[1]
                    setCookie('selectedProductId',productId,1)
                    this.getDetails(productId)
                  }else{
                    this.props.history.goBack()
                  }
            }else{
                this.props.history.goBack()
            }
        }
    }
    // 获取商品详情
    getDetails=(id)=>{
        getProductDetails(id).then((res)=>{
            console.log(res)
            if(res.code===0){
                for(let i=0;i<res.data.variants.length;i++){
                    for(let j=0;j<res.data.images.length;j++){
                        if(res.data.variants[i].image_id==res.data.images[j].id){
                            res.data.variants[i].imageUrl=res.data.images[j].src
                        }
                    }
                }
                this.setState({
                    data:res.data,
                    image:res.data.image,
                    variants:res.data.variants,
                    images:res.data.images,
                    loading:false
                })
            }
        })
    }
    gotoProductDetails=(id)=>{
        this.props.history.push({pathname: `/ProductDetails`, state: {id:id}})
    }
    // To pay按钮
    pay=()=>{
        if(this.state.selectID!=null&&this.state.count>0){
            // 判断是否登录
            if(getCookie('uid')!=null){
                // 是，判断是否为会员
                let uid = getCookie('uid')
                let lv = Number(getCookie("type"))
                if(lv>=1){
                    message.warning("Already a member can't buy a gift pack!")
                }else{
                    // 否，跳转到订单详情
                    this.setState({loading:true})
                    this.priceCalculation()
                }
            }else{
                // 否，跳转到登录页
                this.props.history.push('/Login')
            }
        }else{
            message.warning("Please select at least one item!")
        }
    }
    getUserInfo=(uid)=>{
        console.log(uid)
        getUserInfo({uid:uid}).then((res)=>{
            console.log(res)
            if(res.code==0){
                return res.data.level
            }
        })
    }
    // 价格预计算
    priceCalculation(){
        let data={
            uid:getCookie('uid'),
            variants:[
                {
                    product_id:this.state.data.id,
                    variant_id:this.state.selectID,
                    quantity:this.state.count
                }
            ]
        }
        priceCalculation(data).then((res)=>{
            console.log(res)
            let ProductInfo={
                title:this.state.data.title,
                count:this.state.count,
                price:this.state.DrawerPrice,
                image:this.state.DrawerImage,
                product_id:this.state.data.id,
                variant_id:this.state.selectID,
            }
            if(res.code==0){
                res.data.ProductInfo=ProductInfo
                // 订单预计算数据转为字符串存入Storage
                let testjson = JSON.stringify(res.data)
                localStorage.setItem('order', testjson);

                this.setState({loading:false})
                this.props.history.push({pathname: `/OrderPage`, state: {data:res.data}})
            }
        })
    }
    // 开启弹窗
    showDrawer = () => {
        // 判断链接是否携带邀请人id
        let InviterId = getCookie("InviterId")
        if(InviterId==null||InviterId==""){
            message.error("If you have not obtained a referral, please contact the referrer to re-acquire the link!")
        }else{
            this.setState({
                visible: true,
                DrawerImage:this.state.variants[0].imageUrl,
                DrawerPrice:this.state.variants[0].price,
            });
        }
    };
    // 关闭弹窗
    onClose = () => {this.setState({visible: false,});};
    // 选择规格
    selectOnChange=(e)=>{
        this.state.variants.forEach((item)=>{
            if(item.id==e.target.value){
                this.setState({
                    DrawerImage:item.imageUrl,
                    DrawerPrice:item.price,
                })
            }
        })
        this.setState({
            selectID:e.target.value
        })
    }
    // 减
    less=()=>{
        if(this.state.count>1){
            this.setState({
                count:--this.state.count
            })
        }
    }
    // 加
    add=()=>{
        this.setState({
            count:++this.state.count
        })
    }
    onChange=(a, b, c)=>{
        console.log(a, b, c);
      }
  render() {
    return (
        <Spin spinning={this.state.loading} tip="Loading...">
            <div className="ProductDetails" style={{height:height}}>
                <div className="header">
                    <Carousel afterChange={this.onChange}>
                        {
                            this.state.images.map((item,index)=>{
                                return <img src={item.src} alt="" key={index}/>
                            })
                        }
                    </Carousel>
                </div>
                <div className="ProductInfos">
                    <p className="ProductDes">{this.state.data.title}</p>
                    <Row style={{marginTop:5}}>
                        <Col span={12}><span className="ProductPrice">Rp {this.state.variants[0].price}</span></Col>
                        <Col span={12} className="SalesCount">{this.state.data.buy_number} orang telah membeli</Col>
                    </Row>
                </div>
                {
                    this.state.fromInfo.id==null||this.state.fromInfo.id==''?null:(
                        <div className="user">
                            <Row>
                                <Col span={6} className="userImg">
                                    <img src={fromImg} alt=""/> 
                                </Col>
                                <Col span={18} className="suerText">
                                    <p className="user_Name">{this.state.fromInfo.nickName==null?"xxxxxxxx":this.state.fromInfo.nickName}</p>
                                    <p className="userInviteText">Mengajak anda untuk bergabung! </p>
                                </Col>
                            </Row>
                        </div>
                    )
                }
                <div className="Info">
                    <div dangerouslySetInnerHTML={{__html: this.state.data.body_html}}/>
                </div>
                <div className="footer">
                    <div className="pay_Button" onClick={this.showDrawer} >
                        <p>Beli Sekarang</p>
                    </div>
                </div>
                <Drawer placement="bottom" height={450} closable={false} onClose={this.onClose} visible={this.state.visible} className="Drawer">
                    <img className="endImg" src={require("../../images/home_icon_close@2x.png")} onClick={this.onClose} alt=""/>
                    <div className="DrawerBox">
                        <Row>
                            <Col span={8} className="DrawerImg">
                                <img src={this.state.DrawerImage} alt=""/>
                            </Col>
                            <Col span={16} className="DrawerPrice">
                                <p>Rp {this.state.DrawerPrice}</p>
                            </Col>
                        </Row>
                        <p className="SelectTitle">Pilih</p>
                        <RadioGroup name="radiogroup" className="RadioGroup" onChange={this.selectOnChange} defaultValue={1}>
                            {
                                this.state.variants.map((item,index)=>{
                                    return <Radio value={item.id} key={index}>{item.title}</Radio>
                                })
                            }
                        </RadioGroup>
                        <p className="SelectTitle">Jumlah</p>
                        <Row className="numberSelect">
                            <Col span={2}><Button shape="circle" icon="minus" size="small" disabled onClick={this.less}/></Col>
                            <Col span={6} className="DrawerNumber"><p>{this.state.count}</p></Col>
                            <Col span={2}><Button shape="circle" icon="plus" size="small" disabled onClick={this.add}/></Col>
                            <Col span={14}></Col>
                        </Row>
                    </div>
                    <div className="define_Button" onClick={this.pay}>
                        <p>Beli</p>
                    </div>
                </Drawer>
            </div>
        </Spin>
    );
  }
}


export default ProductDetails;
