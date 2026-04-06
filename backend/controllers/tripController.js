const Trip = require("../models/tripModel");
const jwt = require("jsonwebtoken");

exports.createTrip = (req, res) => {
  const trip = { ...req.body, creator_id: req.user.user_id };

  Trip.createTrip(trip, (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json({
      message: "Trip created",
      trip_id: result.insertId,
    });
  });
};

exports.getTrips = (_req, res) => {
  Trip.getTrips((err, results) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json(results);
  });
};

exports.toggleLike = (req, res) => {
  const { id: trip_id } = req.params;
  const user_id = req.user.user_id;

  Trip.hasLiked(trip_id, user_id, (err, liked) => {
    if (err) return res.status(500).json(err);

    if (liked) {
      Trip.removeLike(trip_id, user_id, (err) => {
        if (err) return res.status(500).json(err);
        res.json({ liked: false });
      });
    } else {
      Trip.addLike(trip_id, user_id, (err) => {
        if (err) return res.status(500).json(err);
        res.json({ liked: true });
      });
    }
  });
};

exports.getTripById = (req, res) => {
  const trip_id = req.params.id;
  Trip.getTripById(trip_id, (err, results) => {
    if (err) return res.status(500).json(err);
    if (!results || results.length === 0) return res.status(404).json({ message: "Trip not found" });
    res.json(results[0]);
  });
};

exports.getMyTrips = (req, res) => {
  const user_id = req.user.user_id;

  Trip.getMyTrips(user_id, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

exports.getPopularTrips = (req, res) => {
  let user_id = null;
  const authHeader = req.headers.authorization;
  if (authHeader) {
    try {
      const decoded = jwt.verify(authHeader.split(" ")[1], process.env.JWT_SECRET);
      user_id = decoded.user_id;
    } catch (_) {}
  }

  Trip.getPopularTrips(user_id, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

exports.toggleVisibility = (req, res) => {
  const { id: trip_id } = req.params;
  const user_id = req.user.user_id;
  const { is_public } = req.body;

  if (typeof is_public !== "boolean" && is_public !== 0 && is_public !== 1) {
    return res.status(400).json({ message: "is_public 값이 올바르지 않습니다." });
  }

  Trip.setVisibility(trip_id, user_id, is_public ? 1 : 0, (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.affectedRows === 0)
      return res.status(403).json({ message: "권한이 없거나 존재하지 않는 여행입니다." });
    res.json({ is_public: is_public ? 1 : 0 });
  });
};

exports.updateTrip = (req, res) => {
  const trip_id = req.params.id;
  const user_id = req.user.user_id;

  Trip.getTripById(trip_id, (err, results) => {
    if (err) return res.status(500).json(err);
    if (!results || results.length === 0) return res.status(404).json({ message: "Trip not found" });
    if (results[0].creator_id !== user_id) return res.status(403).json({ message: "권한이 없습니다." });

    Trip.updateTrip(trip_id, req.body, (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Trip updated" });
    });
  });
};

exports.deleteTrip = (req, res) => {
  const trip_id = req.params.id;
  const user_id = req.user.user_id;

  Trip.getTripById(trip_id, (err, results) => {
    if (err) return res.status(500).json(err);
    if (!results || results.length === 0) return res.status(404).json({ message: "Trip not found" });
    if (results[0].creator_id !== user_id) return res.status(403).json({ message: "권한이 없습니다." });

    Trip.deleteTrip(trip_id, (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Trip deleted" });
    });
  });
};
