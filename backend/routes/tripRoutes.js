const express = require("express");
const router = express.Router();
const tripController = require("../controllers/tripController");
const authMiddleware = require("../middleware/auth");

router.post("/", authMiddleware, tripController.createTrip);
router.get("/", tripController.getTrips);
router.get("/popular", tripController.getPopularTrips);
router.get("/my", authMiddleware, tripController.getMyTrips);
router.get("/:id", tripController.getTripById);
router.patch("/:id/like", authMiddleware, tripController.toggleLike);
router.patch("/:id/visibility", authMiddleware, tripController.toggleVisibility);
router.put("/:id", authMiddleware, tripController.updateTrip);
router.delete("/:id", authMiddleware, tripController.deleteTrip);

module.exports = router;
