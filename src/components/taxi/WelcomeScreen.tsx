import { useState } from "react";
import { UserRole } from "@/pages/Index";
import Icon from "@/components/ui/icon";

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

  const inputCls = "w-full bg-white border rounded-2xl px-4 py-3.5 text-[#1a1a1a] placeholder-[#bbb] focus:outline-none text-[15px] transition-all"
    + " focus:border-[#009688] focus:ring-2 focus:ring-[#009688]/15";
  const btnPrimary = "w-full font-semibold py-3.5 rounded-2xl text-[15px] text-white active:scale-95 transition-all";

  return (
    <div className="min-h-dvh flex flex-col" style={{ background: "#f0f0f0" }}>
      {/* Dark header block */}
      <div className="flex flex-col items-center pt-16 pb-10 px-6" style={{ background: "#2e3440" }}>
        <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-4 text-4xl" style={{ background: "rgba(255,255,255,0.12)" }}>
          🚖
        </div>
        <h1 className="text-2xl font-black text-white tracking-tight">Алло Антипиха</h1>
        <p className="text-[13px] mt-1.5 font-medium" style={{ color: "rgba(255,255,255,0.55)" }}>Такси · быстро и надёжно</p>
      </div>

      {/* White card */}
      <div className="flex-1 rounded-t-[2rem] px-5 pt-6 pb-8 animate-slide-up" style={{ background: "#fff" }}>
        {!activeForm && (
          <div className="space-y-3">
            <p className="text-[13px] font-semibold uppercase tracking-wider mb-4 text-center" style={{ color: "#bbb" }}>Войдите как</p>
            {([
              { id: "passenger" as const, icon: "👤", title: "Пассажир", sub: "Вызвать такси" },
              { id: "driver" as const, icon: "🚗", title: "Водитель", sub: "Работать с заказами" },
              { id: "admin" as const, icon: "🛡️", title: "Администратор", sub: "Управление сервисом" },
            ]).map(item => (
              <button key={item.id} onClick={() => openForm(item.id)}
                className="w-full bg-white rounded-2xl p-4 flex items-center gap-4 active:scale-[0.98] transition-all"
                style={{ border: "1px solid #e8e8e8" }}>
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 text-2xl" style={{ background: "#f0f0f0" }}>
                  {item.icon}
                </div>
                <div className="text-left flex-1">
                  <div className="font-semibold text-[15px]" style={{ color: "#1a1a1a" }}>{item.title}</div>
                  <div className="text-[12px] mt-0.5" style={{ color: "#888" }}>{item.sub}</div>
                </div>
                <Icon name="ChevronRight" size={16} style={{ color: "#ccc" } as React.CSSProperties} />
              </button>
            ))}
          </div>
        )}

        {activeForm === "passenger" && (
          <div className="animate-slide-up">
            <button onClick={() => setActiveForm(null)} className="flex items-center gap-1.5 text-[14px] mb-5 font-semibold" style={{ color: "#009688" }}>
              <Icon name="ArrowLeft" size={16} /> Назад
            </button>
            <h2 className="text-[18px] font-black mb-5" style={{ color: "#1a1a1a" }}>Вход для пассажира</h2>
            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider mb-1.5 block" style={{ color: "#888" }}>Имя (необязательно)</label>
                <input type="text" placeholder="Ваше имя" value={passengerName} onChange={e => { setPassengerName(e.target.value); setError(""); }} className={inputCls} style={{ borderColor: "#e8e8e8" }} />
              </div>
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider mb-1.5 block" style={{ color: "#888" }}>Номер телефона</label>
                <input type="tel" placeholder="+7 (___) ___-__-__" value={passengerPhone} onChange={e => { setPassengerPhone(e.target.value); setError(""); }} className={inputCls} style={{ borderColor: "#e8e8e8" }} />
              </div>
            </div>
            {error && <p className="text-red-500 text-[13px] mt-3 font-medium">{error}</p>}
            <button onClick={handlePassengerLogin} className={btnPrimary + " mt-5"} style={{ background: "#009688" }}>Войти</button>
          </div>
        )}

        {activeForm === "driver" && (
          <div className="animate-slide-up">
            <button onClick={() => setActiveForm(null)} className="flex items-center gap-1.5 text-[14px] mb-5 font-semibold" style={{ color: "#009688" }}>
              <Icon name="ArrowLeft" size={16} /> Назад
            </button>
            <h2 className="text-[18px] font-black mb-5" style={{ color: "#1a1a1a" }}>Вход для водителя</h2>
            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider mb-1.5 block" style={{ color: "#888" }}>Логин</label>
                <input type="text" placeholder="Введите логин" value={driverLogin} onChange={e => { setDriverLogin(e.target.value); setError(""); }} className={inputCls} style={{ borderColor: "#e8e8e8" }} />
              </div>
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider mb-1.5 block" style={{ color: "#888" }}>Пароль</label>
                <input type="password" placeholder="Введите пароль" value={driverPassword} onChange={e => { setDriverPassword(e.target.value); setError(""); }} className={inputCls} style={{ borderColor: "#e8e8e8" }} />
              </div>
            </div>
            <p className="text-[12px] mt-2" style={{ color: "#bbb" }}>Данные предоставляет администратор</p>
            {error && <p className="text-red-500 text-[13px] mt-3 font-medium">{error}</p>}
            <button onClick={handleDriverLogin} className={btnPrimary + " mt-5"} style={{ background: "#009688" }}>Войти</button>
          </div>
        )}

        {activeForm === "admin" && (
          <div className="animate-slide-up">
            <button onClick={() => setActiveForm(null)} className="flex items-center gap-1.5 text-[14px] mb-5 font-semibold" style={{ color: "#009688" }}>
              <Icon name="ArrowLeft" size={16} /> Назад
            </button>
            <h2 className="text-[18px] font-black mb-5" style={{ color: "#1a1a1a" }}>Вход администратора</h2>
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider mb-1.5 block" style={{ color: "#888" }}>Пароль</label>
              <input type="password" placeholder="Введите пароль" value={adminPassword} onChange={e => { setAdminPassword(e.target.value); setError(""); }} className={inputCls} style={{ borderColor: "#e8e8e8" }} />
            </div>
            {error && <p className="text-red-500 text-[13px] mt-3 font-medium">{error}</p>}
            <button onClick={handleAdminLogin} className={btnPrimary + " mt-5"} style={{ background: "#009688" }}>Войти</button>
          </div>
        )}

        <p className="text-center text-[11px] mt-8" style={{ color: "#ccc" }}>Алло Антипиха © 2025</p>
      </div>
    </div>
  );
}