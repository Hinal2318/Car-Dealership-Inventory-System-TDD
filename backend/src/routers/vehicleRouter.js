const express = require('express');
const vehicleController = require('../controllers/vehicleController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

const router = express.Router();

router.post('/', authMiddleware, vehicleController.addVehicle);
router.get('/', authMiddleware, vehicleController.getAll);
router.get('/search', authMiddleware, vehicleController.search);
router.put('/:id', authMiddleware, vehicleController.update);
router.delete('/:id', authMiddleware, adminMiddleware, vehicleController.remove);
router.post('/:id/purchase', authMiddleware, vehicleController.purchase);
router.post('/:id/restock', authMiddleware, adminMiddleware, vehicleController.restock);

module.exports = router;
