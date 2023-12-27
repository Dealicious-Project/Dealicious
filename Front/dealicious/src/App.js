import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Main from './component/Main';
import './index.css';
import { persistStore } from 'redux-persist';

import AdminMy from './component/AdminMy';
import AdminMyModi from './component/AdminMyModi';
import AdminMain from './component/AdminMain';
import AdminSettle from './component/AdminSettle';
import AdminSettleList from './component/AdminSettleList';
import NotiActivity from './component/NotiActivity';
import NotiKeyword from './component/NotiKeyword';
import Keyword from './component/Keyword';
import Search from './component/Search';
import Login from './component/Login';
import Join from './component/Join';
import Join2 from './component/Join2';
import Join3 from './component/Join3';
import Join4 from './component/Join4';
import Profiledetail from './component/Profiledetail';
import Mypage from './component/Mypage';
import Profilemodify from './component/Profilemodify';
import Changepassword from './component/Changepassword';
import Mypage_zzim from './component/Mypage_zzim';
import Mypage_review from './component/Mypage_review';
import Gpay_finish from './component/Gpay_finish';

import ChatList from './component/ChatList';
import SaleList from './component/SaleList';
import SaleWrite from './component/SaleWrite';
import SaleDetail from './component/SaleDetail';
import SaleModify from './component/SaleModify';

import Gpay from './component/Gpay';
import AdminTop from './component/AdminTop';
import AdminBottom from './component/AdminBottom';
import DEALTop from './component/DEALTop';
import DEALBottom from './component/DEALBottom';
import AdminLogin from './component/AdminLogin';
import AdminJoin from './component/AdminJoin';
import { Provider } from 'react-redux';
import store from './persist-store';
import { PersistGate } from 'redux-persist/integration/react';
import User from './component/User';
import Oauth from './component/Oauth';
import Logout from './component/Logout';
import Oauth2 from './component/Oauth2';
import StompChatting from './component/StompChatting';
import MypageNl from './component/MypageNl';
import { WebSocketProvider } from './component/WebSocketProvider';
import About from './component/About';

export const persistor = persistStore(store);
function App() {
    // 현재 경로에 "/admin"이 포함되어 있는지 확인
    const isAdminRoute = window.location.pathname.includes('admin');
    const isLoginJoinRoute = window.location.pathname.includes('login') || window.location.pathname.includes('join') || window.location.pathname.includes('/oauth');

    // useEffect(() => {
    //     window.onbeforeunload = () => {
    //       persistor.purge();
    //     };
    //   }, []);

    return (
        <div className='App'>

            <Provider store={store}>

                <PersistGate loading={null} persistor={persistor}>

                    <BrowserRouter>
                        <WebSocketProvider>
                            {isLoginJoinRoute ? '' : isAdminRoute ? <AdminTop /> : <DEALTop />}
                            <Routes>
                                <Route exect path="/" element={<Main />} /> {/**/}
                                <Route exect path="/about" element={<About/>} />

                                <Route exect path="/adminmy" element={<AdminMy />} /> {/**/}
                                <Route exect path="/adminmymodi" element={<AdminMyModi />} />
                                <Route exect path="/adminmain" element={<AdminMain />} /> {/**/}
                                <Route exect path="/adminsettle" element={<AdminSettle />} /> {/**/}
                                <Route exect path="/adminsettlelist" element={<AdminSettleList />} /> {/**/}
                                <Route exect path="/adminlogin" element={<AdminLogin />} /> {/**/}
                                <Route exect path="/adminjoin" element={<AdminJoin />} /> {/**/}


                                <Route exect path="/notiactivity" element={<NotiActivity />} /> {/**/}
                                <Route exect path="/notikeyword" element={<NotiKeyword />} /> {/**/}
                                <Route exect path="/keyword" element={<Keyword />} /> {/**/}
                                <Route exect path="/search" element={<Search />} /> {/**/}

                                <Route exect path="/login" element={<Login />} /> {/**/}
                                <Route exect path="/join" element={<Join />} /> {/**/}
                                <Route exect path="/join2" element={<Join2 />} /> {/**/}
                                <Route exect path="/join3" element={<Join3 />} /> {/**/}
                                <Route exect path="/join4" element={<Join4 />} /> {/**/}
                                <Route exect path="/mypage" element={<Mypage />} /> {/**/}
                                <Route exect path="/mypagenl" element={<MypageNl />} /> {/**/}
                                <Route exect path="/myzzim" element={<Mypage_zzim />} /> {/**/}
                                <Route exect path="/myreview" element={<Mypage_review />} /> {/**/}
                                <Route exect path="/profiledetail" element={<Profiledetail />} /> {/**/}
                                <Route exect path="/profilemodify" element={<Profilemodify />} /> {/**/}
                                <Route exect path="/changepassword" element={<Changepassword />} /> {/**/}
                                <Route exect path="/gpay_finish/:num" element={<Gpay_finish />} /> {/**/}
                                <Route exect path="/gpay/:num" element={<Gpay />} /> {/**/}


                           
                            <Route path="/chatlist" element={<ChatList />}></Route>
                            <Route path="/salelist" element={<SaleList />}></Route> {/**/}
                            <Route path="/salelist/:category" element={<SaleList />}></Route> {/**/}
                            <Route path="/salelist/:category/:keyword" element={<SaleList />}></Route> {/**/}
                            <Route path="/salewrite" element={<SaleWrite />}></Route> {/**/}
                            <Route path="/saledetail/:sect/:num" element={<SaleDetail />}></Route> {/**/}
                            <Route path="/salemodify/:num" element={<SaleModify />}></Route> {/**/}



                                <Route exect path="/oauth/redirect/:token" element={<Oauth />} />
                                <Route exect path="/oauth2/redirect/:token" element={<Oauth2 />} />
                                <Route path="/user" element={<User />}></Route> {/**/}
                                <Route path="/logout" element={<Logout />}></Route> {/**/}
                                <Route exect path="/chat/:channelId" element={<StompChatting />} />
                            </Routes>
                            {isLoginJoinRoute ? '' : isAdminRoute ? <AdminBottom /> : <DEALBottom />}
                        </WebSocketProvider>
                    </BrowserRouter>

                </PersistGate>
            </Provider>



        </div >
    );
}


export default App;

