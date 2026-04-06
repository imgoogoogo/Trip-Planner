const Place = require("../models/placeModel");

exports.createPlace = (req, res) => {
  const place = req.body;

  Place.createPlace(place, (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json({
      message: "Place created",
      place_id: result.insertId,
    });
  });
};

exports.getPlaces = (req, res) => {
  const trip_id = req.params.trip_id;

  Place.getPlacesByTrip(trip_id, (err, results) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json(results);
  });
};

exports.updatePlace = (req, res) => {
  const place_id = req.params.id;
  const place = req.body;

  Place.updatePlace(place_id, place, (err) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json({
      message: "Place updated",
    });
  });
};

exports.deletePlace = (req, res) => {
  const place_id = req.params.id;

  Place.deletePlace(place_id, (err) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json({
      message: "Place deleted",
    });
  });
};
