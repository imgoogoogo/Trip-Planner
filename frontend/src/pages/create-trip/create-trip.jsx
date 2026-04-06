import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL ?? "http://localhost:5000";

const TRAVEL_IMAGES = [
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80",
  "https://images.unsplash.com/photo-1503220317375-aaad61436b1b?w=800&q=80",
  "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80",
  "https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=800&q=80",
  "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80",
  "https://images.unsplash.com/photo-1473496169904-658ba7574b0d?w=800&q=80",
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&q=80",
  "https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?w=800&q=80",
  "https://images.unsplash.com/photo-1548574505-5e239809ee19?w=800&q=80",
  "https://images.unsplash.com/photo-1535530992830-e25d07cfa780?w=800&q=80",
];

const randomTravelImage = () =>
  TRAVEL_IMAGES[Math.floor(Math.random() * TRAVEL_IMAGES.length)];
import { ItineraryTimelineSection } from "./ItineraryTimelineSection";
import { MapAndRecommendationsSection } from "./MapAndRecommendationsSection";

export const CreateTrip = () => {
  const [activeNav, setActiveNav] = useState("dashboard");
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null); // "success" | "error"
  const { state } = useLocation();
  const navigate = useNavigate();

  const editMode = !!state?.editMode;
  const viewMode = !!state?.viewMode;
  const tripId = state?.tripId ?? null;

  const [destination, setDestination] = useState(state?.destination ?? "");
  const [startDate, setStartDate] = useState(state?.startDate ?? "");
  const [endDate, setEndDate] = useState(state?.endDate ?? "");
  const [items, setItems] = useState([]);

  // 편집/조회 모드: 기존 스케줄 로드
  useEffect(() => {
    if ((!editMode && !viewMode) || !tripId) return;
    const token = localStorage.getItem("token");
    fetch(`${API}/api/schedules/trip/${tripId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((schedules) => {
        const loaded = schedules.map((s) => ({
          id: s.schedule_id,
          dayNum: s.day_num ?? 1,
          lat: s.lat ? parseFloat(s.lat) : null,
          lng: s.lng ? parseFloat(s.lng) : null,
          time: "",
          title: s.title,
          tag: "장소",
          tagBg: "bg-blue-50",
          tagText: "text-[#3c83f6]",
          description: s.description ?? "",
          emoji: "📍",
        }));
        setItems(loaded);
      })
      .catch(() => {});
  }, [editMode, tripId]);

  const tripData = { destination, startDate, endDate };

  const days = (() => {
    if (!startDate || !endDate) return [{ dayNum: 1, label: "Day 1" }];
    const result = [];
    const cur = new Date(startDate);
    const end = new Date(endDate);
    for (let i = 1; cur <= end; cur.setDate(cur.getDate() + 1), i++) {
      result.push({ dayNum: i, label: `Day ${i}` });
    }
    return result;
  })();

  const addPlace = (place, dayNum = 1) => {
    setItems((prev) => {
      if (prev.find((i) => i.id === place.id)) return prev;
      return [
        ...prev,
        {
          id: place.id,
          dayNum,
          lat: place.lat,
          lng: place.lng,
          time: "",
          title: place.name,
          tag: place.categoryLabel ?? "장소",
          tagBg: "bg-blue-50",
          tagText: "text-[#3c83f6]",
          description: place.tags?.["addr:full"]?.split(",")[0] ?? "",
          emoji: place.emoji,
        },
      ];
    });
  };

  const deleteItem = (id) =>
    setItems((prev) => prev.filter((i) => i.id !== id));

  const handleSave = async ({ title, description } = {}) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setSaving(true);
    setSaveStatus(null);

    const tripTitle = title || (destination ? `${destination} 여행` : "나의 여행");

    const saveItems = async (trip_id) => {
      await Promise.all(
        items.map(async (item) => {
          const startTime = startDate
            ? new Date(new Date(startDate).getTime() + (item.dayNum - 1) * 86400000)
                .toISOString()
                .slice(0, 19)
                .replace("T", " ")
            : null;

          // lat/lng 있으면 places 테이블에 먼저 저장
          let place_id = null;
          if (item.lat && item.lng) {
            const placeRes = await fetch(`${API}/api/places`, {
              method: "POST",
              headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
              body: JSON.stringify({
                trip_id,
                name: item.title,
                latitude: item.lat,
                longitude: item.lng,
                description: item.description || null,
              }),
            });
            if (placeRes.ok) {
              const placeData = await placeRes.json();
              place_id = placeData.place_id;
            }
          }

          return fetch(`${API}/api/schedules`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({
              trip_id,
              place_id,
              title: item.title,
              description: item.description || null,
              start_time: startTime,
              end_time: null,
              visibility: "trip",
              day_num: item.dayNum,
            }),
          });
        }),
      );
    };

    try {
      if (editMode && tripId) {
        // 기존 여행 업데이트
        const tripRes = await fetch(`${API}/api/trips/${tripId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            title: tripTitle,
            country: destination || null,
            description: description || null,
            start_date: startDate || null,
            end_date: endDate || null,
          }),
        });
        if (!tripRes.ok) throw new Error("trip 수정 실패");

        // 기존 스케줄 삭제 후 재생성
        await fetch(`${API}/api/schedules/trip/${tripId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        await saveItems(tripId);
      } else {
        // 새 여행 생성
        const tripRes = await fetch(`${API}/api/trips`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            title: tripTitle,
            country: destination || null,
            description: description || null,
            start_date: startDate || null,
            end_date: endDate || null,
            image_url: randomTravelImage(),
          }),
        });
        if (!tripRes.ok) throw new Error("trip 생성 실패");
        const { trip_id } = await tripRes.json();
        await saveItems(trip_id);
      }

      setSaveStatus("success");
      setTimeout(() => navigate("/main"), 1200);
    } catch (err) {
      console.error(err);
      setSaveStatus("error");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTrip = async () => {
    if (!editMode || !tripId) return;
    if (!window.confirm("이 여행을 삭제하시겠습니까?")) return;
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API}/api/trips/${tripId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      navigate("/main");
    } catch {
      alert("삭제에 실패했습니다.");
    }
  };

  return (
    <div className="flex h-screen items-start relative bg-[#f5f7f8]">
      <div className="flex-1 h-full overflow-hidden">
        <div className="flex h-full w-full">
          <div className="grid grid-cols-12 w-full h-full">
            <ItineraryTimelineSection
              {...tripData}
              items={items}
              onDeleteItem={deleteItem}
              days={days}
              onSave={handleSave}
              saving={saving}
              saveStatus={saveStatus}
              onDestinationChange={setDestination}
              onStartDateChange={setStartDate}
              onEndDateChange={setEndDate}
              editMode={editMode}
              viewMode={viewMode}
              onDeleteTrip={handleDeleteTrip}
              initialTitle={state?.title}
              initialDescription={state?.description}
            />
            <MapAndRecommendationsSection
              destination={destination}
              onAddPlace={addPlace}
              days={days}
              items={items}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
