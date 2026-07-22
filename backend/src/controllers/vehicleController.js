const addVehicle = require('../services/addVehicle');
const viewAllVehicles = require('../services/viewAllVehicles');
const searchVehicles = require('../services/searchVehicles');
const updateVehicle = require('../services/updateVehicle');
const deleteVehicle = require('../services/deleteVehicle');
const purchaseVehicle = require('../services/purchaseVehicle');
const restockVehicle = require('../services/restockVehicle');

const vehicleController = {
  // 1. Add a vehicle
  addVehicle: async (req, res) => {
    try {
      const vehicle = await addVehicle(req.body);
      return res.status(201).json(vehicle);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  // 2. Get all vehicles
  getAll: async (req, res) => {
    try {
      const vehicles = await viewAllVehicles();
      return res.status(200).json(vehicles);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  // 3. Search vehicles
  search: async (req, res) => {
    try {
      const results = await searchVehicles(req.query);
      return res.status(200).json(results);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  // 4. Update vehicle details
  update: async (req, res) => {
    try {
      const updated = await updateVehicle(req.params.id, req.body);
      return res.status(200).json(updated);
    } catch (error) {
      const status = error.message.includes('not found') ? 404 : 400;
      return res.status(status).json({ error: error.message });
    }
  },

  // 5. Delete a vehicle
  remove: async (req, res) => {
    try {
      const deleted = await deleteVehicle(req.params.id);
      return res.status(200).json({ message: 'Vehicle deleted successfully', deleted });
    } catch (error) {
      const status = error.message.includes('not found') ? 404 : 400;
      return res.status(status).json({ error: error.message });
    }
  },

  // 6. Purchase a vehicle (decrease stock by 1)
  purchase: async (req, res) => {
    try {
      const updated = await purchaseVehicle(req.params.id);
      return res.status(200).json({ message: 'Purchase successful', vehicle: updated });
    } catch (error) {
      const status = error.message.includes('not found') ? 404 : 400;
      return res.status(status).json({ error: error.message });
    }
  },

  // 7. Restock a vehicle (increase stock quantity)
  restock: async (req, res) => {
    try {
      const { quantity } = req.body;
      const updated = await restockVehicle(req.params.id, quantity);
      return res.status(200).json({ message: 'Restock successful', vehicle: updated });
    } catch (error) {
      const status = error.message.includes('not found') ? 404 : 400;
      return res.status(status).json({ error: error.message });
    }
  }
};

module.exports = vehicleController;
