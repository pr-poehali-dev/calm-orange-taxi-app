import { useState } from "react";
import Icon from "@/components/ui/icon";

interface Props {
  onLogout: () => void;
}

type OrderStatus = "free" | "in_progress" | "in_route" | "waiting";
interface LiveOrder {
  id: number; tariff: string; tariffIcon: string; from?: string; to: string;
  driver?: string; status: OrderStatus; time: string; payment: string; price?: number; comment?: string;
}
interface Driver {
  id: number; login: string; name: string; phone: string;
}

const STATUS_INFO: Record<OrderStatus, { label: string; color: string; bg: string }> = {
  free:        { label: "Свободен",  color: "#2ab54c",  bg: "#e8f8ec" },
  in_progress: { label: "В работе",  color: "#00897b",  bg: "#e0f2f0" },
  in_route:    { label: "В пути",    color: "#1976d2",  bg: "#e3f2fd" },
  waiting:     { label: "Ожидание",  color: "#f57c00",  bg: "#fff3e0" },
};

const INIT_ORDERS: LiveOrder[] = [
  { id: 1, tariff: "Стандарт", tariffIcon: "🚕", from: "ул. Ленина, 12", to: "Аэропорт", driver: "Алексей П.", status: "in_progress", time: "10:25", payment: "Перевод", price: 650 },
  { id: 2, tariff: "Доставка", tariffIcon: "📦", to: "ул. Советская, 7", status: "free", time: "10:42", payment: "Наличные", comment: "Позвоните перед доставкой" },
  { id: 3, tariff: "Стандарт", tariffIcon: "🚕", from: "ТЦ Планета", to: "пр. Мира, 88", driver: "Иван С.", status: "in_route", time: "11:05", payment: "Наличные" },
  { id: 4, tariff: "Грузовой", tariffIcon: "🚚", from: "Склад Промышленная", to: "ул. Новая, 34", driver: "Алексей П.", status: "waiting", time: "11:30", payment: "Перевод", price: 2500 },
];
const INIT_DRIVERS: Driver[] = [
  { id: 1, login: "driver1", name: "Алексей Петров", phone: "+7 (999) 111-22-33" },
  { id: 2, login: "driver2", name: "Иван Сидоров", phone: "+7 (999) 444-55-66" },
];

const inputCls = "w-full bg-[#f8f8f8] border rounded-2xl px-4 py-3.5 text-[#1a1a1a] placeholder-[#bbb] focus:outline-none focus:border-[#00897b] focus:ring-2 focus:ring-[#00897b]/15 text-[14px] transition-all";

export default function AdminApp({ onLogout }: Props) {
  const [orders, setOrders] = useState<LiveOrder[]>(INIT_ORDERS);
  const [drivers, setDrivers] = useState<Driver[]>(INIT_DRIVERS);

  const [showPass, setShowPass] = useState(false);
  const [oldPass, setOldPass] = useState(""); const [newPass, setNewPass] = useState(""); const [confPass, setConfPass] = useState("");
  const [passErr, setPassErr] = useState(""); const [passOk, setPassOk] = useState(false);

  const [showDriver, setShowDriver] = useState(false);
  const [dLogin, setDLogin] = useState(""); const [dPass, setDPass] = useState(""); const [dName, setDName] = useState(""); const [dPhone, setDPhone] = useState("");
  const [driverErr, setDriverErr] = useState("");

  const cancelOrder = (id: number) => setOrders(p => p.filter(o => o.id !== id));

  const handlePassChange = () => {
    if (oldPass !== "admin123") { setPassErr("Неверный текущий пароль"); return; }
    if (newPass.length < 4) { setPassErr("Минимум 4 символа"); return; }
    if (newPass !== confPass) { setPassErr("Пароли не совпадают"); return; }
    setPassErr(""); setPassOk(true);
    setTimeout(() => { setShowPass(false); setPassOk(false); setOldPass(""); setNewPass(""); setConfPass(""); }, 2000);
  };

  const handleAddDriver = () => {
    if (!dLogin || !dPass || !dName) { setDriverErr("Заполните обязательные поля"); return; }
    setDrivers(p => [...p, { id: Date.now(), login: dLogin, name: dName, phone: dPhone }]);
    setDriverErr(""); setShowDriver(false);
    setDLogin(""); setDPass(""); setDName(""); setDPhone("");
  };

  const modalOverlay = "fixed inset-0 flex items-end z-50" as const;
  const modalSheet = "w-full bg-white rounded-t-[2rem] p-6 safe-bottom animate-slide-up" as const;

  return (
    <div className="min-h-dvh flex flex-col" style={{ background: "#f0f0f0" }}>
      {/* Header */}
      <div className="px-5 pt-12 pb-5" style={{ background: "#2e3440" }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-bold text-[18px] text-white">Алло Антипиха</h2>
            <p className="text-[13px] mt-0.5" style={{ color: "rgba(255,255,255,0.55)" }}>Администратор</p>
          </div>
          <button onClick={onLogout} className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.12)" }}>
            <Icon name="LogOut" size={16} style={{ color: "rgba(255,255,255,0.7)" } as React.CSSProperties} />
          </button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[
            { val: orders.length, label: "Активных" },
            { val: orders.filter(o => o.status === "free").length, label: "Свободных" },
            { val: drivers.length, label: "Водителей" },
          ].map(s => (
            <div key={s.label} className="rounded-2xl p-2.5 text-center" style={{ background: "rgba(255,255,255,0.12)" }}>
              <p className="text-white font-black text-[22px] leading-tight">{s.val}</p>
              <p className="text-[11px] font-medium" style={{ color: "rgba(255,255,255,0.55)" }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-6 px-4 pt-4 space-y-3">
        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => setShowPass(true)}
            className="bg-white rounded-2xl p-4 flex flex-col items-center gap-2 active:scale-95 transition-all"
            style={{ border: "1px solid #e8e8e8" }}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "#f0f0f0" }}>
              <Icon name="Lock" size={18} style={{ color: "#00897b" } as React.CSSProperties} />
            </div>
            <span className="text-[12px] font-semibold text-center" style={{ color: "#1a1a1a" }}>Сменить пароль</span>
          </button>
          <button onClick={() => setShowDriver(true)}
            className="rounded-2xl p-4 flex flex-col items-center gap-2 active:scale-95 transition-all"
            style={{ background: "#00897b" }}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.2)" }}>
              <Icon name="UserPlus" size={18} style={{ color: "#fff" } as React.CSSProperties} />
            </div>
            <span className="text-[12px] font-semibold text-white text-center">Добавить водителя</span>
          </button>
        </div>

        {/* Drivers */}
        <div className="bg-white rounded-2xl overflow-hidden" style={{ border: "1px solid #e8e8e8" }}>
          <div className="px-4 py-3 flex items-center gap-2" style={{ borderBottom: "1px solid #f0f0f0" }}>
            <Icon name="Users" size={15} style={{ color: "#00897b" } as React.CSSProperties} />
            <h4 className="font-bold text-[14px]" style={{ color: "#1a1a1a" }}>Водители ({drivers.length})</h4>
          </div>
          {drivers.map((d, i) => (
            <div key={d.id} className="px-4 py-3 flex items-center gap-3" style={{ borderBottom: i < drivers.length - 1 ? "1px solid #f0f0f0" : "none" }}>
              <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-base" style={{ background: "#f0f0f0" }}>🚗</div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold truncate" style={{ color: "#1a1a1a" }}>{d.name}</p>
                <p className="text-[11px]" style={{ color: "#888" }}>@{d.login} · {d.phone || "—"}</p>
              </div>
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: "#4dcd5e" }} />
            </div>
          ))}
        </div>

        {/* Live orders */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#00897b" }} />
            <h4 className="font-bold text-[14px]" style={{ color: "#1a1a1a" }}>Активные заказы ({orders.length})</h4>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-12">
              <span className="text-4xl block mb-3">📋</span>
              <p className="text-[14px] font-medium" style={{ color: "#888" }}>Активных заказов нет</p>
            </div>
          ) : orders.map(order => {
            const st = STATUS_INFO[order.status];
            return (
              <div key={order.id} className="bg-white rounded-2xl mb-2 p-4" style={{ border: "1px solid #e8e8e8" }}>
                <div className="flex items-start justify-between mb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{order.tariffIcon}</span>
                    <div>
                      <p className="font-semibold text-[14px]" style={{ color: "#1a1a1a" }}>{order.tariff}</p>
                      <p className="text-[11px]" style={{ color: "#888" }}>{order.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ background: st.bg, color: st.color }}>{st.label}</span>
                    <button onClick={() => cancelOrder(order.id)} className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: "#f0f0f0" }}>
                      <Icon name="X" size={12} style={{ color: "#888" } as React.CSSProperties} />
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5 mb-2.5">
                  {order.from && (
                    <div className="flex gap-2 text-[13px]">
                      <span style={{ color: "#00897b" }}>●</span>
                      <span style={{ color: "#555" }}>{order.from}</span>
                    </div>
                  )}
                  <div className="flex gap-2 text-[13px]">
                    <span style={{ color: order.from ? "#1a1a1a" : "#00897b" }}>●</span>
                    <span style={{ color: "#555" }}>{order.to}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[12px]">
                  <div className="flex items-center gap-3">
                    <span style={{ color: "#888" }}>{order.payment}</span>
                    {order.price && <span className="font-bold" style={{ color: "#1a1a1a" }}>{order.price} ₽</span>}
                  </div>
                  {order.driver && (
                    <span className="font-medium" style={{ color: "#00897b" }}>🚗 {order.driver}</span>
                  )}
                </div>

                {order.comment && (
                  <div className="mt-2 px-3 py-2 rounded-xl text-[12px]" style={{ background: "#f0f0f0", color: "#555" }}>
                    💬 {order.comment}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Change password modal */}
      {showPass && (
        <div className={modalOverlay} style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }} onClick={() => setShowPass(false)}>
          <div className={modalSheet} style={{ maxWidth: 430, margin: "0 auto" }} onClick={e => e.stopPropagation()}>
            <div className="w-10 h-1 rounded-full mx-auto mb-5" style={{ background: "#e8e8e8" }} />
            <h3 className="font-bold text-[16px] mb-4" style={{ color: "#1a1a1a" }}>Сменить пароль</h3>
            {passOk ? (
              <div className="py-4 text-center">
                <span className="text-3xl block mb-2">✅</span>
                <p className="font-semibold" style={{ color: "#00897b" }}>Пароль успешно изменён</p>
              </div>
            ) : (
              <div className="space-y-3">
                <input type="password" placeholder="Текущий пароль" value={oldPass} onChange={e => { setOldPass(e.target.value); setPassErr(""); }} className={inputCls} style={{ borderColor: "#e8e8e8" }} />
                <input type="password" placeholder="Новый пароль" value={newPass} onChange={e => { setNewPass(e.target.value); setPassErr(""); }} className={inputCls} style={{ borderColor: "#e8e8e8" }} />
                <input type="password" placeholder="Подтвердите пароль" value={confPass} onChange={e => { setConfPass(e.target.value); setPassErr(""); }} className={inputCls} style={{ borderColor: "#e8e8e8" }} />
                {passErr && <p className="text-red-500 text-[13px] font-medium">{passErr}</p>}
                <button onClick={handlePassChange} className="w-full font-semibold py-3.5 rounded-2xl text-white text-[15px]" style={{ background: "#00897b" }}>Сохранить</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add driver modal */}
      {showDriver && (
        <div className={modalOverlay} style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }} onClick={() => setShowDriver(false)}>
          <div className={modalSheet} style={{ maxWidth: 430, margin: "0 auto" }} onClick={e => e.stopPropagation()}>
            <div className="w-10 h-1 rounded-full mx-auto mb-5" style={{ background: "#e8e8e8" }} />
            <h3 className="font-bold text-[16px] mb-4" style={{ color: "#1a1a1a" }}>Новый водитель</h3>
            <div className="space-y-3">
              <input type="text" placeholder="Логин *" value={dLogin} onChange={e => { setDLogin(e.target.value); setDriverErr(""); }} className={inputCls} style={{ borderColor: "#e8e8e8" }} />
              <input type="password" placeholder="Пароль *" value={dPass} onChange={e => { setDPass(e.target.value); setDriverErr(""); }} className={inputCls} style={{ borderColor: "#e8e8e8" }} />
              <input type="text" placeholder="Имя *" value={dName} onChange={e => { setDName(e.target.value); setDriverErr(""); }} className={inputCls} style={{ borderColor: "#e8e8e8" }} />
              <input type="tel" placeholder="Телефон" value={dPhone} onChange={e => setDPhone(e.target.value)} className={inputCls} style={{ borderColor: "#e8e8e8" }} />
              {driverErr && <p className="text-red-500 text-[13px] font-medium">{driverErr}</p>}
              <button onClick={handleAddDriver} className="w-full font-semibold py-3.5 rounded-2xl text-white text-[15px]" style={{ background: "#00897b" }}>Добавить</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
