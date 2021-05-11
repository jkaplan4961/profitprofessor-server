const router = require('express').Router();
const validateSession = require("../middleware/validate-session");
const Vendor = require('../db').import('../models/vendor');


router.get('/', function(req,res){
    Vendor.findAll()
        .then((allVendors) => res.status(200).json(allVendors))
        .catch((err) => res.status(500).json({error:err}))
})

router.get('/:id', function(req,res){
    let id=req.params.id
    Vendor.findOne({where:{id: id}})
        .then((vendor) => res.status(200).json(vendor))
        .catch((err) => res.status(500).json({error:err}))
})

router.get('/company/:company', function(req,res){
    let company=req.params.company
    Vendor.findOne({company: company})
        .then((company) => res.status(200).json(company))
        .catch((err) => res.status(500).json({error:err}))
})

//CREATE A Vendor - vendor/create
router.post('/create',validateSession, function (req, res) {
    const vendorDetails = {
        company:req.body.company,
        address:req.body.address,
        city:req.body.city,
        state:req.body.state,
        zip:req.body.zip,
        phone:req.body.phone,
    }
    Vendor.create(vendorDetails)
    .then(vendorDetails => res.status(200).json(vendorDetails))   
    .catch(err => res.status(500).json({error:err}))
});

router.put('/:id',validateSession, function(req,res){
    const id = req.params.id

    Vendor.update({company:req.body.company,
        address:req.body.address,
        city:req.body.city,
        state:req.body.state,
        zip:req.body.zip,
        phone:req.body.phone},{where: {id: id}}).then(count => console.log("Rows updated: " + count))

})

router.delete('/:id', async function(req,res){
    let id=req.params.id
    await Vendor.destroy({where: {id: id}})
        .then((vendor) => res.status(200).json(vendor))
        .catch((err) => res.status(500).json({error:err}))
})

module.exports = router;