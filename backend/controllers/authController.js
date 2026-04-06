const jwt = require("jsonwebtoken");

const googleCallback = (req, res) => {
  const user = req.user;

  const token = jwt.sign(
    { user_id: user.user_id, email: user.email, name: user.name, profile_image: user.profile_image ?? null },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );

  // 프론트엔드로 토큰을 URL 파라미터에 담아 리다이렉트
  res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}`);
};

// 구글 로그인 URL을 JSON으로 반환 (프론트에서 팝업/리다이렉트 용도)
const getGoogleAuthUrl = (_req, res) => {
  const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: process.env.GOOGLE_CALLBACK_URL,
    response_type: "code",
    scope: "openid email profile",
    access_type: "offline",
  });
  res.json({ url: `${rootUrl}?${params}` });
};

const getMe = (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "토큰이 없습니다." });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ user: decoded });
  } catch {
    res.status(401).json({ message: "유효하지 않은 토큰입니다." });
  }
};

module.exports = { googleCallback, getMe, getGoogleAuthUrl };
