import axios from "axios";
import {useEffect, useState} from "react";
import AdminMenu from "../admin/AdminMenu";

const AdminInfo = () =>{

    const [id, setId] = useState();
    const [pw, setPw] = useState();
    const [email, setEmail] = useState();
    const [num, setNum] = useState();

    const [pwMsg, setPwMsg] = useState();
    const [psChMsg, setPwChMsg] = useState();
    const [emailMsg, setEmailMsg] = useState();

    const [isPw, setIsPw] = useState(false);
    const [isPwCh, setIsPwCh] = useState(false);
    const [isEmail, setIsEmail] = useState(false);

    const getAdminInfo = () =>{
        axios({
            url:'/api/admin/admininfo',
            method:'GET'
        })
        .then((res)=>{
            console.log(res.data);
            setId(res.data.admin.admin_id);
            setEmail(res.data.admin.admin_email);
            setNum(res.data.admin.admin_num);
        })
        .catch((err)=>{
            console.log(err);
        })
    }

    useEffect(()=>{
        getAdminInfo();
    },[])


    const onChangePw = (e) => {
        const pw = e.target.value;
        setPw(pw);

        const pwRegExp = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,20}$/;

        if(pw === undefined || pw === ' '){
            setPwMsg("비밀번호를 입력해주세요");
        }else{
            if(!pwRegExp.test(pw)){
                setPwMsg("비밀번호는 8~20자 내외의 영어, 특수문자, 숫자 조합으로 입력해주세요.")
            }
            else{
                setPwMsg("사용가능한 비밀번호입니다.");
                setIsPw(true);
            }
        }
    }

    //비밀번호 더블체크
    const onChangePwCh = (e) =>{
        const pwch = e.target.value;
        // setPwCheck(pwch);
        if(isPw === true){
            if(pw === pwch){
                setPwChMsg("비밀번호가 일치합니다.");
                setIsPwCh(true);
            }else{
                setPwChMsg("비밀번호가 일치하지않습니다.");
            }
        }
    }

    // 이메일 체크
    const onChangeEmail = (e) =>{
        setEmail(e.target.value);

        const emailRegEx = /^[A-Za-z0-9]([-_.]?[A-Za-z0-9])*@[A-Za-z0-9]([-_.]?[A-Za-z0-9])*\.[A-Za-z]{2,3}$/;

        if(email === undefined || email === ' '){
            setEmailMsg("이메일을 입력해주세요");
        }else{
            if(!emailRegEx.test(email)){
                setEmailMsg("이메일 형식을 확인해주세요.")
            }
            else{
                setEmailMsg("올바른 이메일입니다.");
                setIsEmail(true);
            }
        }

    }

    const changeInfo = () => {

        if(isPw === true && isPwCh===true && isEmail === true){
            axios({
                url:'/api/admin/admininfo/editinfo',
                method:'POST',
                data:{pw:pw, email:email, id:id, num:num}
            })
            .then((res)=>{
                alert(res.data.msg);
                if(res.data.code==='P'){
                    window.location.replace('/admin/admininfo');
                }
            })
            .catch((err)=>{
                console.log(err);
            })
        }else{
            alert("입력 정보를 다시 확인해주세요.");
            return false;
        }

    }



    return(
        <div id="admininfo">
            <div className="wrap">
                <div className="menu">
                    <AdminMenu 
                        menu={''}
                    />
                </div>
                <div className="admininfo-gap">
                    <div className="admininfo-wrap">
                    <div className="admininfo-title">
                            관리자 정보 수정
                        </div>
                        <div className="admininfo-box">
                            <form id="admininfo-form">
                                <div className="admininfo-id"> 
                                    <div className="id">아이디</div>
                                    <input type="text" defaultValue={id || ''} readOnly ></input>
                                </div>
                                <div className="admininfo-pw"> 
                                    <div className="pw" >비밀번호</div>
                                    <input type="password" value={pw || ''}  placeholder="8~20자 내외의 영어, 특수문자, 숫자" onChange={onChangePw}></input>
                                    {pwMsg}
                                </div>
                                <div className="admininfo-pw-ch"> 
                                    <div className="pw-ch">비밀번호 확인</div>
                                    <input type="password"  placeholder="비밀번호를 한번 더 입력해주세요" onChange={onChangePwCh}></input>
                                    {psChMsg}
                                </div>
                                <div className="admininfo-email">
                                    <div className="email">이메일</div>
                                    <input type="email" value={email || ''} placeholder="xxx@xxxx.com" onChange={onChangeEmail}></input>
                                    {emailMsg}
                                </div>
                                <div className="btn">
                                    {/* <button className="mail-ch-btn" type="button" onClick={changeEmail} disabled={!(isEmail && isPw && isPwCh)}>이메일 수정</button> */}
                                    <button className="ch-btn" type="button" onClick={changeInfo} disabled={!(isEmail && isPw && isPwCh)}>정보 수정</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminInfo;