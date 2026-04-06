import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import iconDate from "./icon-date.svg";

const TripCard = ({ trip, onDeleted }) => {
  const navigate = useNavigate();
  const [isPublic, setIsPublic] = useState(!!trip.is_public);
  const [toggling, setToggling] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleVisibility = async () => {
    const token = localStorage.getItem("token");
    if (!token || toggling) return;
    setToggling(true);
    const next = !isPublic;
    setIsPublic(next);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/trips/${trip.trip_id}/visibility`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ is_public: next }),
        },
      );
      if (!res.ok) throw new Error();
    } catch {
      setIsPublic(!next);
    } finally {
      setToggling(false);
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!window.confirm("이 여행을 삭제하시겠습니까?")) return;
    const token = localStorage.getItem("token");
    if (!token || deleting) return;
    setDeleting(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/trips/${trip.trip_id}`,
        { method: "DELETE", headers: { Authorization: `Bearer ${token}` } },
      );
      if (!res.ok) throw new Error();
      onDeleted?.(trip.trip_id);
    } catch {
      alert("삭제에 실패했습니다.");
    } finally {
      setDeleting(false);
    }
  };

  const handleCardClick = () => {
    navigate("/create-trip", {
      state: {
        tripId: trip.trip_id,
        editMode: true,
        destination: trip.country ?? "",
        startDate: trip.start_date?.slice(0, 10) ?? "",
        endDate: trip.end_date?.slice(0, 10) ?? "",
        title: trip.title,
        description: trip.description ?? "",
      },
    });
  };

  return (
    <div
      onClick={handleCardClick}
      className="relative w-full h-fit flex flex-col items-start bg-white rounded-2xl overflow-hidden border border-solid border-slate-200 shadow-[0px_1px_2px_#0000000d] cursor-pointer hover:shadow-md transition-shadow"
    >
      <div className="flex flex-col h-48 items-start justify-center relative self-stretch w-full z-[1]">
        <div
          className="relative flex-1 self-stretch w-full grow bg-cover bg-[50%_50%] bg-slate-100"
          style={
            trip.image_url ? { backgroundImage: `url(${trip.image_url})` } : {}
          }
        />
        <div className="inline-flex flex-col items-start px-3 py-1 absolute top-4 right-4 bg-[#ffffffe6] rounded-full backdrop-blur-[2px]">
          <div className="relative flex items-center h-[15px] mt-[-1.00px] text-[#3c83f6] text-[10px] tracking-[0.50px] leading-[15px] whitespace-nowrap [font-family:'Manrope-ExtraLight',Helvetica] font-extralight">
            {trip.country ?? "여행"}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-start gap-[3.5px] p-6 relative self-stretch w-full flex-[0_0_auto] z-0">
        <div className="relative flex items-center self-stretch mt-[-1.00px] [font-family:'Manrope-ExtraLight',Helvetica] font-extralight text-slate-900 text-lg tracking-[0] leading-7">
          {trip.title}
        </div>

        <div className="flex items-center gap-1.5 relative self-stretch w-full flex-[0_0_auto]">
          <img className="relative w-3 h-[13.33px]" alt="date" src={iconDate} />
          <p className="relative flex items-center h-4 mt-[-1.00px] text-slate-500 text-xs tracking-[0] leading-4 whitespace-nowrap [font-family:'Manrope-ExtraLight',Helvetica] font-extralight">
            {trip.start_date?.slice(0, 10)} ~ {trip.end_date?.slice(0, 10)}
          </p>
        </div>

        <div className="relative self-stretch w-full">
          <p className="w-full text-slate-600 text-sm tracking-[0] leading-[22.8px] [font-family:'Manrope-ExtraLight',Helvetica] font-extralight">
            {trip.description}
          </p>
        </div>

        <div className="flex items-center justify-between pt-4 pb-0 px-0 relative self-stretch w-full flex-[0_0_auto] border-t border-slate-100">
          <div className="flex items-center gap-3">
            <span className="text-slate-400 text-xs [font-family:'Manrope-ExtraLight',Helvetica] font-extralight">
              {trip.duration_days ?? "-"}일 · {trip.places_count ?? 0}개 장소
            </span>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="all-[unset] box-border flex items-center gap-1 px-2 py-0.5 rounded-full hover:bg-red-50 cursor-pointer transition-colors group"
            >
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                <path
                  d="M1 1l10 10M11 1L1 11"
                  stroke="#cbd5e1"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  className="group-hover:stroke-red-400"
                />
              </svg>
              <span className="text-[11px] text-slate-300 group-hover:text-red-400 [font-family:'Manrope-ExtraLight',Helvetica] transition-colors">
                {deleting ? "삭제 중..." : "삭제"}
              </span>
            </button>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleVisibility();
            }}
            disabled={toggling}
            className="all-[unset] box-border flex items-center gap-2 cursor-pointer"
          >
            <span
              className={`text-xs [font-family:'Manrope-ExtraLight',Helvetica] font-extralight ${isPublic ? "text-[#3c83f6]" : "text-slate-400"}`}
            >
              {isPublic ? "공개" : "비공개"}
            </span>
            <div
              className={`relative w-9 h-5 rounded-full transition-colors duration-200 ${isPublic ? "bg-[#3c83f6]" : "bg-slate-200"}`}
            >
              <div
                className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${isPublic ? "translate-x-[18px]" : "translate-x-0.5"}`}
              />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export const MyTripsSection = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    fetch(`${import.meta.env.VITE_API_URL}/api/trips/my`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => {
        if (r.status === 401) {
          localStorage.removeItem("token");
          navigate("/");
          throw new Error("인증 만료");
        }
        if (!r.ok) throw new Error("서버 오류");
        return r.json();
      })
      .then((data) => setTrips(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [navigate]);

  return (
    <div className="relative flex-1 self-stretch grow overflow-hidden">
      <div className="flex flex-col w-full h-full items-start gap-8 p-8 absolute top-0 left-0 overflow-y-auto">
        <div className="flex items-end justify-between relative self-stretch w-full flex-[0_0_auto]">
          <div className="inline-flex flex-col items-start gap-2 relative flex-[0_0_auto]">
            <div className="relative flex items-center h-9 mt-[-1.00px] text-slate-900 text-3xl tracking-[-0.75px] leading-9 whitespace-nowrap [font-family:'Manrope-ExtraLight',Helvetica] font-extralight">
              나의 여행
            </div>
            <p className="relative flex items-center h-6 mt-[-1.00px] text-slate-500 text-base tracking-[0] leading-6 whitespace-nowrap [font-family:'Manrope-ExtraLight',Helvetica] font-extralight">
              지구 위 모든 발자취를 기록하고, 당신만의 모험 지도를 그려보세요.
            </p>
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
              {error}
            </p>
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-3 h-fit gap-6 w-full">
            {trips.length === 0 ? (
              <div className="col-span-3 flex flex-col items-center justify-center gap-4 py-20">
                <p className="text-slate-400 text-sm [font-family:'Manrope-ExtraLight',Helvetica] font-extralight">
                  아직 등록된 여행이 없습니다.
                </p>
              </div>
            ) : (
              trips.map((trip) => (
                <TripCard
                  key={trip.trip_id}
                  trip={trip}
                  onDeleted={(id) =>
                    setTrips((prev) => prev.filter((t) => t.trip_id !== id))
                  }
                />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTripsSection;
