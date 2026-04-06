const db = require("../config/db");

const Trip = {
  createTrip: (trip, callback) => {
    const sql = `
      INSERT INTO trips
      (creator_id, title, country, description, start_date, end_date, image_url)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
      sql,
      [
        trip.creator_id,
        trip.title,
        trip.country,
        trip.description,
        trip.start_date,
        trip.end_date,
        trip.image_url ?? null,
      ],
      callback,
    );
  },

  getTrips: (callback) => {
    const sql = `SELECT * FROM trips`;
    db.query(sql, callback);
  },

  hasLiked: (trip_id, user_id, callback) => {
    db.query(
      "SELECT 1 FROM trip_likes WHERE trip_id = ? AND user_id = ?",
      [trip_id, user_id],
      (err, rows) => {
        if (err) return callback(err, null);
        callback(null, rows.length > 0);
      }
    );
  },

  addLike: (trip_id, user_id, callback) => {
    db.query(
      "INSERT IGNORE INTO trip_likes (trip_id, user_id) VALUES (?, ?)",
      [trip_id, user_id],
      (err) => {
        if (err) return callback(err);
        db.query("UPDATE trips SET likes = likes + 1 WHERE trip_id = ?", [trip_id], callback);
      }
    );
  },

  removeLike: (trip_id, user_id, callback) => {
    db.query(
      "DELETE FROM trip_likes WHERE trip_id = ? AND user_id = ?",
      [trip_id, user_id],
      (err) => {
        if (err) return callback(err);
        db.query("UPDATE trips SET likes = GREATEST(likes - 1, 0) WHERE trip_id = ?", [trip_id], callback);
      }
    );
  },

  getTripById: (trip_id, callback) => {
    const sql = `SELECT * FROM trips WHERE trip_id = ?`;
    db.query(sql, [trip_id], callback);
  },

  getMyTrips: (user_id, callback) => {
    const sql = `
      SELECT
        t.trip_id,
        t.title,
        t.country,
        t.description,
        t.start_date,
        t.end_date,
        t.image_url,
        t.likes,
        t.saves,
        t.is_public,
        t.created_at,
        u.name AS author_name,
        DATEDIFF(t.end_date, t.start_date) + 1 AS duration_days,
        COUNT(DISTINCT s.schedule_id) AS places_count
      FROM trips t
      JOIN users u ON t.creator_id = u.user_id
      LEFT JOIN schedules s ON t.trip_id = s.trip_id
      WHERE t.creator_id = ?
      GROUP BY t.trip_id
      ORDER BY t.created_at DESC
    `;
    db.query(sql, [user_id], callback);
  },

  setVisibility: (trip_id, user_id, is_public, callback) => {
    db.query(
      "UPDATE trips SET is_public = ? WHERE trip_id = ? AND creator_id = ?",
      [is_public, trip_id, user_id],
      callback
    );
  },

  getPopularTrips: (user_id, callback) => {
    const sql = `
      SELECT
        t.trip_id,
        t.title,
        t.country,
        t.description,
        t.start_date,
        t.end_date,
        t.image_url,
        t.likes,
        t.saves,
        t.created_at,
        u.name AS author_name,
        DATEDIFF(t.end_date, t.start_date) + 1 AS duration_days,
        COUNT(DISTINCT s.schedule_id) AS places_count,
        MAX(IF(tl.user_id IS NOT NULL, 1, 0)) AS user_liked
      FROM trips t
      JOIN users u ON t.creator_id = u.user_id
      LEFT JOIN schedules s ON t.trip_id = s.trip_id
      LEFT JOIN trip_likes tl ON t.trip_id = tl.trip_id AND tl.user_id = ?
      WHERE t.is_public = 1
      GROUP BY t.trip_id
      ORDER BY t.likes DESC
      LIMIT 20
    `;
    db.query(sql, [user_id ?? null], callback);
  },

  updateTrip: (trip_id, trip, callback) => {
    const fields = ["title = ?", "country = ?", "description = ?", "start_date = ?", "end_date = ?"];
    const params = [trip.title, trip.country, trip.description, trip.start_date, trip.end_date];

    if (trip.image_url !== undefined) {
      fields.push("image_url = ?");
      params.push(trip.image_url);
    }
    params.push(trip_id);

    db.query(`UPDATE trips SET ${fields.join(", ")} WHERE trip_id = ?`, params, callback);
  },

  deleteTrip: (trip_id, callback) => {
    const sql = `DELETE FROM trips WHERE trip_id = ?`;

    db.query(sql, [trip_id], callback);
  },
};

module.exports = Trip;
