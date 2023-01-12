const router = require('express').Router();
const premController = require('../controllers/premiumFeaturesController')
const authMiddleware = require('../middlewares/auth')


router.get('/showLeaderBoard',authMiddleware.authenticate,premController.getLeadersData)



module.exports = router;
