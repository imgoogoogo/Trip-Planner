const Schedule = require("../models/scheduleModel");

exports.createSchedule = (req, res) => {
  const schedule = { ...req.body, creator_id: req.user.user_id };

  Schedule.createSchedule(schedule, (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json({
      message: "Schedule created",
      schedule_id: result.insertId,
    });
  });
};

exports.getSchedules = (req, res) => {
  const trip_id = req.params.trip_id;

  Schedule.getSchedulesByTrip(trip_id, (err, results) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json(results);
  });
};

exports.updateSchedule = (req, res) => {
  const schedule_id = req.params.id;
  const schedule = req.body;

  Schedule.updateSchedule(schedule_id, schedule, (err) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json({
      message: "Schedule updated",
    });
  });
};

exports.deleteSchedulesByTrip = (req, res) => {
  const trip_id = req.params.trip_id;
  Schedule.deleteSchedulesByTrip(trip_id, (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Schedules deleted" });
  });
};

exports.deleteSchedule = (req, res) => {
  const schedule_id = req.params.id;

  Schedule.deleteSchedule(schedule_id, (err) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json({
      message: "Schedule deleted",
    });
  });
};
