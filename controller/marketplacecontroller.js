const router = require('express').Router();
const validateSession = require("../middleware/validate-session");
const Marketplace = require('../db').import('../models/marketplace');

router.get('/', function(req,res){
    Marketplace.findAll()
        .then((allMarketplaces) => res.status(200).json(allMarketplaces))
        .catch((err) => res.status(500).json({error:err}))
})

router.get('/:id', function(req,res){
    let id=req.params.id
    Marketplace.findOne({where:{id: id}})
        .then((marketplace) => res.status(200).json(marketplace))
        .catch((err) => res.status(500).json({error:err}))
})


// problem here by name
router.get('/name/:name', function(req,res){
    let name=req.params.name
    Marketplace.findOne({name: name})
        .then((marketplace) => res.status(200).json(marketplace))
        .catch((err) => res.status(500).json({error:err}))
})

//CREATE A Marketplace - marketplace/create
router.post('/create', validateSession, function (req, res) {
    const marketplaceDetails = {
        name:req.body.name,
        commission:req.body.commission,
        shipping_price:req.body.shippingprice
    }
    Marketplace.create(marketplaceDetails)
    .then(marketplaceDetails => res.status(200).json(marketplaceDetails))   
    .catch(err => res.status(500).json({error:err}))
});

router.put('/:id',validateSession, function(req,res){
    const id = req.params.id

    Marketplace.update({name: req.body.name,
        commission: req.body.commission,
        image: req.body.image,
        shipping_price: req.body.shipping_price},{where: {id: id}}).then(count => console.log("Rows updated: " + count))

})

router.delete('/:id', async function(req,res){
    let id=req.params.id
    await Marketplace.destroy({where: {id: id}})
        .then((marketplace) => res.status(200).json(marketplace))
        .catch((err) => res.status(500).json({error:err}))
})

module.exports = router;