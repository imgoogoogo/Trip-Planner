import { useNavigate } from "react-router-dom";
import icon2 from "./icon-2.svg";
import icon3 from "./icon-3.svg";
import icon4 from "./icon-4.svg";
import icon5 from "./icon-5.svg";
import icon6 from "./icon-6.svg";
import icon from "./icon.svg";
import image from "./image.svg";

const navItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: icon2,
    iconClass: "relative w-[18px] h-[18px]",
    labelWidth: "w-[72.56px]",
  },
  {
    id: "my-trips",
    label: "My Trips",
    icon: icon3,
    iconClass: "relative w-[18px] h-[18px]",
    labelWidth: "w-[55.94px]",
  },
];

export const SidebarNavigationSection = ({ activeNav, setActiveNav }) => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  const handleCreateTrip = () => {
    if (!isLoggedIn) {
      alert("여행 계획을 만들려면 로그인이 필요합니다.");
      return;
    }
    navigate("/create-trip");
  };

  return (
    <div className="flex flex-col w-64 items-start justify-between p-6 relative self-stretch bg-white border-r [border-right-style:solid] border-slate-200 h-full">
      <div className="flex flex-col items-start gap-8 relative self-stretch w-full overflow-y-auto flex-1 min-h-0">
        <div className="flex items-center gap-3 relative self-stretch w-full flex-[0_0_auto]">
          <div className="flex w-10 h-10 justify-center bg-[#3c83f6] rounded-2xl items-center relative">
            <div className="inline-flex flex-col items-start relative flex-[0_0_auto]">
              <img alt="Icon" src={icon} />
            </div>
          </div>

          <div className="inline-flex flex-col items-start relative flex-[0_0_auto]">
            <div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
              <div className="relative flex items-center w-[119.77px] h-[18px] mt-[-1.00px] text-slate-900 text-lg tracking-[0] leading-[18px] whitespace-nowrap [font-family:'Manrope-ExtraLight',Helvetica] font-extralight">
                TripPlanner
              </div>
            </div>

            <div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
              <div className="relative flex items-center w-[92.3px] h-4 mt-[-1.00px] text-slate-500 text-xs tracking-[0] leading-4 whitespace-nowrap [font-family:'Manrope-ExtraLight',Helvetica] font-extralight">
                여행 일정 플래너
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-start gap-1 relative self-stretch w-full flex-[0_0_auto]">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveNav(item.id)}
              className={`${activeNav === item.id ? "bg-[#3c83f61a] " : "hover:bg-slate-50 "}all-[unset] box-border flex items-center gap-3 px-3 py-2.5 relative self-stretch w-full flex-[0_0_auto] rounded-3xl cursor-pointer transition-colors`}
            >
              <div className="inline-flex flex-col items-start relative flex-[0_0_auto]">
                <img className={item.iconClass} alt="Icon" src={item.icon} />
              </div>

              <div className="inline-flex flex-col items-start relative flex-[0_0_auto]">
                <div
                  className={`relative flex items-center ${item.labelWidth} h-5 mt-[-1.00px] ${activeNav === item.id ? "text-[#3c83f6]" : "text-slate-600"} text-sm tracking-[0] leading-5 whitespace-nowrap [font-family:'Manrope-ExtraLight',Helvetica] font-extralight`}
                >
                  {item.label}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2 relative self-stretch w-full flex-[0_0_auto]">
        <button
          onClick={handleCreateTrip}
          className="flex items-center justify-center gap-2 px-4 py-3 relative self-stretch w-full flex-[0_0_auto] bg-[#3c83f6] hover:bg-[#2563eb] active:bg-[#1d4ed8] rounded-3xl transition-colors cursor-pointer"
        >
          <img
            className="relative w-[11.67px] h-[11.67px]"
            alt="Icon"
            src={image}
          />
          <span className="relative flex items-center justify-center h-6 mt-[-1.00px] text-white text-base text-center tracking-[0] leading-6 whitespace-nowrap [font-family:'Manrope-ExtraLight',Helvetica] font-extralight">
            Create Trip
          </span>
        </button>

        {isLoggedIn ? (
          <button
            onClick={() => { localStorage.removeItem("token"); navigate("/"); }}
            className="all-[unset] box-border flex items-center justify-center gap-2 px-4 py-2.5 relative self-stretch w-full flex-[0_0_auto] rounded-3xl border border-solid border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span className="text-slate-400 text-sm tracking-[0] leading-5 whitespace-nowrap [font-family:'Manrope-ExtraLight',Helvetica] font-extralight">
              로그아웃
            </span>
          </button>
        ) : (
          <button
            onClick={() => window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/google`}
            className="all-[unset] box-border flex items-center justify-center gap-2 px-4 py-2.5 relative self-stretch w-full flex-[0_0_auto] rounded-3xl border border-solid border-[#3c83f6] hover:bg-blue-50 cursor-pointer transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#3c83f6]">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
              <polyline points="10 17 15 12 10 7" />
              <line x1="15" y1="12" x2="3" y2="12" />
            </svg>
            <span className="text-[#3c83f6] text-sm tracking-[0] leading-5 whitespace-nowrap [font-family:'Manrope-ExtraLight',Helvetica] font-extralight">
              로그인
            </span>
          </button>
        )}
      </div>
    </div>
  );
};
