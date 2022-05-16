const signInBtn = document.getElementById("signIn");
const signUpBtn = document.getElementById("signUp");
const firstForm = document.getElementById("form1");
const secondForm = document.getElementById("form2");
const container = document.querySelector(".container");

signInBtn.addEventListener("click", () => {
    container.classList.remove("right-panel-active");
});

signUpBtn.addEventListener("click", () => {
    container.classList.add("right-panel-active");
});

firstForm.addEventListener("submit", (e) => e.preventDefault());
secondForm.addEventListener("submit", (e) => e.preventDefault());

/*
注册
 */
$(function() {
    $("#reg-submit").on('click', function(event) {
        $.ajax({
            url:"http://127.0.0.1:5000/register",
            type:"post",
            dataType:"json",
            data: {
                username: $("#reg-username").val(),
                password: $("#reg-password").val(),
                email: $("#reg-email").val()
            },
            success: function(res) {
                console.log(res);
                if(res["code"] === 200) {
                    alert("注册成功");
                } else if(res["code"] === 401) {
                    alert("用户名已存在，请重新注册");
                } else {
                    alert("邮箱已存在，请重新注册");
                }
            }
        })
    })
})

/*
登录
 */
$(function() {
    $("#log-submit").on('click', function(event) {
        let username = $("#log-username").val();
        let password = $("#log-password").val();
        $.ajax({
            url:"http://127.0.0.1:5000/login",
            type:"post",
            dataType:"json",
            data: {
                username: username,
                password: password,
            },
            success: function(res) {
                if(res["code"] === 200) {
                    alert("登录成功");
                    window.localStorage.setItem("token", res["token"]);
                    window.location.assign("http://localhost:8080/share.html");
                } else {
                    alert("密码或用户名错误，请重新登录");
                }
            }
        })
    })
})
