const router = require('express').Router();
const validateSession = require("../middleware/validate-session");
const Product = require('../db').import('../models/product');
const sequelize = require('../db')


router.get('/',validateSession, function(req,res){
    Product.findAll()
        .then((allProducts) => res.status(200).json(allProducts))
        .catch((err) => res.status(500).json({error:err}))
})

router.get('/:id',function(req,res){
    // const data = await sequelize.query('select p.*, m.commission from products p inner join marketplaces m on m.id = p.marketplaceId where p.id = ?', {replacements: [req.params.id], type: sequelize.QueryTypes.SELECT})
    // res.status(200).json(data)
    Product.findOne({
        where: {
            id: req.params.id
        }
    })
        .then((product) => res.status(200).json(product))
        .catch((err) => res.status(500).json({error:err}))
})

router.post('/filter', validateSession, function(req,res){
    let {userId,vendorId,marketplaceId}=req.body
    const searchFilters = {}
    if(userId) searchFilters.userId = userId
    if(vendorId) searchFilters.vendorId = vendorId
    if(marketplaceId) searchFilters.marketplaceId = marketplaceId
    Product.findAll({
        where: searchFilters
    })
        .then((product) => res.status(200).json(product))
        .catch((err) => res.status(500).json({error:err}))
})

//CREATE A Products - product/create
router.post('/create', function (req, res) {
    const ProductEntry ={
        name:req.body.name,
        description:req.body.description,
        manufacturer:req.body.manufacturer,
        upc:req.body.upc,
        part_num:req.body.part_num,
        packaging:req.body.packaging_cost,
        shipping_cost:req.body.shipping_cost,
        image:req.body.image,
        cost:req.body.cost,
        price:req.body.price,
        userId:req.body.userId,
        vendorId:req.body.vendorId,
        marketplaceId:req.body.marketplaceId

    }
    Product.create(ProductEntry)
    .then(
        function successfulCreation(product) {            
            res.status(200).json({
                product:product,
                message: "Product Created",
            })
        }        
    )
    .catch(err => res.status(500).json({error:err}))
});

router.put('/:id',validateSession, function(req,res){
    const id = req.params.id

    Product.update({name:req.body.name,
        description:req.body.description,
        manufacturer:req.body.manufacturer,
        upc:req.body.upc,
        part_num:req.body.part_num,
        packaging:req.body.packaging_cost,
        shipping_cost:req.body.shipping_cost,
        image:req.body.image,
        cost:req.body.cost,
        price:req.body.price,
        userId:req.body.userId,
        vendorId:req.body.vendorId,
        marketplaceId:req.body.marketplaceId},{where: {id: id}}).then(count => console.log("Rows updated: " + count))

})

router.delete('/:id',validateSession, async function(req,res){
    const id = req.params.id

    await Product.destroy({where: {id: id}})
        .then((product) => res.status(200).json(product))
        .catch((err) => res.status(500).json({error:err}))
})

module.exports = router;