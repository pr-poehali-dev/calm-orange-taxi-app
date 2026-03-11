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
    if (!passengerPhone || passengerPhone.length < 10) {
      setError("Введите корректный номер телефона");
      return;
    }
    onLogin("passenger", passengerName || "Пассажир");
  };

  const handleDriverLogin = () => {
    const driver = DRIVERS[driverLogin];
    if (!driver || driver.password !== driverPassword) {
      setError("Неверный логин или пароль");
      return;
    }
    onLogin("driver", driver.name);
  };

  const handleAdminLogin = () => {
    if (adminPassword !== ADMIN_PASSWORD) {
      setError("Неверный пароль администратора");
      return;
    }
    onLogin("admin");
  };

  const openForm = (form: "passenger" | "driver" | "admin") => {
    setActiveForm(form);
    setError("");
  };

  return (
    <div className="min-h-dvh flex flex-col relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-orange-400 opacity-15 blur-3xl" />
        <div className="absolute top-1/2 -left-32 w-64 h-64 rounded-full bg-orange-300 opacity-20 blur-3xl" />
        <div className="absolute -bottom-16 right-8 w-48 h-48 rounded-full bg-amber-400 opacity-15 blur-2xl" />
      </div>

      {/* Header */}
      <div className="flex flex-col items-center pt-16 pb-8 px-6 animate-fade-in">
        <div className="w-20 h-20 taxi-gradient rounded-2xl flex items-center justify-center shadow-lg shadow-orange-200 mb-5">
          <span className="text-4xl">🚕</span>
        </div>
        <h1 className="text-3xl font-black text-stone-800 tracking-tight">ТаксиЭкспресс</h1>
        <p className="text-sm text-stone-500 mt-1.5 font-medium">Быстро. Удобно. Надёжно.</p>
      </div>

      {/* Role selection */}
      {!activeForm && (
        <div className="flex-1 flex flex-col justify-center px-5 gap-4 animate-slide-up">
          <p className="text-center text-stone-500 text-sm font-medium mb-2">Выберите, кто вы</p>

          <button
            onClick={() => openForm("passenger")}
            className="w-full bg-white rounded-2xl p-5 flex items-center gap-4 shadow-sm border border-orange-100 active:scale-95 transition-transform"
          >
            <div className="w-13 h-13 w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">👤</span>
            </div>
            <div className="text-left">
              <div className="font-bold text-stone-800 text-base">Пассажир</div>
              <div className="text-xs text-stone-400 mt-0.5">Вход по номеру телефона</div>
            </div>
            <Icon name="ChevronRight" size={18} className="ml-auto text-stone-300" />
          </button>

          <button
            onClick={() => openForm("driver")}
            className="w-full bg-white rounded-2xl p-5 flex items-center gap-4 shadow-sm border border-orange-100 active:scale-95 transition-transform"
          >
            <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">🚗</span>
            </div>
            <div className="text-left">
              <div className="font-bold text-stone-800 text-base">Водитель</div>
              <div className="text-xs text-stone-400 mt-0.5">Вход по логину и паролю</div>
            </div>
            <Icon name="ChevronRight" size={18} className="ml-auto text-stone-300" />
          </button>

          <button
            onClick={() => openForm("admin")}
            className="w-full bg-white rounded-2xl p-5 flex items-center gap-4 shadow-sm border border-orange-100 active:scale-95 transition-transform"
          >
            <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">🛡️</span>
            </div>
            <div className="text-left">
              <div className="font-bold text-stone-800 text-base">Администратор</div>
              <div className="text-xs text-stone-400 mt-0.5">Управление сервисом</div>
            </div>
            <Icon name="ChevronRight" size={18} className="ml-auto text-stone-300" />
          </button>
        </div>
      )}

      {/* Passenger login form */}
      {activeForm === "passenger" && (
        <div className="flex-1 flex flex-col px-5 pt-4 animate-slide-up">
          <button onClick={() => setActiveForm(null)} className="flex items-center gap-1 text-stone-500 text-sm mb-6">
            <Icon name="ArrowLeft" size={16} />
            Назад
          </button>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
              <span className="text-xl">👤</span>
            </div>
            <h2 className="text-xl font-black text-stone-800">Вход для пассажира</h2>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1.5 block">Имя (необязательно)</label>
              <input
                type="text"
                placeholder="Ваше имя"
                value={passengerName}
                onChange={e => { setPassengerName(e.target.value); setError(""); }}
                className="w-full bg-white border border-orange-100 rounded-xl px-4 py-3.5 text-stone-800 placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1.5 block">Номер телефона</label>
              <input
                type="tel"
                placeholder="+7 (___) ___-__-__"
                value={passengerPhone}
                onChange={e => { setPassengerPhone(e.target.value); setError(""); }}
                className="w-full bg-white border border-orange-100 rounded-xl px-4 py-3.5 text-stone-800 placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm"
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm mt-3 font-medium">{error}</p>}

          <button
            onClick={handlePassengerLogin}
            className="mt-6 w-full taxi-gradient text-white font-bold py-4 rounded-2xl shadow-lg shadow-orange-200 active:scale-95 transition-transform text-base"
          >
            Войти
          </button>
        </div>
      )}

      {/* Driver login form */}
      {activeForm === "driver" && (
        <div className="flex-1 flex flex-col px-5 pt-4 animate-slide-up">
          <button onClick={() => setActiveForm(null)} className="flex items-center gap-1 text-stone-500 text-sm mb-6">
            <Icon name="ArrowLeft" size={16} />
            Назад
          </button>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
              <span className="text-xl">🚗</span>
            </div>
            <h2 className="text-xl font-black text-stone-800">Вход для водителя</h2>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1.5 block">Логин</label>
              <input
                type="text"
                placeholder="Введите логин"
                value={driverLogin}
                onChange={e => { setDriverLogin(e.target.value); setError(""); }}
                className="w-full bg-white border border-orange-100 rounded-xl px-4 py-3.5 text-stone-800 placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1.5 block">Пароль</label>
              <input
                type="password"
                placeholder="Введите пароль"
                value={driverPassword}
                onChange={e => { setDriverPassword(e.target.value); setError(""); }}
                className="w-full bg-white border border-orange-100 rounded-xl px-4 py-3.5 text-stone-800 placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm"
              />
            </div>
          </div>

          <p className="text-xs text-stone-400 mt-3">Данные предоставляет администратор</p>

          {error && <p className="text-red-500 text-sm mt-3 font-medium">{error}</p>}

          <button
            onClick={handleDriverLogin}
            className="mt-6 w-full taxi-gradient text-white font-bold py-4 rounded-2xl shadow-lg shadow-orange-200 active:scale-95 transition-transform text-base"
          >
            Войти
          </button>
        </div>
      )}

      {/* Admin login form */}
      {activeForm === "admin" && (
        <div className="flex-1 flex flex-col px-5 pt-4 animate-slide-up">
          <button onClick={() => setActiveForm(null)} className="flex items-center gap-1 text-stone-500 text-sm mb-6">
            <Icon name="ArrowLeft" size={16} />
            Назад
          </button>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
              <span className="text-xl">🛡️</span>
            </div>
            <h2 className="text-xl font-black text-stone-800">Вход для администратора</h2>
          </div>

          <div>
            <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1.5 block">Пароль</label>
            <input
              type="password"
              placeholder="Введите пароль"
              value={adminPassword}
              onChange={e => { setAdminPassword(e.target.value); setError(""); }}
              className="w-full bg-white border border-orange-100 rounded-xl px-4 py-3.5 text-stone-800 placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm"
            />
          </div>

          {error && <p className="text-red-500 text-sm mt-3 font-medium">{error}</p>}

          <button
            onClick={handleAdminLogin}
            className="mt-6 w-full taxi-gradient text-white font-bold py-4 rounded-2xl shadow-lg shadow-orange-200 active:scale-95 transition-transform text-base"
          >
            Войти
          </button>
        </div>
      )}

      <div className="pb-8 pt-4 text-center text-xs text-stone-400 animate-fade-in">
        ТаксиЭкспресс © 2025
      </div>
    </div>
  );
}
