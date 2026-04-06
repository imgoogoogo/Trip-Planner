import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);
      navigate("/main", { replace: true });
    } else {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f5f7f8]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-[#2563eb] border-t-transparent rounded-full animate-spin" />
        <p className="text-[14px] text-gray-500 [font-family:'Inter',Helvetica]">
          로그인 중...
        </p>
      </div>
    </div>
  );
}