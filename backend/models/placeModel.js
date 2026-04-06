const db = require("../config/db");

const Place = {
  createPlace: (place, callback) => {
    const sql = `
      INSERT INTO places
      (trip_id, name, latitude, longitude, description)
      VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
      sql,
      [
        place.trip_id,
        place.name,
        place.latitude,
        place.longitude,
        place.description,
      ],
      callback,
    );
  },

  getPlacesByTrip: (trip_id, callback) => {
    const sql = `
      SELECT * FROM places
      WHERE trip_id = ?
    `;

    db.query(sql, [trip_id], callback);
  },

  updatePlace: (place_id, place, callback) => {
    const sql = `
      UPDATE places
      SET name=?, latitude=?, longitude=?, description=?
      WHERE place_id=?
    `;

    db.query(
      sql,
      [
        place.name,
        place.latitude,
        place.longitude,
        place.description,
        place_id,
      ],
      callback,
    );
  },

  deletePlace: (place_id, callback) => {
    db.query(`DELETE FROM places WHERE place_id=?`, [place_id], callback);
  },

  deletePlacesByTrip: (trip_id, callback) => {
    db.query(`DELETE FROM places WHERE trip_id=?`, [trip_id], callback);
  },
};

module.exports = Place;
