const api = require("./baseApi")
const router = require("express").Router()

router.get("/", (req, res) => {
    res.render('welcome')
});

router.get("/register", (req, res) => {
    if(req.session.isAuth) {
        return res.redirect("dashboard")
    }

    res.render('register')
});

router.get("/login", (req, res) => {
    if(req.session.isAuth) {
        return res.redirect("dashboard")
    }
    res.render('login')
});

router.post("/login",(req,res) => {
    api.registerFunc(req,res)
})

router.delete("/logout",(req,res) => {
    api.logoutFunc(req,res)
})

router.post("/home",(req,res) => {
    api.loginFunc(req,res)
})

// content =================
router.use(api.middleWareContent)

router.get("/home", (req, res) => {
    res.render('home')
});

router.get("/dashboard", (req, res) => {
    
    res.render('dashboard')
});

router.get("/account",(req,res) => [
    res.render('account')
])

router.get("/about", (req, res) => {
    res.render('about')
});

router.get("/atm", async (req, res) => {
    const data = await api.atmFunc()
    let atms = []
    for(let item of data) {
        const atm = {
            urlImg:`https://prima-komsity-pb.fly.dev/api/files/somewhere/${item.id}/${item.images}`,
            urlMaps:item.maps
        }

        atms.push(atm)
    }

    res.render('atm',{atms:atms})
});

router.get("/worship", async(req, res) => {
    const data = await api.worshipFunc()
    let worships = []
    for(let item of data) {
        const worship = {
            name:item.names,
            urlMaps:item.maps
        }

        worships.push(worship)
    }

    res.render('worship',{worships:worships})
});

router.get("/market", (req, res) => {
    res.render('market')
});

router.get("/contact", (req, res) => {
    res.render('contact')
});

router.get("/boarding-house", async(req, res) => {
    const data = await api.boardingAllFunc()
    let boardings = []
    for(let item of data) {
        const boarding = {
            urlDetail:`detail-boarding/${item.id}`,
            name:item.names,
            urlImg:`https://prima-komsity-pb.fly.dev/api/files/boarding/${item.id}/${item.image}`,
            description:item.description
        }

        boardings.push(boarding)
    }

    res.render('boarding-house',{boardings:boardings})
});


router.get("/detail-boarding/:id", async (req, res) => {
    // console.log(req.params.id);
    // const data = await api.boardingGetOne(req.params.id)
    // console.log(data);
    // res.render('detail-boarding',{db:data})
    res.render("detail-boarding")
});

router.get("/fad", (req, res) => {
    res.render('fad')
});

router.get("/food", (req, res) => {
    res.render('food')
});

router.get("/food-detail", (req, res) => {
    res.render('food-detail')
});

router.get("/place", (req, res) => {
    res.render('place')
});

router.get("/service", (req, res) => {
    res.render('service')
});

router.get("/place-detail", (req, res) => {
    res.render('place-detail')
});

module.exports = router