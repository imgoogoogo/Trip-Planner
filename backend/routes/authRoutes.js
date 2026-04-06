const express = require("express");
const router = express.Router();
const passport = require("../config/passport");
const {
  googleCallback,
  getMe,
  getGoogleAuthUrl,
} = require("../controllers/authController");

// Google OAuth 시작 - 이메일과 프로필 정보 요청
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"], prompt: "select_account" }),
);

// Google OAuth 콜백
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login",
  }),
  googleCallback,
);

// 현재 로그인한 사용자 정보 조회
router.get("/me", getMe);

module.exports = router;
