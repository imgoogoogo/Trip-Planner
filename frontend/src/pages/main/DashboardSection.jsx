import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import iconLike from "./Icon-like.svg";
import iconDuration from "./icon-date.svg";
import iconPlaces from "./image.svg";
import { filterTabs } from "./tripsData.jsx";

const TripCard = ({ trip }) => {
  const navigate = useNavigate();
  const [liked, setLiked] = useState(!!trip.user_liked);
  const [likeCount, setLikeCount] = useState(trip.likes ?? 0);
  const [saved, setSaved] = useState(false);

  const handleLike = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const prevLiked = liked;
    const prevCount = likeCount;
    setLiked(!liked);
    setLikeCount((prev) => prev + (liked ? -1 : 1));

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/trips/${trip.trip_id}/like`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!res.ok) throw new Error();
      const data = await res.json();
      setLiked(data.liked);
    } catch {
      setLiked(prevLiked);
      setLikeCount(prevCount);
    }
  };

  const handleCardClick = () =>
    navigate("/create-trip", {
      state: {
        viewMode: true,
        tripId: trip.trip_id,
        destination: trip.country ?? "",
        startDate: trip.start_date?.slice(0, 10) ?? "",
        endDate: trip.end_date?.slice(0, 10) ?? "",
        title: trip.title,
        description: trip.description ?? "",
      },
    });

  return (
    <article
      onClick={handleCardClick}
      className="flex flex-col items-start bg-white rounded-3xl overflow-hidden border border-solid border-slate-100 cursor-pointer hover:shadow-md transition-shadow"
    >
      {/* 이미지 */}
      <div
        className="relative self-stretch w-full h-48 bg-cover bg-center bg-slate-100"
        style={
          trip.image_url ? { backgroundImage: `url(${trip.image_url})` } : {}
        }
      >
        <div className="inline-flex flex-col items-start px-3 py-1 absolute top-4 left-4 bg-[#ffffffe6] rounded-full backdrop-blur-sm">
          <span className="relative flex items-center h-4 mt-[-1.00px] [font-family:'Manrope-ExtraLight',Helvetica] font-extralight text-slate-900 text-xs tracking-[0] leading-4 whitespace-nowrap">
            {trip.country ?? trip.title}
          </span>
        </div>
      </div>

      {/* 본문 */}
      <div className="flex flex-col w-full px-5 pt-5 pb-5 gap-3">
        {/* 작성자 */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[#3c83f633] flex items-center justify-center overflow-hidden flex-shrink-0">
            <span className="text-[#3c83f6] text-[10px] [font-family:'Manrope-ExtraLight',Helvetica] font-extralight">
              {trip.author_name?.charAt(0) ?? "?"}
            </span>
          </div>
          <span className="text-slate-600 text-xs leading-4 [font-family:'Manrope-ExtraLight',Helvetica] font-extralight whitespace-nowrap">
            by {trip.author_name}
          </span>
        </div>

        {/* 제목 */}
        <h2 className="text-slate-900 text-lg leading-[22.5px] [font-family:'Manrope-ExtraLight',Helvetica] font-extralight tracking-[0]">
          {trip.title}
        </h2>

        {/* 기간 · 장소 수 */}
        <div className="flex items-center gap-4">
          <div className="inline-flex items-center gap-1">
            <img
              className="w-[10.5px] h-[11.67px]"
              alt="Duration"
              src={iconDuration}
            />
            <span className="text-slate-500 text-xs leading-4 [font-family:'Manrope-ExtraLight',Helvetica] font-extralight whitespace-nowrap">
              {trip.duration_days ?? "-"} Days
            </span>
          </div>
          <div className="inline-flex items-center gap-1">
            <img
              className="w-[9.33px] h-[11.67px]"
              alt="Places"
              src={iconPlaces}
            />
            <span className="text-slate-500 text-xs leading-4 [font-family:'Manrope-ExtraLight',Helvetica] font-extralight whitespace-nowrap">
              {trip.places_count ?? 0} 개 장소
            </span>
          </div>
        </div>

        {/* 좋아요 */}
        <div className="flex items-center pt-4 border-t border-slate-100">
          <button
            className="all-[unset] box-border inline-flex items-center gap-1 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              handleLike();
            }}
            aria-label={liked ? "Unlike" : "Like"}
          >
            <img
              className="w-[15px] h-[13.76px] transition-all"
              alt="Like"
              src={iconLike}
              style={
                liked
                  ? {
                      filter:
                        "invert(27%) sepia(97%) saturate(7482%) hue-rotate(356deg) brightness(97%) contrast(97%)",
                    }
                  : {}
              }
            />
            <span className="text-slate-500 text-xs text-center leading-4 [font-family:'Manrope-ExtraLight',Helvetica] font-extralight whitespace-nowrap">
              {likeCount}
            </span>
          </button>
        </div>
      </div>
    </article>
  );
};

const sortTrips = (trips, tabKey) => {
  const sorted = [...trips];
  if (tabKey === "likes")
    sorted.sort((a, b) => (b.likes ?? 0) - (a.likes ?? 0));
  else if (tabKey === "places")
    sorted.sort((a, b) => (b.places_count ?? 0) - (a.places_count ?? 0));
  else if (tabKey === "duration")
    sorted.sort((a, b) => (b.duration_days ?? 0) - (a.duration_days ?? 0));
  return sorted;
};

export const DashboardSection = () => {
  const [activeTab, setActiveTab] = useState(filterTabs[0]);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    fetch(`${import.meta.env.VITE_API_URL}/api/trips/popular`, { headers })
      .then((r) => {
        if (!r.ok) throw new Error("서버 오류");
        return r.json();
      })
      .then((data) => setTrips(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const sortedTrips = sortTrips(trips, activeTab.key);

  return (
    <div className="relative flex-1 self-stretch grow overflow-hidden">
      <div className="flex flex-col w-full h-full items-start gap-8 p-8 absolute top-0 left-0 overflow-y-auto">
        <div className="flex items-end justify-between relative self-stretch w-full flex-[0_0_auto]">
          <div className="inline-flex flex-col items-start gap-2 relative flex-[0_0_auto]">
            <div className="relative flex items-center h-9 mt-[-1.00px] text-slate-900 text-3xl tracking-[-0.75px] leading-9 whitespace-nowrap [font-family:'Manrope-ExtraLight',Helvetica] font-extralight">
              공유된 여행
            </div>
            <p className="relative flex items-center h-6 mt-[-1.00px] text-slate-500 text-base tracking-[0] leading-6 whitespace-nowrap [font-family:'Manrope-ExtraLight',Helvetica] font-extralight">
              사람들이 공유한 일정들을 확인해보세요.
            </p>
          </div>

          <div className="inline-flex p-1.5 flex-[0_0_auto] bg-white rounded-3xl border border-solid border-slate-200 items-center relative">
            {filterTabs.map((tab) => (
              <button
                key={tab.label}
                onClick={() => setActiveTab(tab)}
                className={`all-[unset] box-border inline-flex flex-col justify-center px-5 py-2 flex-[0_0_auto] rounded-2xl items-center relative cursor-pointer transition-colors${activeTab.key === tab.key ? " bg-slate-100" : ""}`}
              >
                <div
                  className={`relative flex items-center justify-center h-5 mt-[-1.00px] text-sm text-center tracking-[0] leading-5 whitespace-nowrap [font-family:'Manrope-ExtraLight',Helvetica] font-extralight${activeTab.key === tab.key ? " text-[#3c83f6]" : " text-slate-500"}`}
                  style={{ width: tab.width }}
                >
                  {tab.label}
                </div>
              </button>
            ))}
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center w-full py-20">
            <div className="w-8 h-8 border-2 border-[#3c83f6] border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center w-full py-20">
            <p className="text-slate-400 text-sm [font-family:'Manrope-ExtraLight',Helvetica] font-extralight">
              데이터를 불러오지 못했습니다: {error}
            </p>
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-3 gap-6 w-full">
            {sortedTrips.map((trip) => (
              <TripCard key={trip.trip_id} trip={trip} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardSection;
