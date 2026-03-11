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

  const inputCls = "w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-400 text-sm transition-all";

  return (
    <div className="min-h-dvh flex flex-col relative overflow-hidden" style={{ background: "linear-gradient(160deg, #f5f3ff 0%, #ede9fe 50%, #e0e7ff 100%)" }}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-violet-400 opacity-12 blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-72 h-72 rounded-full bg-purple-300 opacity-15 blur-3xl" />
        <div className="absolute -bottom-20 right-4 w-56 h-56 rounded-full bg-indigo-400 opacity-10 blur-2xl" />
      </div>

      <div className="flex flex-col items-center pt-16 pb-8 px-6 animate-fade-in">
        <div className="w-20 h-20 taxi-gradient rounded-3xl flex items-center justify-center shadow-2xl shadow-violet-400/30 mb-5">
          <span className="text-4xl">🚕</span>
        </div>
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">ТаксиЭкспресс</h1>
        <p className="text-sm text-slate-400 mt-1.5 font-medium">Быстро. Удобно. Надёжно.</p>
      </div>

      {!activeForm && (
        <div className="flex-1 flex flex-col justify-center px-5 gap-3 animate-slide-up">
          <p className="text-center text-slate-400 text-sm font-medium mb-1">Выберите, кто вы</p>
          {([
            { id: "passenger" as const, icon: "👤", title: "Пассажир", sub: "Вход по номеру телефона" },
            { id: "driver" as const, icon: "🚗", title: "Водитель", sub: "Вход по логину и паролю" },
            { id: "admin" as const, icon: "🛡️", title: "Администратор", sub: "Управление сервисом" },
          ]).map(item => (
            <button key={item.id} onClick={() => openForm(item.id)}
              className="w-full bg-white/80 backdrop-blur-sm rounded-3xl p-5 flex items-center gap-4 shadow-sm border border-violet-100 active:scale-95 transition-all hover:shadow-md hover:border-violet-200">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 text-2xl" style={{ background: "linear-gradient(135deg, #f5f3ff, #ede9fe)" }}>
                {item.icon}
              </div>
              <div className="text-left">
                <div className="font-bold text-slate-800 text-base">{item.title}</div>
                <div className="text-xs text-slate-400 mt-0.5">{item.sub}</div>
              </div>
              <Icon name="ChevronRight" size={18} className="ml-auto text-violet-300" />
            </button>
          ))}
        </div>
      )}

      {activeForm === "passenger" && (
        <div className="flex-1 flex flex-col px-5 pt-4 animate-slide-up">
          <button onClick={() => setActiveForm(null)} className="flex items-center gap-1.5 text-slate-400 text-sm mb-6 font-medium"><Icon name="ArrowLeft" size={16} /> Назад</button>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl" style={{ background: "linear-gradient(135deg, #ede9fe, #ddd6fe)" }}>👤</div>
            <h2 className="text-xl font-black text-slate-800">Вход для пассажира</h2>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5 block">Имя (необязательно)</label>
              <input type="text" placeholder="Ваше имя" value={passengerName} onChange={e => { setPassengerName(e.target.value); setError(""); }} className={inputCls} />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5 block">Номер телефона</label>
              <input type="tel" placeholder="+7 (___) ___-__-__" value={passengerPhone} onChange={e => { setPassengerPhone(e.target.value); setError(""); }} className={inputCls} />
            </div>
          </div>
          {error && <p className="text-red-400 text-sm mt-3 font-medium">{error}</p>}
          <button onClick={handlePassengerLogin} className="mt-6 w-full taxi-gradient text-white font-bold py-4 rounded-3xl shadow-lg shadow-violet-300/40 active:scale-95 transition-transform text-base">Войти</button>
        </div>
      )}

      {activeForm === "driver" && (
        <div className="flex-1 flex flex-col px-5 pt-4 animate-slide-up">
          <button onClick={() => setActiveForm(null)} className="flex items-center gap-1.5 text-slate-400 text-sm mb-6 font-medium"><Icon name="ArrowLeft" size={16} /> Назад</button>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl" style={{ background: "linear-gradient(135deg, #ede9fe, #ddd6fe)" }}>🚗</div>
            <h2 className="text-xl font-black text-slate-800">Вход для водителя</h2>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5 block">Логин</label>
              <input type="text" placeholder="Введите логин" value={driverLogin} onChange={e => { setDriverLogin(e.target.value); setError(""); }} className={inputCls} />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5 block">Пароль</label>
              <input type="password" placeholder="Введите пароль" value={driverPassword} onChange={e => { setDriverPassword(e.target.value); setError(""); }} className={inputCls} />
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-3">Данные предоставляет администратор</p>
          {error && <p className="text-red-400 text-sm mt-3 font-medium">{error}</p>}
          <button onClick={handleDriverLogin} className="mt-6 w-full taxi-gradient text-white font-bold py-4 rounded-3xl shadow-lg shadow-violet-300/40 active:scale-95 transition-transform text-base">Войти</button>
        </div>
      )}

      {activeForm === "admin" && (
        <div className="flex-1 flex flex-col px-5 pt-4 animate-slide-up">
          <button onClick={() => setActiveForm(null)} className="flex items-center gap-1.5 text-slate-400 text-sm mb-6 font-medium"><Icon name="ArrowLeft" size={16} /> Назад</button>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl" style={{ background: "linear-gradient(135deg, #ede9fe, #ddd6fe)" }}>🛡️</div>
            <h2 className="text-xl font-black text-slate-800">Вход для администратора</h2>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5 block">Пароль</label>
            <input type="password" placeholder="Введите пароль" value={adminPassword} onChange={e => { setAdminPassword(e.target.value); setError(""); }} className={inputCls} />
          </div>
          {error && <p className="text-red-400 text-sm mt-3 font-medium">{error}</p>}
          <button onClick={handleAdminLogin} className="mt-6 w-full taxi-gradient text-white font-bold py-4 rounded-3xl shadow-lg shadow-violet-300/40 active:scale-95 transition-transform text-base">Войти</button>
        </div>
      )}

      <div className="pb-8 pt-4 text-center text-xs text-slate-300">ТаксиЭкспресс © 2025</div>
    </div>
  );
}
