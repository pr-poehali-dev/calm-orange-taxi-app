import { useState } from "react";
import Icon from "@/components/ui/icon";
import TaxiLogo from "./TaxiLogo";

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

const STATUS_INFO: Record<OrderStatus, { label: string; color: string; bg: string; dot: string }> = {
  free:        { label: "Свободен",  color: "text-[#2ab54c]",  bg: "bg-[#e8f8ec]",  dot: "bg-[#4dcd5e]" },
  in_progress: { label: "В работе",  color: "text-[#006aad]",  bg: "bg-[#e8f6fd]",  dot: "bg-[#2AABEE]" },
  in_route:    { label: "В пути",    color: "text-blue-700",   bg: "bg-blue-50",    dot: "bg-blue-400" },
  waiting:     { label: "Ожидание",  color: "text-amber-700",  bg: "bg-amber-50",   dot: "bg-amber-400" },
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

const inputCls = "w-full bg-[#f1f3f4] border border-transparent rounded-2xl px-4 py-3.5 text-[#17212b] placeholder-[#a0adb8] focus:outline-none focus:border-[#2AABEE] focus:bg-white focus:ring-2 focus:ring-[#2AABEE]/15 text-[14px] transition-all";

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

  const modalOverlay = "fixed inset-0 bg-black/40 backdrop-blur-sm flex items-end z-50";
  const modalSheet = "w-full max-w-[430px] mx-auto bg-white rounded-t-[2rem] p-6 safe-bottom animate-slide-up";

  return (
    <div className="min-h-dvh flex flex-col" style={{ background: "#f1f3f4" }}>
      {/* Header */}
      <div className="tg-gradient px-5 pt-12 pb-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="drop-shadow-lg"><TaxiLogo size={38} /></div>
            <div>
              <h2 className="text-white font-black text-[16px] leading-tight">Алло Антипиха</h2>
              <p className="text-white/75 text-[11px]">Администратор</p>
            </div>
          </div>
          <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center text-lg">🛡️</div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[
            { val: orders.length, label: "Активных" },
            { val: orders.filter(o => o.status === "free").length, label: "Свободных" },
            { val: drivers.length, label: "Водителей" },
          ].map(s => (
            <div key={s.label} className="bg-white/15 rounded-2xl p-2.5 text-center">
              <p className="text-white font-black text-[22px] leading-tight">{s.val}</p>
              <p className="text-white/70 text-[11px] font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-6 px-4 pt-4 space-y-3">
        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => setShowPass(true)}
            className="bg-white rounded-2xl p-4 border border-[#e6ebf1] flex flex-col items-center gap-2 active:scale-95 transition-all">
            <div className="w-10 h-10 rounded-full bg-[#e8f6fd] flex items-center justify-center">
              <Icon name="Lock" size={18} className="text-[#2AABEE]" />
            </div>
            <span className="text-[12px] font-semibold text-[#17212b] text-center">Сменить пароль</span>
          </button>
          <button onClick={() => setShowDriver(true)}
            className="tg-gradient rounded-2xl p-4 shadow-md shadow-[#2AABEE]/20 flex flex-col items-center gap-2 active:scale-95 transition-all">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Icon name="UserPlus" size={18} className="text-white" />
            </div>
            <span className="text-[12px] font-semibold text-white text-center">Добавить водителя</span>
          </button>
        </div>

        {/* Drivers */}
        <div className="bg-white rounded-2xl border border-[#e6ebf1] overflow-hidden">
          <div className="px-4 py-3 flex items-center gap-2 border-b border-[#f1f3f4]">
            <Icon name="Users" size={15} className="text-[#2AABEE]" />
            <h4 className="font-bold text-[#17212b] text-[14px]">Водители ({drivers.length})</h4>
          </div>
          {drivers.map((d, i) => (
            <div key={d.id} className={`px-4 py-3 flex items-center gap-3 ${i < drivers.length - 1 ? "border-b border-[#f1f3f4]" : ""}`}>
              <div className="w-9 h-9 tg-gradient rounded-full flex items-center justify-center flex-shrink-0 text-base shadow-sm">🚗</div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-[#17212b] truncate">{d.name}</p>
                <p className="text-[11px] text-[#708499]">@{d.login} · {d.phone || "—"}</p>
              </div>
              <span className="w-2 h-2 rounded-full bg-[#4dcd5e] flex-shrink-0" />
            </div>
          ))}
        </div>

        {/* Live orders */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-[#2AABEE] animate-pulse" />
            <h4 className="font-bold text-[#17212b] text-[14px]">История онлайн ({orders.length})</h4>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-12">
              <span className="text-4xl block mb-3">📋</span>
              <p className="text-[14px] font-medium text-[#708499]">Активных заказов нет</p>
            </div>
          ) : orders.map(order => {
            const st = STATUS_INFO[order.status];
            return (
              <div key={order.id} className="bg-white rounded-2xl border border-[#e6ebf1] mb-2 p-4">
                <div className="flex items-start justify-between mb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{order.tariffIcon}</span>
                    <div>
                      <p className="font-semibold text-[#17212b] text-[14px]">{order.tariff}</p>
                      <p className="text-[11px] text-[#708499]">{order.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${st.dot}`} />
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${st.bg} ${st.color}`}>{st.label}</span>
                  </div>
                </div>

                <div className="bg-[#f1f3f4] rounded-xl p-2.5 space-y-1 mb-2.5">
                  {order.from && <div className="flex gap-2 text-[12px]"><span className="text-[#4dcd5e]">●</span><span className="text-[#17212b]">{order.from}</span></div>}
                  <div className="flex gap-2 text-[12px]"><span className="text-red-400">●</span><span className="text-[#17212b]">{order.to}</span></div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-[12px] text-[#708499]">
                    {order.driver
                      ? <div className="flex items-center gap-1"><Icon name="Car" size={12} className="text-[#2AABEE]" /><span className="font-medium text-[#17212b]">{order.driver}</span></div>
                      : <span>Без водителя</span>
                    }
                    <span>{order.payment}</span>
                    {order.price && <span className="font-bold text-[#17212b]">{order.price} ₽</span>}
                  </div>
                  <button onClick={() => cancelOrder(order.id)}
                    className="text-[12px] text-red-400 font-semibold bg-red-50 px-3 py-1.5 rounded-xl active:scale-95 transition-all border border-red-100">
                    Отменить
                  </button>
                </div>

                {order.comment && (
                  <div className="mt-2.5 bg-[#e8f6fd] rounded-xl p-2.5 flex gap-2">
                    <Icon name="MessageCircle" size={12} className="text-[#2AABEE] flex-shrink-0 mt-0.5" />
                    <p className="text-[12px] text-[#17212b]">{order.comment}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <button onClick={onLogout} className="w-full bg-white text-red-500 font-semibold py-3.5 rounded-2xl border border-[#e6ebf1] active:scale-95 transition-all text-[14px]">
          Выйти из панели
        </button>
      </div>

      {/* Password modal */}
      {showPass && (
        <div className={modalOverlay} onClick={() => setShowPass(false)}>
          <div className={modalSheet} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-black text-[#17212b] text-[17px]">Смена пароля</h3>
              <button onClick={() => setShowPass(false)} className="w-8 h-8 bg-[#f1f3f4] rounded-full flex items-center justify-center">
                <Icon name="X" size={15} className="text-[#708499]" />
              </button>
            </div>
            {passOk ? (
              <div className="text-center py-8"><span className="text-5xl">✅</span><p className="font-bold text-[#4dcd5e] mt-3 text-[15px]">Пароль успешно изменён!</p></div>
            ) : (
              <div className="space-y-3">
                <input type="password" placeholder="Текущий пароль" value={oldPass} onChange={e => { setOldPass(e.target.value); setPassErr(""); }} className={inputCls} />
                <input type="password" placeholder="Новый пароль" value={newPass} onChange={e => { setNewPass(e.target.value); setPassErr(""); }} className={inputCls} />
                <input type="password" placeholder="Повторите пароль" value={confPass} onChange={e => { setConfPass(e.target.value); setPassErr(""); }} className={inputCls} />
                {passErr && <p className="text-red-400 text-[13px] font-medium">{passErr}</p>}
                <button onClick={handlePassChange} className="w-full tg-gradient text-white font-semibold py-4 rounded-2xl shadow-md shadow-[#2AABEE]/25 active:scale-95 transition-all text-[15px]">Сохранить</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add driver modal */}
      {showDriver && (
        <div className={modalOverlay} onClick={() => setShowDriver(false)}>
          <div className={modalSheet} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-black text-[#17212b] text-[17px]">Добавить водителя</h3>
              <button onClick={() => setShowDriver(false)} className="w-8 h-8 bg-[#f1f3f4] rounded-full flex items-center justify-center">
                <Icon name="X" size={15} className="text-[#708499]" />
              </button>
            </div>
            <div className="space-y-3">
              <input type="text" placeholder="Имя водителя *" value={dName} onChange={e => { setDName(e.target.value); setDriverErr(""); }} className={inputCls} />
              <input type="tel" placeholder="Номер телефона" value={dPhone} onChange={e => setDPhone(e.target.value)} className={inputCls} />
              <input type="text" placeholder="Логин *" value={dLogin} onChange={e => { setDLogin(e.target.value); setDriverErr(""); }} className={inputCls} />
              <input type="password" placeholder="Пароль *" value={dPass} onChange={e => { setDPass(e.target.value); setDriverErr(""); }} className={inputCls} />
              {driverErr && <p className="text-red-400 text-[13px] font-medium">{driverErr}</p>}
              <button onClick={handleAddDriver} className="w-full tg-gradient text-white font-semibold py-4 rounded-2xl shadow-md shadow-[#2AABEE]/25 active:scale-95 transition-all text-[15px]">Добавить</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
