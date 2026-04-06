const express = require("express");
const router = express.Router();
const scheduleController = require("../controllers/scheduleController");
const authMiddleware = require("../middleware/auth");

router.post("/", authMiddleware, scheduleController.createSchedule);

router.get("/trip/:trip_id", scheduleController.getSchedules);

router.put("/:id", authMiddleware, scheduleController.updateSchedule);

router.delete("/trip/:trip_id", authMiddleware, scheduleController.deleteSchedulesByTrip);
router.delete("/:id", authMiddleware, scheduleController.deleteSchedule);

module.exports = router;
