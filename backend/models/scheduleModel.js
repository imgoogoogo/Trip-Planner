const db = require("../config/db");
const Place = require("./placeModel");

const Schedule = {
  createSchedule: (schedule, callback) => {
    const sql = `
      INSERT INTO schedules
      (trip_id, place_id, creator_id, title, description, start_time, end_time, visibility, day_num)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
      sql,
      [
        schedule.trip_id,
        schedule.place_id ?? null,
        schedule.creator_id,
        schedule.title,
        schedule.description,
        schedule.start_time,
        schedule.end_time,
        schedule.visibility,
        schedule.day_num ?? 1,
      ],
      callback,
    );
  },

  getSchedulesByTrip: (trip_id, callback) => {
    const sql = `
      SELECT
        s.schedule_id,
        s.trip_id,
        s.place_id,
        s.creator_id,
        s.title,
        s.description,
        s.start_time,
        s.end_time,
        s.visibility,
        s.day_num,
        s.created_at,
        p.latitude  AS lat,
        p.longitude AS lng,
        p.name      AS place_name
      FROM schedules s
      LEFT JOIN places p ON s.place_id = p.place_id
      WHERE s.trip_id = ?
      ORDER BY s.day_num, s.schedule_id
    `;

    db.query(sql, [trip_id], callback);
  },

  updateSchedule: (schedule_id, schedule, callback) => {
    const sql = `
      UPDATE schedules
      SET title=?, description=?, start_time=?, end_time=?, visibility=?
      WHERE schedule_id=?
    `;

    db.query(
      sql,
      [
        schedule.title,
        schedule.description,
        schedule.start_time,
        schedule.end_time,
        schedule.visibility,
        schedule_id,
      ],
      callback,
    );
  },

  deleteSchedule: (schedule_id, callback) => {
    const sql = `DELETE FROM schedules WHERE schedule_id=?`;
    db.query(sql, [schedule_id], callback);
  },

  deleteSchedulesByTrip: (trip_id, callback) => {
    db.query(`DELETE FROM schedules WHERE trip_id=?`, [trip_id], (err) => {
      if (err) return callback(err);
      Place.deletePlacesByTrip(trip_id, callback);
    });
  },
};

module.exports = Schedule;
