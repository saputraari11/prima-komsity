const PocketBase = require('pocketbase/cjs')
const pb = new PocketBase("https://prima-komsity-pb.fly.dev")
const fetch = require("cross-fetch")

const registerFunc = async (req, res) => {
    const { email, password, confirm, phone } = req.body

    if (password != confirm) {
        res.send('<script>alert("Password Invalid!"); window.location.href = "register"; </script>');
    }

    try {
        await pb.collection("users").create({
            email: email,
            password: password,
            passwordConfirm: confirm,
            phoneNumber: phone
        })

        try {
            await pb.collection("users").requestVerification(email);
            res.send('<script>alert("Check your email for the login link!"); window.location.href = "login"; </script>');
        } catch (error) {
            res.send('<script>alert("Confirm email Invalid!"); window.location.href = "register"; </script>');
        }

        return res.redirect("login")
    } catch (error) {
        if (error.data) {
            if (Object.keys(error.data.data).length > 0) {
                const keys = Object.keys(Object.values(error.data)[2])
                res.send(`<script>alert("register Invalid! => ${error.data.data[keys[0]].message}"); window.location.href = "register"; </script>`);
            }
        }
    }
}

const loginFunc = async (req, res) => {
    try {
        const { email, password } = req.body
        const authData = await pb.collection('users').authWithPassword(
            email,
            password,
        );

        if (!authData.record.verified) {
            return res.send('<script>alert("Check your email for the login link!"); window.location.href = "login"; </script>');
        }

        req.session.isAuth = pb.authStore.isValid
        req.session.user = authData
        res.redirect("home")

    } catch (error) {
        if (error.data) {
            if (error.data.message.length == 23) {
                res.send(`<script>alert("${error.data.message} username or password wrong!"); window.location.href = "login"; </script>`);
            }

            if (Object.keys(error.data.data).length > 0) {
                const keys = Object.keys(Object.values(error.data)[2])
                res.send(`<script>alert("Login Invalid! : ${keys[0]} = ${error.data.data[keys[0]].message}"); window.location.href = "login"; </script>`);
            }
        }
    }
}

const logoutFunc = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.redirect('/dashboard')
        }
    })
    // res.clearCookie('connect.sid')
    res.redirect('/login')
}

const atmFunc = async () => {
    const resultList = await pb.collection('somewhere').getFullList({
        filter:'type = "atm"'
    });

    return resultList
}

const worshipFunc = async () => {
    const resultList = await pb.collection('somewhere').getFullList({
        filter:'type = "worship"'
    });

    return resultList
}

const boardingAllFunc = async () => {
    const resultList = await pb.collection('boarding').getFullList();
    return resultList
}

const boardingGetOne = async (id) => {
    const resultList = await pb.collection('boarding').getFirstListItem(`id="${id}"`);
    return resultList
}

const middleWareContent = (req, res, next) => {
    if (!req.session.isAuth) {
        return res.redirect("login")
    }

    next()
}

module.exports = {
    registerFunc,
    loginFunc,
    logoutFunc,
    middleWareContent,
    atmFunc,
    worshipFunc,
    boardingAllFunc,
    boardingGetOne
}