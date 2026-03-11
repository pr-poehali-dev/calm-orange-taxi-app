import { useState } from "react";
import WelcomeScreen from "@/components/taxi/WelcomeScreen";
import PassengerApp from "@/components/taxi/PassengerApp";
import DriverApp from "@/components/taxi/DriverApp";
import AdminApp from "@/components/taxi/AdminApp";

export type UserRole = "welcome" | "passenger" | "driver" | "admin";

export default function Index() {
  const [role, setRole] = useState<UserRole>("welcome");
  const [userName, setUserName] = useState("");

  const handleLogin = (selectedRole: UserRole, name?: string) => {
    if (name) setUserName(name);
    setRole(selectedRole);
  };

  const handleLogout = () => {
    setRole("welcome");
    setUserName("");
  };

  return (
    <div className="mobile-container bg-[var(--orange-50)]">
      {role === "welcome" && <WelcomeScreen onLogin={handleLogin} />}
      {role === "passenger" && <PassengerApp userName={userName} onLogout={handleLogout} />}
      {role === "driver" && <DriverApp userName={userName} onLogout={handleLogout} />}
      {role === "admin" && <AdminApp onLogout={handleLogout} />}
    </div>
  );
}
