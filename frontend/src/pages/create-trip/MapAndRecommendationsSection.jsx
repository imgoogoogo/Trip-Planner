import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import icon2 from "../main/icon-2.svg";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const createNumberedIcon = (number) =>
  L.divIcon({
    className: "",
    html: `<div style="
      width:32px;height:32px;border-radius:50%;
      background:#3c83f6;border:2px solid white;
      display:flex;align-items:center;justify-content:center;
      color:white;font-weight:800;font-size:14px;
      box-shadow:0 4px 6px rgba(0,0,0,0.15);
    ">${number}</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -20],
  });

const createCategoryIcon = (emoji, selected) =>
  L.divIcon({
    className: "",
    html: `<div style="
      width:34px;height:34px;border-radius:50%;
      background:${selected ? "#3c83f6" : "white"};
      border:2px solid ${selected ? "#2563eb" : "#3c83f6"};
      display:flex;align-items:center;justify-content:center;
      font-size:15px;
      box-shadow:0 2px 6px rgba(0,0,0,0.2);
      transition:all 0.15s;
    ">${emoji}</div>`,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -20],
  });

const createLocationIcon = () =>
  L.divIcon({
    className: "",
    html: `<div style="
      width:16px;height:16px;border-radius:50%;
      background:#3c83f6;border:3px solid white;
      box-shadow:0 0 0 3px rgba(60,131,246,0.3);
    "></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });

const CATEGORIES = [
  { id: "cafe", label: "카페", emoji: "☕", amenity: "cafe" },
  { id: "restaurant", label: "식당", emoji: "🍽", amenity: "restaurant" },
  { id: "hotel", label: "숙소", emoji: "🏨", amenity: "hotel" },
  { id: "pharmacy", label: "약국", emoji: "💊", amenity: "pharmacy" },
];

const DEFAULT_CENTER = [33.4996, 126.5312];


const MapController = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (center) map.flyTo(center, zoom ?? map.getZoom(), { duration: 1.2 });
  }, [center, zoom, map]);
  return null;
};

const ResizeMap = () => {
  const map = useMap();
  useEffect(() => {
    map.invalidateSize();
  }, [map]);
  return null;
};

const MapRefCapture = ({ mapRef }) => {
  const map = useMap();
  useEffect(() => {
    mapRef.current = map;
  }, [map, mapRef]);
  return null;
};

// 장소 정보 패널 (카카오맵 스타일)
const PlaceInfoPanel = ({ place, onClose, onAdd, days = [], items = [] }) => {
  const [selectedDay, setSelectedDay] = useState(1);

  useEffect(() => {
    setSelectedDay(1);
  }, [place?.id]);

  if (!place) return null;

  const added = items.some((i) => i.id === place.id);

  const tags = place.tags ?? {};
  const address =
    [tags["addr:street"], tags["addr:housenumber"], tags["addr:city"]]
      .filter(Boolean)
      .join(" ") ||
    tags["addr:full"] ||
    null;
  const phone = tags.phone || tags["contact:phone"] || null;
  const website = tags.website || tags["contact:website"] || null;
  const hours = tags.opening_hours || null;
  const cuisine = tags.cuisine?.replace(/;/g, " · ") || null;

  const handleAdd = () => {
    if (!added) onAdd(place, selectedDay);
  };

  return (
    <div className="absolute bottom-0 left-0 w-full z-[1100] animate-[slideUp_0.22s_cubic-bezier(0.4,0,0.2,1)]">
      <style>{`@keyframes slideUp{from{transform:translateY(100%);opacity:0}to{transform:translateY(0);opacity:1}}`}</style>
      <div className="bg-white rounded-[24px_24px_0_0] shadow-[0px_-4px_24px_rgba(0,0,0,0.13)]">
        {/* 핸들바 */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-9 h-1 bg-slate-200 rounded-full" />
        </div>

        {/* 헤더 */}
        <div className="flex items-start justify-between px-5 pt-3 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-2xl flex-shrink-0">
              {place.emoji ?? "📍"}
            </div>
            <div>
              <h3 className="text-slate-900 text-[15px] font-bold leading-5 [font-family:'Manrope-ExtraLight',Helvetica]">
                {place.name}
              </h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="inline-flex px-2 py-0.5 bg-blue-50 rounded-full text-[#3c83f6] text-[10px] font-bold [font-family:'Manrope-ExtraLight',Helvetica]">
                  {place.categoryLabel ?? "장소"}
                </span>
                {cuisine && (
                  <span className="text-slate-400 text-[10px] [font-family:'Manrope-ExtraLight',Helvetica]">
                    {cuisine}
                  </span>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 transition-colors flex-shrink-0"
          >
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
              <path
                d="M1 1l10 10M11 1L1 11"
                stroke="#94a3b8"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* 상세 정보 */}
        <div className="px-5 py-3 flex flex-col gap-2.5">
          {address && (
            <div className="flex items-start gap-2.5">
              <svg
                className="w-[14px] h-[14px] text-slate-400 mt-0.5 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span className="text-slate-600 text-xs leading-[18px] [font-family:'Manrope-ExtraLight',Helvetica]">
                {address}
              </span>
            </div>
          )}
          {hours && (
            <div className="flex items-start gap-2.5">
              <svg
                className="w-[14px] h-[14px] text-slate-400 mt-0.5 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <circle cx="12" cy="12" r="10" />
                <path strokeLinecap="round" d="M12 6v6l4 2" />
              </svg>
              <span className="text-slate-600 text-xs leading-[18px] [font-family:'Manrope-ExtraLight',Helvetica]">
                {hours}
              </span>
            </div>
          )}
          {phone && (
            <div className="flex items-center gap-2.5">
              <svg
                className="w-[14px] h-[14px] text-slate-400 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              <span className="text-slate-600 text-xs [font-family:'Manrope-ExtraLight',Helvetica]">
                {phone}
              </span>
            </div>
          )}
          {website && (
            <div className="flex items-center gap-2.5">
              <svg
                className="w-[14px] h-[14px] text-slate-400 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                />
              </svg>
              <a
                href={website}
                target="_blank"
                rel="noreferrer"
                className="text-[#3c83f6] text-xs truncate max-w-[180px] [font-family:'Manrope-ExtraLight',Helvetica]"
              >
                {website}
              </a>
            </div>
          )}
          {!address && !hours && !phone && !website && (
            <p className="text-slate-400 text-xs [font-family:'Manrope-ExtraLight',Helvetica]">
              상세 정보가 없습니다.
            </p>
          )}
        </div>

        {/* Day 선택 */}
        {days.length > 1 && !added && (
          <div className="px-5 pt-1 pb-2">
            <p className="text-slate-400 text-[10px] mb-2 [font-family:'Manrope-Medium',Helvetica]">추가할 날짜 선택</p>
            <div className="flex gap-1.5 flex-wrap">
              {days.map((d) => (
                <button
                  key={d.dayNum}
                  onClick={() => setSelectedDay(d.dayNum)}
                  className={`px-3 py-1 rounded-full text-xs border transition-all [font-family:'Manrope-Medium',Helvetica]
                    ${selectedDay === d.dayNum
                      ? "bg-[#3c83f6] text-white border-[#3c83f6]"
                      : "bg-white text-slate-500 border-slate-200 hover:border-[#3c83f6] hover:text-[#3c83f6]"
                    }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 일정에 추가 버튼 */}
        <div className="px-5 pb-6 pt-2">
          <button
            onClick={handleAdd}
            disabled={added}
            className={`w-full py-3 rounded-2xl text-sm font-medium transition-all [font-family:'Manrope-ExtraLight',Helvetica]
              ${
                added
                  ? "bg-green-50 text-green-600 cursor-default"
                  : "bg-[#3c83f6] hover:bg-[#2563eb] text-white"
              }`}
          >
            {added ? "✓ 일정에 추가됨" : `+ Day ${selectedDay}에 추가`}
          </button>
        </div>
      </div>
    </div>
  );
};

const NOMINATIM = "https://nominatim.openstreetmap.org/search";

export const MapAndRecommendationsSection = ({
  destination = "",
  onAddPlace,
  days = [],
  items = [],
}) => {
  const mapRef = useRef(null);
  const [flyTarget, setFlyTarget] = useState(null);
  const [flyZoom, setFlyZoom] = useState(undefined);
  const [mapZoom, setMapZoom] = useState(12);
  const [mapCenter, setMapCenter] = useState(DEFAULT_CENTER);
  const [userLocation, setUserLocation] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [markerCache, setMarkerCache] = useState({});
  const [loadingCategoryId, setLoadingCategoryId] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchMarkers, setSearchMarkers] = useState(null);
  const [searchCenter, setSearchCenter] = useState(null);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const itemsInitialized = useRef(false);

  // 편집/조회 모드: items가 처음 로드됐을 때 마커 1번 위치로 이동
  useEffect(() => {
    if (itemsInitialized.current) return;
    if (items.length === 0) return;
    const sorted = [...items]
      .filter((i) => i.lat && i.lng)
      .sort((a, b) => a.dayNum - b.dayNum);
    if (sorted.length === 0) return;
    const first = sorted[0];
    setFlyTarget([first.lat, first.lng]);
    setFlyZoom(14);
    itemsInitialized.current = true;
  }, [items]);

  // 목적지 → 좌표 변환 (Nominatim)
  useEffect(() => {
    if (!destination) return;
    fetch(
      `${NOMINATIM}?q=${encodeURIComponent(destination)}&format=json&limit=1`,
      { headers: { "Accept-Language": "ko" } },
    )
      .then((r) => r.json())
      .then((data) => {
        if (data.length > 0) {
          const center = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
          const zoom = data[0].type === "country" ? 6 : 12;
          setMapCenter(center);
          setFlyTarget(center);
          setFlyZoom(zoom);
          setMapZoom(zoom);
          setMarkerCache({});
        }
      })
      .catch(() => {});
  }, [destination]);

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = [pos.coords.latitude, pos.coords.longitude];
        setUserLocation(loc);
        setMapCenter(loc);
        setFlyTarget(loc);
        setFlyZoom(undefined);
        setMarkerCache({});
      },
      () => alert("위치 정보를 가져올 수 없습니다."),
    );
  };

  // 카테고리 클릭: 캐시 없으면 fetch, 있으면 바로 필터
  const handleCategory = async (cat) => {
    if (activeCategory === cat.id) {
      setActiveCategory(null);
      setSelectedPlace(null);
      setSearchCenter(null);
      return;
    }

    setActiveCategory(cat.id);
    setSelectedPlace(null);
    setSearchMarkers(null);

    const center = mapRef.current
      ? [mapRef.current.getCenter().lat, mapRef.current.getCenter().lng]
      : mapCenter;
    setSearchCenter(center);

    if (markerCache[cat.id]) return;

    setLoadingCategoryId(cat.id);
    const [lat, lng] = center;
    const delta = 0.018;
    const viewbox = `${lng - delta},${lat + delta},${lng + delta},${lat - delta}`;

    try {
      const res = await fetch(
        `${NOMINATIM}?amenity=${cat.amenity}&format=json&limit=25&bounded=1&viewbox=${viewbox}`,
        { headers: { "Accept-Language": "ko" } },
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const markers = data.map((item) => ({
        id: item.place_id,
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon),
        name: item.display_name.split(",")[0],
        emoji: cat.emoji,
        categoryLabel: cat.label,
        categoryId: cat.id,
        tags: { "addr:full": item.display_name },
      }));
      setMarkerCache((prev) => ({ ...prev, [cat.id]: markers }));
    } catch (err) {
      console.error(`${cat.label} 마커 로딩 실패:`, err);
      setMarkerCache((prev) => ({ ...prev, [cat.id]: [] }));
    } finally {
      setLoadingCategoryId(null);
    }
  };

  // 표시할 마커: 카테고리 선택 시 해당 것만, 없으면 캐시된 전체
  const addedIds = new Set(items.map((i) => i.id));

  const displayedMarkers = (
    searchMarkers !== null
      ? searchMarkers
      : activeCategory
        ? (markerCache[activeCategory] ?? [])
        : Object.values(markerCache).flat()
  ).filter((m) => !addedIds.has(m.id));

  // 번호 마커: day별 순서 (전체 번호 1부터)
  const itineraryMapMarkers = [...items]
    .filter((i) => i.lat && i.lng)
    .sort((a, b) => a.dayNum - b.dayNum)
    .map((item, idx) => ({ ...item, number: idx + 1 }));

  const handleMarkerClick = (place) => {
    setSelectedPlace(place);
    setFlyTarget([place.lat, place.lng]);
    setFlyZoom(undefined);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;

    setLoadingSearch(true);
    setSearchMarkers([]);
    setActiveCategory(null);
    setSelectedPlace(null);

    const center = mapRef.current
      ? [mapRef.current.getCenter().lat, mapRef.current.getCenter().lng]
      : mapCenter;
    const [lat, lng] = center;
    setSearchCenter(center);

    // viewbox: 현재 지도 중심 기준 약 2km 범위
    const delta = 0.018;
    const viewbox = `${lng - delta},${lat + delta},${lng + delta},${lat - delta}`;

    try {
      const res = await fetch(
        `${NOMINATIM}?q=${encodeURIComponent(q)}&format=json&limit=20&bounded=1&viewbox=${viewbox}`,
        { headers: { "Accept-Language": "ko" } },
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const markers = data.map((item) => ({
        id: item.place_id,
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon),
        name: item.display_name.split(",")[0],
        emoji: "🔍",
        categoryLabel: item.type || item.class || "검색결과",
        tags: { "addr:full": item.display_name },
      }));
      setSearchMarkers(markers);
      if (markers.length > 0) {
        setFlyTarget([markers[0].lat, markers[0].lng]);
        setFlyZoom(undefined);
      }
    } catch (err) {
      console.error("검색 실패:", err);
      setSearchMarkers([]);
    } finally {
      setLoadingSearch(false);
    }
  };

  const handleAddToTrip = (place, dayNum) => {
    onAddPlace?.(place, dayNum);
    setSelectedPlace(null);
  };

  return (
    <div className="relative row-[1_/_2] col-[8_/_13] w-full h-full flex flex-col items-start justify-center bg-slate-100 overflow-hidden">
      {/* 지도 */}
      <div className="relative flex-1 self-stretch w-full grow overflow-hidden">
        <MapContainer
          center={DEFAULT_CENTER}
          zoom={mapZoom}
          style={{ width: "100%", height: "100%" }}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* 현재 위치 마커 */}
          {userLocation && (
            <Marker position={userLocation} icon={createLocationIcon()} />
          )}

          {/* 검색 반경 원 */}
          {searchCenter && (
            <Circle
              center={searchCenter}
              radius={2000}
              pathOptions={{
                color: "#3c83f6",
                weight: 1.5,
                dashArray: "6 6",
                fillColor: "#3c83f6",
                fillOpacity: 0.04,
              }}
            />
          )}

          {/* 일정 추가된 번호 마커 */}
          {itineraryMapMarkers.map((m) => (
            <Marker
              key={`itinerary-${m.id}`}
              position={[m.lat, m.lng]}
              icon={createNumberedIcon(m.number)}
              eventHandlers={{ click: () => handleMarkerClick(m) }}
            />
          ))}

          {/* 카테고리 마커 */}
          {displayedMarkers.map((m) => (
            <Marker
              key={m.id}
              position={[m.lat, m.lng]}
              icon={createCategoryIcon(m.emoji, selectedPlace?.id === m.id)}
              eventHandlers={{ click: () => handleMarkerClick(m) }}
            />
          ))}

          <MapController center={flyTarget} zoom={flyZoom} />
          <ResizeMap />
          <MapRefCapture mapRef={mapRef} />
        </MapContainer>

        {/* 현재 위치 버튼 */}
        <button
          onClick={handleCurrentLocation}
          className="absolute bottom-6 right-4 z-[1000] w-10 h-10 bg-white rounded-full shadow-[0px_4px_12px_rgba(0,0,0,0.15)] flex items-center justify-center hover:bg-slate-50 transition-colors"
          title="현재 위치"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#3c83f6"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="3" />
            <line x1="12" y1="2" x2="12" y2="6" />
            <line x1="12" y1="18" x2="12" y2="22" />
            <line x1="2" y1="12" x2="6" y2="12" />
            <line x1="18" y1="12" x2="22" y2="12" />
          </svg>
        </button>

        {/* 장소 정보 패널 */}
        <PlaceInfoPanel
          place={selectedPlace}
          onClose={() => setSelectedPlace(null)}
          onAdd={handleAddToTrip}
          days={days}
          items={items}
        />
      </div>

      {/* 검색창 + 카테고리 버튼 */}
      <div className="flex flex-col gap-3 w-[calc(100%_-_48px)] items-start absolute top-6 left-6 z-[1000]">
        <form
          onSubmit={handleSearch}
          className="flex items-center pl-12 pr-4 pt-3.5 pb-[15px] relative self-stretch w-full flex-[0_0_auto] bg-white rounded-2xl overflow-hidden shadow-[0px_4px_6px_-4px_#0000001a,0px_10px_15px_-3px_#0000001a,0px_0px_0px_1px_#e2e8f0]"
        >
          <input
            className="relative grow border-[none] [background:none] self-stretch mt-[-1.00px] [font-family:'Manrope-Medium',Helvetica] font-medium text-gray-500 text-sm tracking-[0] leading-[normal] p-0 outline-none"
            placeholder="장소 검색 (예: 닭도리탕, 카페)"
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (!e.target.value.trim()) {
                setSearchMarkers(null);
                setSearchCenter(null);
              }
            }}
          />
          <div className="inline-flex flex-col h-[50.00%] items-start absolute top-[25.00%] left-4">
            {loadingSearch ? (
              <span className="w-[18px] h-[18px] border-2 border-slate-300 border-t-[#3c83f6] rounded-full animate-spin" />
            ) : (
              <button
                type="submit"
                className="p-0 bg-transparent border-none cursor-pointer"
              >
                <img
                  className="relative w-[18px] h-[18px]"
                  alt="Icon"
                  src={icon2}
                />
              </button>
            )}
          </div>
        </form>

        <div className="flex items-center gap-2 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategory(cat)}
              disabled={loadingCategoryId === cat.id}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs shadow-sm transition-all border cursor-pointer
                ${
                  activeCategory === cat.id
                    ? "bg-[#3c83f6] text-white border-[#3c83f6]"
                    : "bg-white text-slate-600 border-slate-200 hover:border-[#3c83f6] hover:text-[#3c83f6]"
                } [font-family:'Manrope-Medium',Helvetica]`}
            >
              <span>{cat.emoji}</span>
              <span>{cat.label}</span>
              {loadingCategoryId === cat.id && (
                <span className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin ml-1" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
