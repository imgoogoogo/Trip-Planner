import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import icon from "../main/icon.svg";

const footerLinks = [
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Service", href: "#" },
  { label: "Contact Support", href: "#" },
];

export const Home = () => {
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showSignUp, setShowSignUp] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [errors, setErrors] = useState({
    destination: false,
    startDate: false,
    endDate: false,
  });
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const payload = jwtDecode(token);
      if (payload.exp * 1000 > Date.now()) setUser(payload);
      else localStorage.removeItem("token");
    } catch {
      localStorage.removeItem("token");
    }
  }, []);

  // 국가 자동완성
  const [allCountries, setAllCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loadingCountries, setLoadingCountries] = useState(false);

  const dropdownRef = useRef();
  const navigate = useNavigate();

  // 앱 시작 시 전체 국가 목록 한 번만 fetch
  useEffect(() => {
    setLoadingCountries(true);
    fetch("https://restcountries.com/v3.1/all?fields=name,flag,translations")
      .then((r) => r.json())
      .then((data) => {
        const list = data.map((c) => ({
          nameKo: c.translations?.kor?.common || "",
          nameEn: c.name?.common || "",
          flag: c.flag || "",
        }));
        list.sort((a, b) => a.nameKo.localeCompare(b.nameKo, "ko"));
        setAllCountries(list);
      })
      .catch((err) => console.error("국가 목록 로드 실패:", err))
      .finally(() => setLoadingCountries(false));
  }, []);

  // 입력값으로 로컬 필터링 (한국어 & 영문 동시 지원)
  useEffect(() => {
    const query = destination.trim();
    if (!query) {
      setFilteredCountries([]);
      setShowDropdown(false);
      return;
    }
    const lower = query.toLowerCase();
    const results = allCountries
      .filter(
        (c) =>
          c.nameKo.includes(query) || c.nameEn.toLowerCase().includes(lower),
      )
      .slice(0, 7);
    setFilteredCountries(results);
    setShowDropdown(results.length > 0);
  }, [destination, allCountries]);

  // 바깥 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col items-start relative bg-[#f5f7f8] min-h-screen w-full">
      {/* Login Prompt Modal */}
      {showLoginPrompt && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={() => setShowLoginPrompt(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-[340px] px-8 py-8 flex flex-col items-center gap-5 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowLoginPrompt(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path
                  d="M2 2l14 14M16 2L2 16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2C9.243 2 7 4.243 7 7v2H5a1 1 0 00-1 1v10a1 1 0 001 1h14a1 1 0 001-1V10a1 1 0 00-1-1h-2V7c0-2.757-2.243-5-5-5zm0 2c1.654 0 3 1.346 3 3v2H9V7c0-1.654 1.346-3 3-3zm0 9a2 2 0 110 4 2 2 0 010-4z"
                  fill="#2563eb"
                />
              </svg>
            </div>

            <div className="flex flex-col items-center gap-1 text-center">
              <h2 className="text-[17px] font-bold text-gray-900 [font-family:'Inter',Helvetica]">
                로그인이 필요해요
              </h2>
              <p className="text-[13px] text-gray-500 [font-family:'Inter',Helvetica] leading-relaxed">
                여행 계획을 시작하려면 먼저 로그인해 주세요.
              </p>
            </div>

            <button
              onClick={() => {
                window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/google`;
              }}
              className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-xl px-4 py-3 hover:bg-gray-50 transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M19.6 10.23c0-.68-.06-1.36-.17-2H10v3.79h5.4a4.62 4.62 0 01-2 3.03v2.52h3.23c1.89-1.74 2.97-4.3 2.97-7.34z"
                  fill="#4285F4"
                />
                <path
                  d="M10 20c2.7 0 4.96-.9 6.62-2.43l-3.23-2.52c-.9.6-2.04.96-3.39.96-2.6 0-4.81-1.76-5.6-4.12H1.07v2.6A10 10 0 0010 20z"
                  fill="#34A853"
                />
                <path
                  d="M4.4 11.89A6.01 6.01 0 014.09 10c0-.66.11-1.3.31-1.89V5.51H1.07A10 10 0 000 10c0 1.61.38 3.14 1.07 4.49l3.33-2.6z"
                  fill="#FBBC05"
                />
                <path
                  d="M10 3.98c1.47 0 2.79.51 3.82 1.5l2.86-2.86C14.95.99 12.69 0 10 0A10 10 0 001.07 5.51l3.33 2.6C5.19 5.74 7.4 3.98 10 3.98z"
                  fill="#EA4335"
                />
              </svg>
              <span className="text-[14px] font-medium text-gray-700 [font-family:'Inter',Helvetica]">
                Google로 로그인하기
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Sign Up Modal */}
      {showSignUp && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={() => setShowSignUp(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-[360px] px-8 py-8 flex flex-col items-center gap-5 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setShowSignUp(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path
                  d="M2 2l14 14M16 2L2 16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            {/* Logo */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-[44px] h-[44px] rounded-full bg-[#2563eb] flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="4.5" fill="white" />
                  <circle
                    cx="12"
                    cy="12"
                    r="9"
                    stroke="white"
                    strokeWidth="2"
                    fill="none"
                  />
                </svg>
              </div>
              <h2 className="text-[18px] font-bold text-gray-900 [font-family:'Inter',Helvetica]">
                Trip Planner 회원가입
              </h2>
              <p className="text-[13px] text-gray-500 [font-family:'Inter',Helvetica] text-center leading-relaxed">
                계정을 만들고 맞춤형 여행 일정을 시작하세요
              </p>
            </div>

            {/* Google Sign Up Button */}
            <button
              onClick={() => {
                window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/google`;
              }}
              className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-xl px-4 py-3 hover:bg-gray-50 transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M19.6 10.23c0-.68-.06-1.36-.17-2H10v3.79h5.4a4.62 4.62 0 01-2 3.03v2.52h3.23c1.89-1.74 2.97-4.3 2.97-7.34z"
                  fill="#4285F4"
                />
                <path
                  d="M10 20c2.7 0 4.96-.9 6.62-2.43l-3.23-2.52c-.9.6-2.04.96-3.39.96-2.6 0-4.81-1.76-5.6-4.12H1.07v2.6A10 10 0 0010 20z"
                  fill="#34A853"
                />
                <path
                  d="M4.4 11.89A6.01 6.01 0 014.09 10c0-.66.11-1.3.31-1.89V5.51H1.07A10 10 0 000 10c0 1.61.38 3.14 1.07 4.49l3.33-2.6z"
                  fill="#FBBC05"
                />
                <path
                  d="M10 3.98c1.47 0 2.79.51 3.82 1.5l2.86-2.86C14.95.99 12.69 0 10 0A10 10 0 001.07 5.51l3.33 2.6C5.19 5.74 7.4 3.98 10 3.98z"
                  fill="#EA4335"
                />
              </svg>
              <span className="text-[14px] font-medium text-gray-700 [font-family:'Inter',Helvetica]">
                Google로 계속하기
              </span>
            </button>

            <p className="text-[12px] text-gray-400 [font-family:'Inter',Helvetica] text-center leading-relaxed">
              가입 시{" "}
              <a href="#" className="text-[#2563eb] hover:underline">
                이용약관
              </a>{" "}
              및{" "}
              <a href="#" className="text-[#2563eb] hover:underline">
                개인정보처리방침
              </a>
              에 동의하게 됩니다.
            </p>
          </div>
        </div>
      )}
      {/* Navbar */}
      <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-[896px] mx-auto px-6 h-[56px] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-[28px] h-[28px] rounded-full bg-[#2563eb] flex items-center justify-center">
              <img alt="Icon" src={icon} />
            </div>
            <span className="text-[15px] font-semibold text-gray-900 [font-family:'Inter',Helvetica]">
              TripPlanner
            </span>
          </div>
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2">
                {user.profile_image ? (
                  <img
                    src={user.profile_image}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover border border-gray-200"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[#2563eb] flex items-center justify-center text-white text-[13px]">
                    {user.name?.charAt(0)}
                  </div>
                )}
                <span className="text-[14px] text-gray-700 [font-family:'Inter',Helvetica]">
                  {user.name}
                </span>
                <button
                  onClick={() => {
                    localStorage.removeItem("token");
                    setUser(null);
                  }}
                  className="text-[13px] text-gray-400 hover:text-gray-600 [font-family:'Inter',Helvetica] transition-colors px-2"
                >
                  로그아웃
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => {
                    window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/google`;
                  }}
                  className="text-[14px] text-gray-700 [font-family:'Inter',Helvetica] hover:text-gray-900 transition-colors px-2"
                >
                  Login
                </button>
                <button
                  onClick={() => setShowSignUp(true)}
                  className="bg-[#2563eb] text-white text-[14px] [font-family:'Inter',Helvetica] font-medium px-4 py-[7px] rounded-full hover:bg-[#1d4ed8] transition-colors"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="w-full flex flex-col items-center">
        {/* Hero Section */}
        <section className="w-full max-w-[896px] mx-auto px-6 pt-[40px] pb-[60px]">
          <div
            className="relative w-full rounded-2xl overflow-hidden"
            style={{ height: "460px" }}
          >
            {/* Background */}
            <div
              className="absolute inset-0 w-full h-full"
              style={{
                background:
                  "linear-gradient(180deg, #6b7f8e 0%, #4a5f6e 20%, #3a4f5e 40%, #2a3f4e 60%, #1a2f3e 80%, #0a1f2e 100%)",
              }}
            >
              <svg
                className="absolute bottom-0 w-full"
                viewBox="0 0 896 300"
                preserveAspectRatio="none"
              >
                <polygon
                  points="0,300 150,80 300,200 450,40 600,160 750,60 896,180 896,300"
                  fill="#2a3a4a"
                />
                <polygon
                  points="0,300 100,160 250,220 400,100 550,200 700,120 896,200 896,300"
                  fill="#1e2e3e"
                />
                <polygon
                  points="0,300 80,200 200,240 350,150 500,230 650,160 800,220 896,180 896,300"
                  fill="#121e2e"
                />
                <rect x="0" y="260" width="896" height="40" fill="#0a1520" />
              </svg>
            </div>

            {/* Hero Text */}
            <div className="relative z-10 flex flex-col items-center justify-center pt-[80px] px-8 text-center">
              <h1 className="text-[42px] font-bold text-white leading-tight [font-family:'Inter',Helvetica] max-w-[560px]">
                여행 일정 생성하기
              </h1>
              <p className="mt-4 text-[15px] text-white/80 [font-family:'Inter',Helvetica] max-w-[420px] leading-relaxed">
                맞춤형 여행 일정을 설계하고 스마트하게 관리하세요. 여정의 모든
                세부 사항을 한곳에서 통합하여 확인할 수 있습니다.
              </p>
            </div>

            {/* Search Card */}
            <div className="absolute bottom-[90px] left-1/2 -translate-x-1/2 w-[calc(100%-48px)] max-w-[720px] z-20">
              <div className="bg-white rounded-2xl shadow-lg px-6 py-5 flex items-start gap-4">
                {/* WHERE — 자동완성 */}
                <div
                  ref={dropdownRef}
                  className="flex flex-col w-[220px] relative"
                >
                  <div className="flex items-center gap-1 mb-1">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path
                        d="M6 1C4.067 1 2.5 2.567 2.5 4.5C2.5 7 6 11 6 11C6 11 9.5 7 9.5 4.5C9.5 2.567 7.933 1 6 1ZM6 6C5.172 6 4.5 5.328 4.5 4.5C4.5 3.672 5.172 3 6 3C6.828 3 7.5 3.672 7.5 4.5C7.5 5.328 6.828 6 6 6Z"
                        fill="#2563eb"
                      />
                    </svg>
                    <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                      WHERE TO?
                    </span>
                  </div>

                  <input
                    type="text"
                    placeholder={
                      loadingCountries ? "로딩 중..." : "나라 또는 도시"
                    }
                    value={destination}
                    onChange={(e) => {
                      setDestination(e.target.value);
                      if (e.target.value.trim())
                        setErrors((prev) => ({ ...prev, destination: false }));
                    }}
                    onFocus={() =>
                      filteredCountries.length > 0 && setShowDropdown(true)
                    }
                    className={`text-[15px] text-gray-700 placeholder-gray-400 bg-transparent outline-none w-full rounded-lg px-1 ${errors.destination ? "border-2 border-red-400" : "border-none"}`}
                  />

                  {/* 드롭다운 */}
                  {showDropdown && filteredCountries.length > 0 && (
                    <div className="absolute top-[52px] left-0 w-[220px] bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden">
                      {filteredCountries.map((country, index) => (
                        <div
                          key={index}
                          onMouseDown={() => {
                            setDestination(country.nameKo || country.nameEn);
                            setShowDropdown(false);
                          }}
                          className="px-4 py-2.5 hover:bg-blue-50 cursor-pointer flex items-center gap-2.5"
                        >
                          <span className="text-lg leading-none">
                            {country.flag}
                          </span>
                          <div>
                            <p className="text-[13px] font-medium text-gray-800 leading-tight">
                              {country.nameKo || country.nameEn}
                            </p>
                            {country.nameKo && (
                              <p className="text-[11px] text-gray-400">
                                {country.nameEn}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Divider */}
                <div className="w-px h-10 bg-gray-200" />

                {/* WHEN */}
                <div className="flex flex-col w-[400px]">
                  <div className="flex items-center gap-1 mb-1">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <rect
                        x="1"
                        y="2"
                        width="10"
                        height="9"
                        rx="1.5"
                        stroke="#2563eb"
                        strokeWidth="1.2"
                        fill="none"
                      />
                      <path d="M1 5h10" stroke="#2563eb" strokeWidth="1.2" />
                      <path
                        d="M4 1v2M8 1v2"
                        stroke="#2563eb"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                      WHEN?
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => {
                        setStartDate(e.target.value);
                        if (e.target.value)
                          setErrors((prev) => ({ ...prev, startDate: false }));
                      }}
                      className={`text-[15px] text-gray-400 bg-transparent outline-none border-none w-[120px] rounded ${errors.startDate ? "ring-2 ring-red-400" : ""}`}
                    />
                    <span className="text-gray-300 text-[15px]">→</span>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => {
                        setEndDate(e.target.value);
                        if (e.target.value)
                          setErrors((prev) => ({ ...prev, endDate: false }));
                      }}
                      className={`text-[15px] text-gray-400 bg-transparent outline-none border-none w-[120px] rounded ${errors.endDate ? "ring-2 ring-red-400" : ""}`}
                    />
                  </div>
                </div>

                {/* CTA */}
                <button
                  onClick={() => {
                    const newErrors = {
                      destination: !destination.trim(),
                      startDate: !startDate,
                      endDate: !endDate,
                    };
                    setErrors(newErrors);
                    if (
                      newErrors.destination ||
                      newErrors.startDate ||
                      newErrors.endDate
                    )
                      return;
                    if (!user) {
                      setShowLoginPrompt(true);
                      return;
                    }
                    navigate("/create-trip", {
                      state: { destination, startDate, endDate },
                    });
                  }}
                  className="flex-shrink-0 bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-[15px] font-semibold [font-family:'Inter',Helvetica] px-6 py-3 rounded-xl flex items-center gap-2 transition-colors whitespace-nowrap"
                >
                  계획 시작하기
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M3 8h10M9 4l4 4-4 4"
                      stroke="white"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 둘러보기 */}
        <div className="flex flex-col items-center gap-2 pb-10">
          <button
            onClick={() => navigate("/main")}
            className="flex flex-col items-center gap-1 text-gray-400 hover:text-[#2563eb] transition-colors group"
          >
            <span className="text-[13px] [font-family:'Inter',Helvetica]">
              Trip Planner 이용자들의 여행 일정들을 둘러보세요!
            </span>
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-white border-t border-gray-100 mt-auto">
        <div className="max-w-[896px] mx-auto px-6 h-[56px] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-[22px] h-[22px] rounded-full bg-[#2563eb] flex items-center justify-center">
              <img alt="Icon" src={icon} />
            </div>
            <span className="text-[13px] text-gray-600 [font-family:'Inter',Helvetica]">
              TripPlanner © 2026
            </span>
          </div>
          <nav className="flex items-center gap-6">
            {footerLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-[13px] text-gray-500 hover:text-gray-800 [font-family:'Inter',Helvetica] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </footer>
    </div>
  );
};

export default Home;
