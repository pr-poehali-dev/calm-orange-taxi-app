import { useState } from "react";
import Icon from "@/components/ui/icon";

interface Props {
  onLogout: () => void;
}

type OrderStatus = "free" | "in_progress" | "in_route" | "waiting";

interface LiveOrder {
  id: number;
  tariff: string;
  tariffIcon: string;
  from?: string;
  to: string;
  driver?: string;
  status: OrderStatus;
  time: string;
  payment: string;
  price?: number;
  comment?: string;
}

interface Driver {
  id: number;
  login: string;
  name: string;
  phone: string;
}

const STATUS_INFO: Record<OrderStatus, { label: string; color: string; bg: string; dot: string }> = {
  free: { label: "Свободен", color: "text-green-700", bg: "bg-green-100", dot: "bg-green-500" },
  in_progress: { label: "В работе", color: "text-orange-700", bg: "bg-orange-100", dot: "bg-orange-500" },
  in_route: { label: "В пути", color: "text-blue-700", bg: "bg-blue-100", dot: "bg-blue-500" },
  waiting: { label: "Ожидание", color: "text-amber-700", bg: "bg-amber-100", dot: "bg-amber-500" },
};

const INITIAL_LIVE_ORDERS: LiveOrder[] = [
  {
    id: 1,
    tariff: "Стандарт",
    tariffIcon: "🚕",
    from: "ул. Ленина, 12",
    to: "Аэропорт",
    driver: "Алексей П.",
    status: "in_progress",
    time: "10:25",
    payment: "Перевод",
    price: 650,
  },
  {
    id: 2,
    tariff: "Доставка",
    tariffIcon: "📦",
    to: "ул. Советская, 7",
    status: "free",
    time: "10:42",
    payment: "Наличные",
    comment: "Позвоните перед доставкой",
  },
  {
    id: 3,
    tariff: "Стандарт",
    tariffIcon: "🚕",
    from: "ТЦ Планета",
    to: "пр. Мира, 88",
    driver: "Иван С.",
    status: "in_route",
    time: "11:05",
    payment: "Наличные",
  },
  {
    id: 4,
    tariff: "Грузовой",
    tariffIcon: "🚚",
    from: "Склад Промышленная",
    to: "ул. Новая, 34",
    driver: "Алексей П.",
    status: "waiting",
    time: "11:30",
    payment: "Перевод",
    price: 2500,
  },
];

const INITIAL_DRIVERS: Driver[] = [
  { id: 1, login: "driver1", name: "Алексей Петров", phone: "+7 (999) 111-22-33" },
  { id: 2, login: "driver2", name: "Иван Сидоров", phone: "+7 (999) 444-55-66" },
];

export default function AdminApp({ onLogout }: Props) {
  const [liveOrders, setLiveOrders] = useState<LiveOrder[]>(INITIAL_LIVE_ORDERS);
  const [drivers, setDrivers] = useState<Driver[]>(INITIAL_DRIVERS);

  // Password change
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [passError, setPassError] = useState("");
  const [passSuccess, setPassSuccess] = useState(false);

  // Add driver
  const [showDriverModal, setShowDriverModal] = useState(false);
  const [driverLogin, setDriverLogin] = useState("");
  const [driverPassword, setDriverPassword] = useState("");
  const [driverName, setDriverName] = useState("");
  const [driverPhone, setDriverPhone] = useState("");
  const [driverError, setDriverError] = useState("");

  const cancelOrder = (id: number) => {
    setLiveOrders(prev => prev.filter(o => o.id !== id));
  };

  const handlePasswordChange = () => {
    if (oldPass !== "admin123") { setPassError("Неверный текущий пароль"); return; }
    if (newPass.length < 4) { setPassError("Пароль должен быть не менее 4 символов"); return; }
    if (newPass !== confirmPass) { setPassError("Пароли не совпадают"); return; }
    setPassError("");
    setPassSuccess(true);
    setTimeout(() => { setShowPasswordModal(false); setPassSuccess(false); setOldPass(""); setNewPass(""); setConfirmPass(""); }, 2000);
  };

  const handleAddDriver = () => {
    if (!driverLogin || !driverPassword || !driverName) { setDriverError("Заполните все обязательные поля"); return; }
    const newDriver: Driver = {
      id: Date.now(),
      login: driverLogin,
      name: driverName,
      phone: driverPhone,
    };
    setDrivers(prev => [...prev, newDriver]);
    setDriverError("");
    setShowDriverModal(false);
    setDriverLogin(""); setDriverPassword(""); setDriverName(""); setDriverPhone("");
  };

  return (
    <div className="min-h-dvh flex flex-col">
      {/* Top bar */}
      <div className="taxi-gradient px-5 pt-12 pb-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-orange-100 text-xs font-medium">Панель управления</p>
            <h2 className="text-white font-black text-lg">Администратор</h2>
          </div>
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <span className="text-xl">🛡️</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mt-4">
          <div className="bg-white/15 rounded-xl p-2.5 text-center">
            <p className="text-white font-black text-xl">{liveOrders.length}</p>
            <p className="text-orange-100 text-[10px] font-medium">Активных</p>
          </div>
          <div className="bg-white/15 rounded-xl p-2.5 text-center">
            <p className="text-white font-black text-xl">{liveOrders.filter(o => o.status === "free").length}</p>
            <p className="text-orange-100 text-[10px] font-medium">Свободных</p>
          </div>
          <div className="bg-white/15 rounded-xl p-2.5 text-center">
            <p className="text-white font-black text-xl">{drivers.length}</p>
            <p className="text-orange-100 text-[10px] font-medium">Водителей</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-6">
        <div className="px-4 pt-5 space-y-3">

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setShowPasswordModal(true)}
              className="bg-white rounded-2xl p-4 shadow-sm border border-orange-100 flex flex-col items-center gap-2 active:scale-95 transition-transform"
            >
              <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
                <Icon name="Lock" size={18} className="text-orange-500" />
              </div>
              <span className="text-xs font-bold text-stone-700 text-center">Сменить пароль</span>
            </button>
            <button
              onClick={() => setShowDriverModal(true)}
              className="taxi-gradient rounded-2xl p-4 shadow-md shadow-orange-200 flex flex-col items-center gap-2 active:scale-95 transition-transform"
            >
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Icon name="UserPlus" size={18} className="text-white" />
              </div>
              <span className="text-xs font-bold text-white text-center">Добавить водителя</span>
            </button>
          </div>

          {/* Drivers list */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <h4 className="font-black text-stone-800 mb-3 flex items-center gap-2">
              <Icon name="Users" size={16} className="text-orange-500" />
              Водители ({drivers.length})
            </h4>
            {drivers.map(driver => (
              <div key={driver.id} className="flex items-center gap-3 py-2.5 border-b border-stone-50 last:border-0">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm">🚗</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-stone-800">{driver.name}</p>
                  <p className="text-xs text-stone-400">@{driver.login} · {driver.phone || "без телефона"}</p>
                </div>
                <span className="w-2 h-2 rounded-full bg-green-400" />
              </div>
            ))}
          </div>

          {/* Live orders */}
          <div>
            <h4 className="font-black text-stone-800 mb-3 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              История онлайн ({liveOrders.length})
            </h4>

            {liveOrders.length === 0 ? (
              <div className="text-center py-10 text-stone-400">
                <span className="text-4xl mb-3 block">📋</span>
                <p className="text-sm font-medium">Активных заказов нет</p>
              </div>
            ) : (
              liveOrders.map(order => {
                const st = STATUS_INFO[order.status];
                return (
                  <div key={order.id} className="bg-white rounded-2xl shadow-sm mb-3 overflow-hidden">
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{order.tariffIcon}</span>
                          <div>
                            <p className="font-bold text-stone-800 text-sm">{order.tariff}</p>
                            <p className="text-xs text-stone-400">{order.time}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${st.dot}`} />
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${st.bg} ${st.color}`}>{st.label}</span>
                        </div>
                      </div>

                      <div className="bg-stone-50 rounded-xl p-3 space-y-1 mb-3">
                        {order.from && (
                          <div className="flex gap-2 text-xs">
                            <span className="text-green-500">●</span>
                            <span className="text-stone-600">{order.from}</span>
                          </div>
                        )}
                        <div className="flex gap-2 text-xs">
                          <span className="text-red-500">●</span>
                          <span className="text-stone-600">{order.to}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {order.driver ? (
                            <div className="flex items-center gap-1.5">
                              <Icon name="Car" size={12} className="text-orange-400" />
                              <span className="text-xs text-stone-600 font-medium">{order.driver}</span>
                            </div>
                          ) : (
                            <span className="text-xs text-stone-400">Водитель не назначен</span>
                          )}
                          <div className="flex items-center gap-1">
                            {order.payment === "Перевод" ? (
                              <Icon name="Smartphone" size={12} className="text-stone-400" />
                            ) : (
                              <Icon name="Banknote" size={12} className="text-stone-400" />
                            )}
                            <span className="text-xs text-stone-400">{order.payment}</span>
                          </div>
                          {order.price && <span className="text-xs font-bold text-stone-700">{order.price} ₽</span>}
                        </div>

                        <button
                          onClick={() => cancelOrder(order.id)}
                          className="text-xs text-red-400 font-bold bg-red-50 px-3 py-1.5 rounded-lg active:scale-95 transition-transform border border-red-100"
                        >
                          Отменить
                        </button>
                      </div>

                      {order.comment && (
                        <div className="mt-2 bg-amber-50 rounded-lg p-2 flex gap-1.5">
                          <Icon name="MessageCircle" size={12} className="text-amber-500 flex-shrink-0 mt-0.5" />
                          <p className="text-xs text-stone-600">{order.comment}</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <button
            onClick={onLogout}
            className="w-full bg-red-50 text-red-500 font-bold py-4 rounded-2xl border-2 border-red-100 active:scale-95 transition-transform text-sm"
          >
            Выйти из панели
          </button>
        </div>
      </div>

      {/* Password modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end z-50" onClick={() => setShowPasswordModal(false)}>
          <div className="w-full max-w-[430px] mx-auto bg-white rounded-t-3xl p-6 safe-bottom animate-slide-up" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-black text-stone-800 text-lg">Смена пароля</h3>
              <button onClick={() => setShowPasswordModal(false)} className="w-8 h-8 bg-stone-100 rounded-full flex items-center justify-center">
                <Icon name="X" size={16} className="text-stone-500" />
              </button>
            </div>
            {passSuccess ? (
              <div className="text-center py-6">
                <span className="text-5xl">✅</span>
                <p className="font-bold text-green-600 mt-3">Пароль успешно изменён!</p>
              </div>
            ) : (
              <div className="space-y-3">
                <input type="password" placeholder="Текущий пароль" value={oldPass} onChange={e => { setOldPass(e.target.value); setPassError(""); }} className="w-full bg-stone-50 border border-stone-100 rounded-xl px-4 py-3.5 text-sm text-stone-800 placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-orange-300" />
                <input type="password" placeholder="Новый пароль" value={newPass} onChange={e => { setNewPass(e.target.value); setPassError(""); }} className="w-full bg-stone-50 border border-stone-100 rounded-xl px-4 py-3.5 text-sm text-stone-800 placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-orange-300" />
                <input type="password" placeholder="Повторите новый пароль" value={confirmPass} onChange={e => { setConfirmPass(e.target.value); setPassError(""); }} className="w-full bg-stone-50 border border-stone-100 rounded-xl px-4 py-3.5 text-sm text-stone-800 placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-orange-300" />
                {passError && <p className="text-red-500 text-sm font-medium">{passError}</p>}
                <button onClick={handlePasswordChange} className="w-full taxi-gradient text-white font-bold py-4 rounded-2xl shadow-lg shadow-orange-200 active:scale-95 transition-transform">Сохранить</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add driver modal */}
      {showDriverModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end z-50" onClick={() => setShowDriverModal(false)}>
          <div className="w-full max-w-[430px] mx-auto bg-white rounded-t-3xl p-6 safe-bottom animate-slide-up" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-black text-stone-800 text-lg">Добавить водителя</h3>
              <button onClick={() => setShowDriverModal(false)} className="w-8 h-8 bg-stone-100 rounded-full flex items-center justify-center">
                <Icon name="X" size={16} className="text-stone-500" />
              </button>
            </div>
            <div className="space-y-3">
              <input type="text" placeholder="Имя водителя *" value={driverName} onChange={e => { setDriverName(e.target.value); setDriverError(""); }} className="w-full bg-stone-50 border border-stone-100 rounded-xl px-4 py-3.5 text-sm text-stone-800 placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-orange-300" />
              <input type="tel" placeholder="Номер телефона" value={driverPhone} onChange={e => setDriverPhone(e.target.value)} className="w-full bg-stone-50 border border-stone-100 rounded-xl px-4 py-3.5 text-sm text-stone-800 placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-orange-300" />
              <input type="text" placeholder="Логин *" value={driverLogin} onChange={e => { setDriverLogin(e.target.value); setDriverError(""); }} className="w-full bg-stone-50 border border-stone-100 rounded-xl px-4 py-3.5 text-sm text-stone-800 placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-orange-300" />
              <input type="password" placeholder="Пароль *" value={driverPassword} onChange={e => { setDriverPassword(e.target.value); setDriverError(""); }} className="w-full bg-stone-50 border border-stone-100 rounded-xl px-4 py-3.5 text-sm text-stone-800 placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-orange-300" />
              {driverError && <p className="text-red-500 text-sm font-medium">{driverError}</p>}
              <button onClick={handleAddDriver} className="w-full taxi-gradient text-white font-bold py-4 rounded-2xl shadow-lg shadow-orange-200 active:scale-95 transition-transform">Добавить</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
