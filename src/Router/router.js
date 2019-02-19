import Loadable from 'react-loadable';
// 邀请购买礼包流程页面

// import InvitePage from '../pages/Invite/InvitePage';
// import Login from '../pages/Login/Login';
// import SignUp from '../pages/SignUp/SignUpPage';
import OrderPage from '../pages/Order/OrderPage';
// import addAreaPage from '../pages/addArea/addAreaPage';
import ProductList from '../pages/ProductList/ProductList';
// import GoDownloadPage from '../pages/GoDownload/GoDownloadPage';
import ProductDetails from '../pages/ProductDetails/ProductDetails';
//条约页面
// import UserAgreement from '../pages/UserAgreement/UserAgreement';
//提现分享
// import WithdrawShare from '../pages/WithdrawShare/WithdrawShare';
//商学院页面
// import NewcomerStrategy from '../pages/HameeBusinessSchool/NewcomerStrategy';
// import CommunicationSkills from '../pages/HameeBusinessSchool/CommunicationSkills';
// import FindCustomer from '../pages/HameeBusinessSchool/FindCustomer';
// import HairCircleTechnique from '../pages/HameeBusinessSchool/HairCircleTechnique';
// import PowderAbsorption from '../pages/HameeBusinessSchool/PowderAbsorption';
// import NewcomerSpecialTraining from '../pages/HameeBusinessSchool/NewcomerSpecialTraining';
//发送给客服的商品详情
// import Details from '../pages/Detail/Details'

const loadable = (filename) => Loadable({
    loader:() => import("../pages"+filename),
    loading:() => ('')
});


//路由配置对象
const routers = [
    // 邀请购买礼包流程页面
    {
        path:'/',
        exact:true,
        component:loadable("/Invite/InvitePage")
    },
    {
        path:'/Login',
        component:loadable("/Login/Login")
    },
    {
        path:'/SignUp',
        component:loadable("/SignUp/SignUpPage")
    },
    {
        path:'/OrderPage',
        component:OrderPage
        // loadable("/Order/OrderPage")
    },
    {
        path:'/addAreaPage',
        component:loadable("/addArea/addAreaPage")
    },
    {
        // loadable("/ProductList/ProductList")
        path:'/ProductList',
        component:ProductList
    },
    {
        path:'/ProductDetails',
        component:ProductDetails
        // loadable("/ProductDetails/ProductDetails")
    },
    {
        path:'/GoDownloadPage',
        component:loadable("/GoDownload/GoDownloadPage")
    },
    //条约页面
    {
        path:'/UserAgreement',
        component:loadable("/UserAgreement/UserAgreement")
    },
    //退款协议
    {
        path:'/ReturnAgreement',
        component:loadable("/UserAgreement/ReturnAgreement")
    },
    //提现完成分享页面*
    {
        path:'/WithdrawShare',
        component:loadable("/WithdrawShare/WithdrawShare")
    },
    //商学院页面
    {
        // Hamee新人攻略
        path:'/NewcomerStrategy',
        component:loadable("/HameeBusinessSchool/NewcomerStrategy")
    },
    {
        // 一对一沟通技巧
        path:'/CommunicationSkills',
        component:loadable("/HameeBusinessSchool/CommunicationSkills")
    },
    {
        // 新手小白如何寻找第一批客户
        path:'/FindCustomer',
        component:loadable("/HameeBusinessSchool/FindCustomer")
    },
    {
        // 发圈技巧
        path:'/HairCircleTechnique',
        component:loadable("/HameeBusinessSchool/HairCircleTechnique")
    },
    {
        // 地推吸粉三部曲
        path:'/PowderAbsorption',
        component:loadable("/HameeBusinessSchool/PowderAbsorption")
    },
    {
        // 如何开展新人特训
        path:'/NewcomerSpecialTraining',
        component:loadable("/HameeBusinessSchool/NewcomerSpecialTraining")
    },
    // 发送给客服的商品详情
    {
        path:'/Details',
        component:loadable("/Detail/Details")
    },
];

export {routers}
