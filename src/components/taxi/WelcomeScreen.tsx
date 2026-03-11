import { useState } from "react";
import { UserRole } from "@/pages/Index";
import Icon from "@/components/ui/icon";
import TaxiLogo from "./TaxiLogo";

interface Props {
  onLogin: (role: UserRole, name?: string) => void;
}

export default function WelcomeScreen({ onLogin }: Props) {
  const [passengerPhone, setPassengerPhone] = useState("");
  const [passengerName, setPassengerName] = useState("");
  const [driverLogin, setDriverLogin] = useState("");
  const [driverPassword, setDriverPassword] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [activeForm, setActiveForm] = useState<"passenger" | "driver" | "admin" | null>(null);
  const [error, setError] = useState("");

  const ADMIN_PASSWORD = "admin123";
  const DRIVERS: Record<string, { password: string; name: string }> = {
    "driver1": { password: "pass1", name: "Алексей Петров" },
    "driver2": { password: "pass2", name: "Иван Сидоров" },
  };

  const handlePassengerLogin = () => {
    if (!passengerPhone || passengerPhone.length < 10) { setError("Введите корректный номер телефона"); return; }
    onLogin("passenger", passengerName || "Пассажир");
  };
  const handleDriverLogin = () => {
    const driver = DRIVERS[driverLogin];
    if (!driver || driver.password !== driverPassword) { setError("Неверный логин или пароль"); return; }
    onLogin("driver", driver.name);
  };
  const handleAdminLogin = () => {
    if (adminPassword !== ADMIN_PASSWORD) { setError("Неверный пароль администратора"); return; }
    onLogin("admin");
  };
  const openForm = (form: "passenger" | "driver" | "admin") => { setActiveForm(form); setError(""); };

  const inputCls = "w-full bg-white border border-[#e6ebf1] rounded-2xl px-4 py-3.5 text-[#17212b] placeholder-[#a0adb8] focus:outline-none focus:border-[#2AABEE] focus:ring-2 focus:ring-[#2AABEE]/20 text-[15px] transition-all";
  const btnPrimary = "w-full tg-gradient text-white font-semibold py-3.5 rounded-2xl shadow-md shadow-[#2AABEE]/30 active:scale-95 transition-all text-[15px] tracking-wide";

  return (
    <div className="min-h-dvh flex flex-col" style={{ background: "linear-gradient(170deg, #2AABEE 0%, #006aad 38%, #f1f3f4 38%)" }}>

      {/* Hero top */}
      <div className="flex flex-col items-center pt-12 pb-6 px-6">
        <div className="drop-shadow-2xl animate-scale-in">
          <TaxiLogo size={110} />
        </div>
        <h1 className="text-2xl font-black text-white mt-3 tracking-tight drop-shadow-md">
          Алло Антипиха
        </h1>
        <p className="text-[13px] text-white/80 mt-1 font-medium tracking-wide">Такси · быстро и надёжно</p>
      </div>

      {/* Card */}
      <div className="flex-1 bg-[#f1f3f4] rounded-t-[2rem] px-5 pt-6 pb-8 animate-slide-up">

        {!activeForm && (
          <div className="space-y-3">
            <p className="text-[13px] font-semibold text-[#708499] uppercase tracking-wider mb-4 text-center">Войдите как</p>

            {([
              { id: "passenger" as const, icon: "👤", title: "Пассажир", sub: "Вход по номеру телефона" },
              { id: "driver" as const, icon: "🚗", title: "Водитель", sub: "Вход по логину и паролю" },
              { id: "admin" as const, icon: "🛡️", title: "Администратор", sub: "Управление сервисом" },
            ]).map(item => (
              <button key={item.id} onClick={() => openForm(item.id)}
                className="w-full bg-white rounded-2xl p-4 flex items-center gap-4 border border-[#e6ebf1] active:scale-[0.98] transition-all hover:border-[#2AABEE]/40 hover:shadow-sm">
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 text-2xl"
                  style={{ background: "linear-gradient(135deg, #e8f6fd, #c5e9f9)" }}>
                  {item.icon}
                </div>
                <div className="text-left flex-1">
                  <div className="font-semibold text-[#17212b] text-[15px]">{item.title}</div>
                  <div className="text-[12px] text-[#708499] mt-0.5">{item.sub}</div>
                </div>
                <Icon name="ChevronRight" size={16} className="text-[#c5d0dc]" />
              </button>
            ))}
          </div>
        )}

        {activeForm === "passenger" && (
          <div className="animate-slide-up">
            <button onClick={() => setActiveForm(null)} className="flex items-center gap-1.5 text-[#2AABEE] text-[14px] mb-5 font-semibold">
              <Icon name="ArrowLeft" size={16} /> Назад
            </button>
            <h2 className="text-[18px] font-black text-[#17212b] mb-5">Вход для пассажира</h2>
            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-[#708499] uppercase tracking-wider mb-1.5 block">Имя (необязательно)</label>
                <input type="text" placeholder="Ваше имя" value={passengerName} onChange={e => { setPassengerName(e.target.value); setError(""); }} className={inputCls} />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-[#708499] uppercase tracking-wider mb-1.5 block">Номер телефона</label>
                <input type="tel" placeholder="+7 (___) ___-__-__" value={passengerPhone} onChange={e => { setPassengerPhone(e.target.value); setError(""); }} className={inputCls} />
              </div>
            </div>
            {error && <p className="text-red-500 text-[13px] mt-3 font-medium">{error}</p>}
            <button onClick={handlePassengerLogin} className={btnPrimary + " mt-5"}>Войти</button>
          </div>
        )}

        {activeForm === "driver" && (
          <div className="animate-slide-up">
            <button onClick={() => setActiveForm(null)} className="flex items-center gap-1.5 text-[#2AABEE] text-[14px] mb-5 font-semibold">
              <Icon name="ArrowLeft" size={16} /> Назад
            </button>
            <h2 className="text-[18px] font-black text-[#17212b] mb-5">Вход для водителя</h2>
            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-[#708499] uppercase tracking-wider mb-1.5 block">Логин</label>
                <input type="text" placeholder="Введите логин" value={driverLogin} onChange={e => { setDriverLogin(e.target.value); setError(""); }} className={inputCls} />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-[#708499] uppercase tracking-wider mb-1.5 block">Пароль</label>
                <input type="password" placeholder="Введите пароль" value={driverPassword} onChange={e => { setDriverPassword(e.target.value); setError(""); }} className={inputCls} />
              </div>
            </div>
            <p className="text-[12px] text-[#708499] mt-2">Данные предоставляет администратор</p>
            {error && <p className="text-red-500 text-[13px] mt-3 font-medium">{error}</p>}
            <button onClick={handleDriverLogin} className={btnPrimary + " mt-5"}>Войти</button>
          </div>
        )}

        {activeForm === "admin" && (
          <div className="animate-slide-up">
            <button onClick={() => setActiveForm(null)} className="flex items-center gap-1.5 text-[#2AABEE] text-[14px] mb-5 font-semibold">
              <Icon name="ArrowLeft" size={16} /> Назад
            </button>
            <h2 className="text-[18px] font-black text-[#17212b] mb-5">Вход администратора</h2>
            <div>
              <label className="text-[11px] font-semibold text-[#708499] uppercase tracking-wider mb-1.5 block">Пароль</label>
              <input type="password" placeholder="Введите пароль" value={adminPassword} onChange={e => { setAdminPassword(e.target.value); setError(""); }} className={inputCls} />
            </div>
            {error && <p className="text-red-500 text-[13px] mt-3 font-medium">{error}</p>}
            <button onClick={handleAdminLogin} className={btnPrimary + " mt-5"}>Войти</button>
          </div>
        )}

        <p className="text-center text-[11px] text-[#a0adb8] mt-8">Алло Антипиха © 2025</p>
      </div>
    </div>
  );
}
