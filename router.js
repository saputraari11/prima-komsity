const api = require("./baseApi")
const router = require("express").Router()
const utils = require('./utils')

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

router.get("/market", async(req, res) => {
    const data = await api.marketFunc()
    let markets = []
    for(let item of data) {
        const market = {
            ...item,images:`https://prima-komsity-pb.fly.dev/api/files/market/${item.id}/${item.images}`
        }

        markets.push(market)
    }
    res.render('market',{markets:markets})
});

router.get("/contact", (req, res) => {
    res.render('contact')
});

router.get("/boarding-house", async(req, res) => {
    const data = await api.boardingAllFunc()
    let boardings = []
    for(let item of data) {
        const boarding = {
            id:item.id,
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
        let data = await api.boardingGetOne(req.params.id)
        data = {...data,image:`https://prima-komsity-pb.fly.dev/api/files/boarding/${data.id}/${data.image}`}
        res.render('detail-boarding',{boarding:data})
});

router.get("/fad", async (req, res) => {
    const dataOrigin = await api.fadAll()
    const dataRating = await api.fadRatingFunc()
    const randomRating = utils.generateRandom(dataRating.length,10)
    const randomFood = utils.generateRandom(dataOrigin.length,10)

    res.render('fad',{
        ratings:dataRating,
        data:dataOrigin,
        randomRates:randomRating,
        randomFood:randomFood,
        url:`https://prima-komsity-pb.fly.dev/api/files/item_fads/`,
    })
});

router.get("/food", (req, res) => {
    res.render('food')
});

router.get("/food-detail/:id", (req, res) => {
    res.render('food-detail')
});

router.get("/place", async (req, res) => {
    const data = await api.telyuFunc()
    let places = []
    for(let item of data) {
        const place = {
            id:item.id,
            urlDetail:`place-detail/${item.id}`,
            name:item.names,
            nickname:item.nickname,
            description:item.description
        }

        places.push(place)
    }

    res.render('place',{places:places})
});

router.get("/place-detail/:id", async (req, res) => {
        let data = await api.telyuGetOne(req.params.id)
        res.render('place-detail',{place:data,url:`https://prima-komsity-pb.fly.dev/api/files/telyu/${data.id}/`})
});

router.get("/service", (req, res) => {
    res.render('service')
});

module.exports = router