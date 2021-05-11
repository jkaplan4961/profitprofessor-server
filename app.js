require("dotenv").config();
const express = require("express")
const app = express();
const cors = require("cors");
const sequelize =require("./db")

let user = require('./controller/usercontroller');
let marketplace = require('./controller/marketplacecontroller');
let product = require('./controller/productcontroller');
let vendor = require('./controller/vendorcontroller');
app.use(require('./middleware/headers'));

sequelize.sync();
// sequelize.sync({force: true});

app.use(express.json());
app.use(cors());

app.use('/user', user)
app.use('/marketplace', marketplace)
app.use('/product', product)
app.use('/vendor', vendor)

app.get('/ebay-auth', async (req, res) => {
    const axios = require('axios')
    axios({
        method: 'POST',
        url: 'https://api.ebay.com/identity/v1/oauth2/token',
        data: {
            "grant_type":"refresh_token"
        },
        headers: {
            "Authorization": "Basic " + Buffer.from(process.env.EBAY_ID+":"+process.env.EBAY_SECRET).toString('base64'),
            'Content-Type':"application/json",
        }
      }).then(data => data.data).then(token => res.status(200).json(token)).catch(err=>{})
})

app.listen(process.env.PORT, () => {
    console.log(`server is listening on port ${process.env.PORT}`)
})
// const port = process.env.PORT || 3001

// db.authenticate()
//     .then(() => db.sync())
//     .then(() => 
//         app.listen(port, () => {
//             console.log(`server is listening on port ${port}`)
//         })
//     )


// module.exports = {
//     marketplace,
//     product,
//     user,
//     vendor,
// }