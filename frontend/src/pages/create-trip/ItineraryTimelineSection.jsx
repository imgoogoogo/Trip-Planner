import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import icon4 from "../main/icon-4.svg";

export const ItineraryTimelineSection = ({
  destination = "",
  startDate: initialStart = "",
  endDate: initialEnd = "",
  items = [],
  onDeleteItem,
  days: propDays,
  onSave,
  saving = false,
  saveStatus = null,
  onDestinationChange,
  onStartDateChange,
  onEndDateChange,
  editMode = false,
  viewMode = false,
  onDeleteTrip,
  initialTitle,
  initialDescription = "",
}) => {
  const [startDate, setStartDate] = useState(initialStart);
  const [endDate, setEndDate] = useState(initialEnd);

  const navigate = useNavigate();
  const deleteItem = (id) => onDeleteItem?.(id);
  const [editingTitle, setEditingTitle] = useState(false);
  const [title, setTitle] = useState(
    initialTitle ?? (destination ? `${destination} 여행 계획` : "나의 여행 계획"),
  );
  const [description, setDescription] = useState(initialDescription);

  // 나라 검색
  const [destInput, setDestInput] = useState(destination);
  const [allCountries, setAllCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loadingCountries, setLoadingCountries] = useState(false);
  const dropdownRef = useRef(null);

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
      .catch(() => {})
      .finally(() => setLoadingCountries(false));
  }, []);

  useEffect(() => {
    const q = destInput.trim();
    if (!q) { setFilteredCountries([]); setShowDropdown(false); return; }
    const lower = q.toLowerCase();
    const results = allCountries
      .filter((c) => c.nameKo.includes(q) || c.nameEn.toLowerCase().includes(lower))
      .slice(0, 7);
    setFilteredCountries(results);
    setShowDropdown(results.length > 0);
  }, [destInput, allCountries]);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setShowDropdown(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);


  const days = propDays ?? (() => {
    if (!startDate || !endDate)
      return [{ dayNum: 1, label: "Day 1", dateLabel: "" }];
    const result = [];
    const cur = new Date(startDate);
    const end = new Date(endDate);
    for (let i = 1; cur <= end; cur.setDate(cur.getDate() + 1), i++) {
      result.push({
        dayNum: i,
        label: `Day ${i}`,
        dateLabel: new Date(cur).toLocaleDateString("ko-KR", {
          month: "long",
          day: "numeric",
          weekday: "short",
        }),
      });
    }
    return result;
  })();

  return (
    <div className="relative row-[1_/_2] col-[1_/_8] w-full h-full flex flex-col items-start bg-[#f5f7f8] border-r [border-right-style:solid] border-[#e2e8f04c] overflow-hidden">
      <div className="flex flex-col w-full h-full p-8 overflow-y-auto">
      <div className="flex-col pt-0 pb-10 px-0 flex items-start relative self-stretch w-full flex-[0_0_auto]">
        <div className="justify-start gap-[18.5px] flex items-start relative self-stretch w-full flex-[0_0_auto]">
          <div className="flex flex-col items-start gap-3 relative w-full">
            <div className="flex items-center justify-between self-stretch w-full gap-4">
              {!viewMode && editingTitle ? (
                <input
                  autoFocus
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={() => setEditingTitle(false)}
                  onKeyDown={(e) => e.key === "Enter" && setEditingTitle(false)}
                  className="h-9 text-3xl font-extrabold text-slate-900 tracking-[-0.75px] leading-9 bg-transparent border-b-2 border-[#3c83f6] outline-none [font-family:'Manrope-ExtraBold',Helvetica] flex-1"
                />
              ) : (
                <div
                  onClick={() => !viewMode && setEditingTitle(true)}
                  className={`relative flex items-center h-9 [font-family:'Manrope-ExtraBold',Helvetica] font-extrabold text-slate-900 text-3xl tracking-[-0.75px] leading-9 whitespace-nowrap flex-1 min-w-0 ${!viewMode ? "cursor-text hover:text-slate-600 transition-colors" : "cursor-default"}`}
                >
                  {title}
                </div>
              )}

              {!viewMode && <div className="flex items-center gap-2 flex-shrink-0">
                {/* 나라 검색 */}
                <div ref={dropdownRef} className="relative">
                  <div className="flex items-center gap-2 px-4 py-3 bg-white rounded-2xl border border-solid border-slate-200 shadow-[0px_1px_2px_#0000000d]">
                    <span className="text-base leading-none">🌍</span>
                    <input
                      type="text"
                      value={destInput}
                      onChange={(e) => {
                        setDestInput(e.target.value);
                        onDestinationChange?.(e.target.value);
                      }}
                      onFocus={() => filteredCountries.length > 0 && setShowDropdown(true)}
                      placeholder={loadingCountries ? "로딩 중..." : "나라 또는 도시"}
                      className="text-[15px] text-gray-400 bg-transparent outline-none border-none w-28 [font-family:'Manrope-ExtraLight',Helvetica] placeholder:text-gray-300"
                    />
                  </div>
                  {showDropdown && filteredCountries.length > 0 && (
                    <div className="absolute top-[calc(100%+4px)] left-0 w-52 bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden">
                      {filteredCountries.map((country, i) => (
                        <div
                          key={i}
                          onMouseDown={() => {
                            const name = country.nameKo || country.nameEn;
                            setDestInput(name);
                            onDestinationChange?.(name);
                            setShowDropdown(false);
                          }}
                          className="px-4 py-2.5 hover:bg-blue-50 cursor-pointer flex items-center gap-2.5"
                        >
                          <span className="text-lg leading-none">{country.flag}</span>
                          <div>
                            <p className="text-[13px] font-medium text-gray-800 leading-tight">{country.nameKo || country.nameEn}</p>
                            {country.nameKo && <p className="text-[11px] text-gray-400">{country.nameEn}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 날짜 선택 */}
                <div className="flex items-center gap-2 px-4 py-3 bg-white rounded-2xl border border-solid border-slate-200 shadow-[0px_1px_2px_#0000000d]">
                  <img
                    className="relative w-[15px] h-[16.67px]"
                    alt="Icon"
                    src={icon4}
                  />
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => { setStartDate(e.target.value); onStartDateChange?.(e.target.value); }}
                    className="text-[15px] text-gray-400 bg-transparent outline-none border-none w-[130px] rounded [font-family:'Manrope-ExtraLight',Helvetica]"
                  />
                  <span className="text-gray-300 text-[15px]">→</span>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => { setEndDate(e.target.value); onEndDateChange?.(e.target.value); }}
                    className="text-[15px] text-gray-400 bg-transparent outline-none border-none w-[130px] rounded [font-family:'Manrope-ExtraLight',Helvetica]"
                  />
                </div>
              </div>}
            </div>

            {/* 여행 설명 */}
            {viewMode ? (
              description ? (
                <p className="w-full text-slate-400 text-sm [font-family:'Manrope-ExtraLight',Helvetica]">{description}</p>
              ) : null
            ) : (
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="여행에 대한 간단한 설명을 입력하세요"
                className="w-full bg-transparent outline-none border-none text-slate-400 text-sm [font-family:'Manrope-ExtraLight',Helvetica] placeholder:text-slate-300"
              />
            )}
          </div>

        </div>
      </div>

      <div className="pr-0 pt-12 pb-0 flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
        <div className="flex flex-col items-start gap-10 relative self-stretch w-full flex-[0_0_auto]">
          {days.map((day) => (
            <div
              key={day.dayNum}
              className="flex flex-col items-start gap-6 relative self-stretch w-full flex-[0_0_auto]"
            >
              {/* Day 헤더 */}
              <div className="flex items-baseline justify-between relative self-stretch w-full flex-[0_0_auto]">
                <p className="[font-family:'Manrope-ExtraBold',Helvetica] font-extrabold text-slate-900 text-xl leading-7 whitespace-nowrap">
                  {day.label}
                </p>
                {day.dateLabel && (
                  <span className="[font-family:'Manrope-Bold',Helvetica] font-bold text-slate-400 text-xs leading-4 whitespace-nowrap">
                    {day.dateLabel}
                  </span>
                )}
              </div>

              {items.filter((i) => i.dayNum === day.dayNum).length > 0 ? (
                <div className="gap-4 flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
                  {items.filter((i) => i.dayNum === day.dayNum).map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col items-start p-4 relative self-stretch w-full flex-[0_0_auto] bg-white rounded-2xl border border-solid border-transparent shadow-[0px_1px_2px_#0000000d] overflow-hidden"
                    >
                      <div className="flex items-center gap-4 relative self-stretch w-full flex-[0_0_auto]">
                        <div className="flex flex-col w-14 h-14 items-center justify-center relative bg-slate-50 rounded-xl overflow-hidden flex-shrink-0">
                          <div className="text-2xl">{item.emoji ?? "📍"}</div>
                          {item.time && (
                            <div className="relative flex items-center [font-family:'Manrope-Bold',Helvetica] font-bold text-slate-400 text-[10px] leading-[15px] whitespace-nowrap">
                              {item.time}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col items-start gap-1 relative flex-1 grow">
                          <div className="[font-family:'Manrope-Bold',Helvetica] font-bold text-slate-900 text-base leading-4">
                            {item.title}
                          </div>
                          {item.description && (
                            <div className="[font-family:'Manrope-Medium',Helvetica] font-medium text-slate-500 text-sm leading-5">
                              {item.description}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-4 flex-shrink-0">
                          <div className={`inline-flex px-2 py-0.5 ${item.tagBg ?? "bg-blue-50"} rounded-full`}>
                            <span className={`[font-family:'Manrope-Bold',Helvetica] font-bold ${item.tagText ?? "text-[#3c83f6]"} text-[10px] leading-[15px] whitespace-nowrap`}>
                              {item.tag ?? item.categoryLabel}
                            </span>
                          </div>
                          {!viewMode && (
                            <button
                              onClick={() => deleteItem(item.id)}
                              className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-red-50 transition-colors group"
                            >
                              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                <path
                                  d="M1 1l10 10M11 1L1 11"
                                  stroke="#cbd5e1"
                                  strokeWidth="1.8"
                                  strokeLinecap="round"
                                  className="group-hover:stroke-red-400"
                                />
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center w-full py-6 rounded-2xl border-2 border-dashed border-slate-200">
                  <span className="[font-family:'Manrope-ExtraLight',Helvetica] font-extralight text-slate-400 text-sm">
                    + 지도에서 장소를 추가하세요
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 저장 / 취소 / 삭제 버튼 */}
        {viewMode ? (
          <div className="w-full pt-10 pb-6">
            <button
              onClick={() => navigate("/main")}
              className="w-full py-3.5 rounded-2xl text-sm font-semibold border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 transition-all [font-family:'Manrope-ExtraLight',Helvetica]"
            >
              돌아가기
            </button>
          </div>
        ) : (
        <div className="flex flex-col gap-2 w-full pt-10 pb-6">
          <div className="flex gap-3 w-full">
            <button
              onClick={() => navigate("/main")}
              className="flex-1 py-3.5 rounded-2xl text-sm font-semibold border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 transition-all [font-family:'Manrope-ExtraLight',Helvetica]"
            >
              취소
            </button>
            {editMode && (
              <button
                onClick={() => onDeleteTrip?.()}
                className="flex-1 py-3.5 rounded-2xl text-sm font-semibold border border-red-100 bg-white text-red-400 hover:bg-red-50 transition-all [font-family:'Manrope-ExtraLight',Helvetica]"
              >
                일정 삭제
              </button>
            )}
            <button
              onClick={() => onSave?.({ title, description })}
              disabled={saving || items.length === 0}
              className={`flex-[2] py-3.5 rounded-2xl text-sm font-semibold transition-all [font-family:'Manrope-ExtraLight',Helvetica]
                ${saveStatus === "success"
                  ? "bg-green-50 text-green-600 cursor-default"
                  : saving
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                    : items.length === 0
                      ? "bg-slate-100 text-slate-300 cursor-not-allowed"
                      : "bg-[#3c83f6] hover:bg-[#2563eb] text-white"
                }`}
            >
              {saveStatus === "success" ? "✓ 저장 완료" : saving ? "저장 중..." : editMode ? "수정 저장" : "일정 저장"}
            </button>
          </div>
          {saveStatus === "error" && (
            <p className="text-red-400 text-xs text-center [font-family:'Manrope-ExtraLight',Helvetica]">
              저장에 실패했습니다. 다시 시도해주세요.
            </p>
          )}
        </div>
        )}
      </div>
      </div>
    </div>
  );
};
