const db = require("../config/db");

const findUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      (err, results) => {
        if (err) return reject(err);
        resolve(results[0] || null);
      }
    );
  });
};

const createGoogleUser = ({ email, name, profileImage }) => {
  return new Promise((resolve, reject) => {
    db.query(
      "INSERT INTO users (email, password, name, profile_image) VALUES (?, 'GOOGLE_OAUTH', ?, ?)",
      [email, name, profileImage],
      (err, result) => {
        if (err) return reject(err);
        resolve({ user_id: result.insertId, email, name, profile_image: profileImage });
      }
    );
  });
};

const updateProfileImage = (user_id, profileImage) => {
  return new Promise((resolve, reject) => {
    db.query(
      "UPDATE users SET profile_image = ? WHERE user_id = ?",
      [profileImage, user_id],
      (err) => {
        if (err) return reject(err);
        resolve();
      }
    );
  });
};

const findOrCreateGoogleUser = async ({ email, name, profileImage }) => {
  const existing = await findUserByEmail(email);
  if (existing) {
    // 프로필 이미지가 바뀌었을 수 있으므로 업데이트
    if (profileImage && existing.profile_image !== profileImage) {
      await updateProfileImage(existing.user_id, profileImage);
    }
    return { ...existing, profile_image: profileImage ?? existing.profile_image };
  }
  return createGoogleUser({ email, name, profileImage });
};

module.exports = { findUserByEmail, createGoogleUser, findOrCreateGoogleUser };
