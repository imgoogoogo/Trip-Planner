import { useState } from "react";
import { SidebarNavigationSection } from "./SidebarNavigationSection.jsx";
import { DashboardSection } from "./DashboardSection.jsx";
import { MyTripsSection } from "./MyTripsSection.jsx";

export const Main = () => {
  const [activeNav, setActiveNav] = useState("dashboard");

  return (
    <div className="flex flex-col items-start relative bg-[#f5f7f8] h-screen">
      <div className="flex h-full items-start relative self-stretch w-full">
        <SidebarNavigationSection
          activeNav={activeNav}
          setActiveNav={setActiveNav}
        />
        {activeNav === "dashboard" ? <DashboardSection /> : <MyTripsSection />}
      </div>
    </div>
  );
};
