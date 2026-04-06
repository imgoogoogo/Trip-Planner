const express = require("express");
const router = express.Router();
const placeController = require("../controllers/placeController");
const authMiddleware = require("../middleware/auth");

router.post("/", authMiddleware, placeController.createPlace);

router.get("/:trip_id", placeController.getPlaces);

router.put("/:id", authMiddleware, placeController.updatePlace);

router.delete("/:id", authMiddleware, placeController.deletePlace);

module.exports = router;
