import React, {useState} from 'react';
import './css/Loginsignup.css'
const LoginSignup = () => {
    const [state, setState] = useState("Увійти")
    const [formdata, setFormdata] = useState({
        username: "",
        password: "",
        email: ""
    })
    const changeHandler = (e) =>{
        setFormdata({...formdata,[e.target.name]: e.target.value});
    }
    const login = async () =>{
        console.log("вхід")
        let response;
        await fetch('http://localhost:4000/login', {
            method: 'POST',
            headers: {
                Accept: 'application/form-data',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formdata)
        }).then((response) => response.json()).then((data) => response = data);
        if(response.success){
            localStorage.setItem('auth-token', response.token);
            window.location.replace("/");
        }
        else{
            alert(response.error);
        }
    }
    const signup = async () =>{
        console.log("реєстрація")
        let response;
        await fetch('http://localhost:4000/signup', {
            method: 'POST',
            headers: {
                Accept: 'application/form-data',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formdata)
        }).then((response) => response.json()).then((data) => response = data);
        if(response.success){
            localStorage.setItem('auth-token', response.token);
            window.location.replace("/");
        }
        else{
            alert(response.error);
        }
    }
    return (
        <div className="loginsignup">
            <div className="loginsignup-container">
                <h1>{state}</h1>
                <div className="loginsignup-fields">
                    {state === "Зареєструватися" ? <input name='username' value={formdata.username} onChange={changeHandler} type="text" placeholder="Ім'я"/>:<></>}
                    <input name='email' value={formdata.email} onChange={changeHandler} type="email" placeholder="email" />
                    <input name = 'password' value={formdata.password} onChange={changeHandler} type="password" placeholder="Пароль" />
                </div>
                <button onClick={() => {state === "Увійти"?login():signup()}}>Продовжити</button>
                {state === "Зареєструватися" ?
                    <p className="loginsignup-login">Вже маєте акаунт? <span onClick={()=>{setState("Увійти")}}>Увійти</span></p> :
                    <p className="loginsignup-login">Створити акаунт?<span onClick={()=>{setState("Зареєструватися")}}>Так</span></p>}
                <div className="loginsignup-agree">
                <input type="checkbox" name=" " id=""/>
                    <p>Продовжуючи, ви погоджуєтеся з нашими Умовами обслуговування та Політикою конфіденційності</p>
                </div>
            </div>
        </div>
    )
}

export default LoginSignup;