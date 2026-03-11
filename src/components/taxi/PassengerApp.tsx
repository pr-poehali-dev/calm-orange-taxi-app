import { useState } from "react";
import Icon from "@/components/ui/icon";

interface Props {
  userName: string;
  onLogout: () => void;
}

type Tariff = "standard" | "delivery" | "cargo";
type PaymentType = "cash" | "transfer";

const ORDER_HISTORY = [
  { id: 1, date: "10 марта", from: "ул. Ленина, 12", to: "ул. Мира, 45", cost: 350, status: "Выполнен" },
  { id: 2, date: "8 марта", from: "Аэропорт", to: "ул. Советская, 3", cost: 890, status: "Выполнен" },
  { id: 3, date: "5 марта", from: "ул. Гагарина, 7", to: "ТЦ Планета", cost: 280, status: "Выполнен" },
];

const inputCls = "w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-400 text-sm transition-all resize-none";

export default function PassengerApp({ userName, onLogout }: Props) {
  const [activeTab, setActiveTab] = useState<"order" | "profile">("order");
  const [tariff, setTariff] = useState<Tariff>("standard");

  const [from, setFrom] = useState("");
  const [via, setVia] = useState("");
  const [to, setTo] = useState("");
  const [children, setChildren] = useState(0);
  const [luggage, setLuggage] = useState(false);
  const [payment, setPayment] = useState<PaymentType>("cash");
  const [comment, setComment] = useState("");
  const [price, setPrice] = useState("");

  const [delivTo, setDelivTo] = useState("");
  const [delivWhat, setDelivWhat] = useState("");
  const [delivPayment, setDelivPayment] = useState<PaymentType>("cash");
  const [delivComment, setDelivComment] = useState("");

  const [cargoFrom, setCargoFrom] = useState("");
  const [cargoTo, setCargoTo] = useState("");
  const [cargoDesc, setCargoDesc] = useState("");
  const [cargoPayment, setCargoPayment] = useState<PaymentType>("cash");
  const [cargoComment, setCargoComment] = useState("");
  const [cargoPrice, setCargoPrice] = useState("");

  const [ordered, setOrdered] = useState(false);

  const handleOrder = () => {
    setOrdered(true);
    setTimeout(() => setOrdered(false), 3000);
  };

  const tariffTabs: { id: Tariff; label: string; icon: string }[] = [
    { id: "standard", label: "Стандарт", icon: "🚕" },
    { id: "delivery", label: "Доставка", icon: "📦" },
    { id: "cargo", label: "Грузовой", icon: "🚚" },
  ];

  const paymentBtn = (val: PaymentType, cur: PaymentType, set: (v: PaymentType) => void, label: string, emoji: string) => (
    <button onClick={() => set(val)}
      className={`flex-1 py-2.5 rounded-2xl text-xs font-bold border-2 transition-all ${cur === val ? "border-violet-400 bg-violet-50 text-violet-700" : "border-slate-100 text-slate-400"}`}>
      {emoji} {label}
    </button>
  );

  return (
    <div className="min-h-dvh flex flex-col bg-slate-50">
      {/* Header */}
      <div className="taxi-gradient px-5 pt-12 pb-6 rounded-b-[2rem]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-violet-200 text-xs font-medium">Добро пожаловать</p>
            <h2 className="text-white font-black text-lg">{userName || "Пассажир"}</h2>
          </div>
          <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center text-xl">👤</div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-24">
        {activeTab === "order" && (
          <div className="px-4 pt-5 animate-fade-in">
            {/* Tariff selector */}
            <div className="bg-white rounded-3xl p-1.5 flex gap-1 mb-5 shadow-sm">
              {tariffTabs.map(t => (
                <button key={t.id} onClick={() => setTariff(t.id)}
                  className={`flex-1 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${tariff === t.id ? "taxi-gradient text-white shadow-md" : "text-slate-400"}`}>
                  <span>{t.icon}</span>{t.label}
                </button>
              ))}
            </div>

            {/* Standard */}
            {tariff === "standard" && (
              <div className="space-y-3 animate-fade-in">
                <div className="bg-white rounded-3xl p-4 shadow-sm space-y-3">
                  <h3 className="font-black text-slate-800 text-base flex items-center gap-2"><span>🚕</span> Тариф Стандарт</h3>
                  <div className="relative">
                    <span className="absolute left-4 top-4 w-2 h-2 rounded-full bg-green-400" />
                    <input type="text" placeholder="Откуда" value={from} onChange={e => setFrom(e.target.value)} className={inputCls + " pl-8"} />
                  </div>
                  <div className="relative">
                    <span className="absolute left-4 top-4 w-2 h-2 rounded-full border-2 border-violet-400" />
                    <input type="text" placeholder="Промежуточный адрес (если нужно)" value={via} onChange={e => setVia(e.target.value)} className={inputCls + " pl-8"} />
                  </div>
                  <div className="relative">
                    <span className="absolute left-4 top-4 w-2 h-2 rounded-full bg-red-400" />
                    <input type="text" placeholder="Куда" value={to} onChange={e => setTo(e.target.value)} className={inputCls + " pl-8"} />
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-4 shadow-sm space-y-4">
                  <h4 className="font-bold text-slate-600 text-sm">Опции</h4>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-slate-700"><span>👶</span> Дети до 7 лет</div>
                    <div className="flex items-center gap-3">
                      <button onClick={() => setChildren(Math.max(0, children - 1))} className="w-8 h-8 rounded-full border-2 border-violet-200 flex items-center justify-center text-violet-500 font-bold">−</button>
                      <span className="font-bold text-slate-800 w-4 text-center">{children}</span>
                      <button onClick={() => setChildren(children + 1)} className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 font-bold">+</button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-slate-700"><span>🧳</span> Багаж</div>
                    <button onClick={() => setLuggage(!luggage)} className={`w-12 h-6 rounded-full transition-colors relative ${luggage ? "taxi-gradient" : "bg-slate-200"}`}>
                      <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${luggage ? "translate-x-6" : "translate-x-0.5"}`} />
                    </button>
                  </div>
                  <div>
                    <p className="text-sm text-slate-700 mb-2 flex items-center gap-2"><span>💳</span> Оплата</p>
                    <div className="flex gap-2">
                      {paymentBtn("cash", payment, setPayment, "Наличные", "💵")}
                      {paymentBtn("transfer", payment, setPayment, "Перевод", "📲")}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-slate-700 mb-2">Комментарий</p>
                    <textarea placeholder="Пожелания к поездке..." value={comment} onChange={e => setComment(e.target.value)} rows={2} className={inputCls} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-700 mb-2">Предлагаемая стоимость</p>
                    <input type="number" placeholder="₽ Ваша цена" value={price} onChange={e => setPrice(e.target.value)} className={inputCls} />
                  </div>
                </div>
              </div>
            )}

            {/* Delivery */}
            {tariff === "delivery" && (
              <div className="space-y-3 animate-fade-in">
                <div className="bg-white rounded-3xl p-4 shadow-sm space-y-3">
                  <h3 className="font-black text-slate-800 text-base flex items-center gap-2"><span>📦</span> Тариф Доставка</h3>
                  <div className="relative">
                    <span className="absolute left-4 top-4 w-2 h-2 rounded-full bg-red-400" />
                    <input type="text" placeholder="Куда доставить" value={delivTo} onChange={e => setDelivTo(e.target.value)} className={inputCls + " pl-8"} />
                  </div>
                  <textarea placeholder="Что нужно доставить..." value={delivWhat} onChange={e => setDelivWhat(e.target.value)} rows={3} className={inputCls} />
                </div>
                <div className="bg-white rounded-3xl p-4 shadow-sm space-y-4">
                  <h4 className="font-bold text-slate-600 text-sm">Опции</h4>
                  <div>
                    <p className="text-sm text-slate-700 mb-2 flex items-center gap-2"><span>💳</span> Оплата</p>
                    <div className="flex gap-2">
                      {paymentBtn("cash", delivPayment, setDelivPayment, "Наличные", "💵")}
                      {paymentBtn("transfer", delivPayment, setDelivPayment, "Перевод", "📲")}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-slate-700 mb-2">Комментарий</p>
                    <textarea placeholder="Дополнительные инструкции..." value={delivComment} onChange={e => setDelivComment(e.target.value)} rows={2} className={inputCls} />
                  </div>
                </div>
              </div>
            )}

            {/* Cargo */}
            {tariff === "cargo" && (
              <div className="space-y-3 animate-fade-in">
                <div className="bg-white rounded-3xl p-4 shadow-sm space-y-3">
                  <h3 className="font-black text-slate-800 text-base flex items-center gap-2"><span>🚚</span> Тариф Грузовой</h3>
                  <div className="relative">
                    <span className="absolute left-4 top-4 w-2 h-2 rounded-full bg-green-400" />
                    <input type="text" placeholder="Откуда" value={cargoFrom} onChange={e => setCargoFrom(e.target.value)} className={inputCls + " pl-8"} />
                  </div>
                  <div className="relative">
                    <span className="absolute left-4 top-4 w-2 h-2 rounded-full bg-red-400" />
                    <input type="text" placeholder="Куда" value={cargoTo} onChange={e => setCargoTo(e.target.value)} className={inputCls + " pl-8"} />
                  </div>
                  <textarea placeholder="Описание груза (размер, вес, особенности)..." value={cargoDesc} onChange={e => setCargoDesc(e.target.value)} rows={3} className={inputCls} />
                </div>
                <div className="bg-white rounded-3xl p-4 shadow-sm space-y-4">
                  <h4 className="font-bold text-slate-600 text-sm">Опции</h4>
                  <div>
                    <p className="text-sm text-slate-700 mb-2 flex items-center gap-2"><span>💳</span> Оплата</p>
                    <div className="flex gap-2">
                      {paymentBtn("cash", cargoPayment, setCargoPayment, "Наличные", "💵")}
                      {paymentBtn("transfer", cargoPayment, setCargoPayment, "Перевод", "📲")}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-slate-700 mb-2">Комментарий</p>
                    <textarea placeholder="Дополнительные пожелания..." value={cargoComment} onChange={e => setCargoComment(e.target.value)} rows={2} className={inputCls} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-700 mb-2">Предлагаемая стоимость</p>
                    <input type="number" placeholder="₽ Ваша цена" value={cargoPrice} onChange={e => setCargoPrice(e.target.value)} className={inputCls} />
                  </div>
                </div>
              </div>
            )}

            <div className="mt-4 mb-2">
              {ordered ? (
                <div className="w-full bg-emerald-500 text-white font-bold py-4 rounded-3xl text-center text-base animate-scale-in">✅ Заказ отправлен! Ожидайте водителя</div>
              ) : (
                <button onClick={handleOrder} className="w-full taxi-gradient text-white font-bold py-4 rounded-3xl shadow-lg shadow-violet-300/40 active:scale-95 transition-transform text-base">
                  Заказать
                </button>
              )}
            </div>
          </div>
        )}

        {activeTab === "profile" && (
          <div className="px-4 pt-5 animate-fade-in">
            <div className="bg-white rounded-3xl p-5 shadow-sm mb-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 taxi-gradient rounded-3xl flex items-center justify-center shadow-lg shadow-violet-300/30 text-2xl">👤</div>
                <div>
                  <h3 className="font-black text-slate-800 text-lg">{userName || "Пассажир"}</h3>
                  <p className="text-slate-400 text-sm">Пассажир</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-50 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #ede9fe, #ddd6fe)" }}>
                    <Icon name="Phone" size={14} className="text-violet-500" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Телефон</p>
                    <p className="text-sm font-semibold text-slate-700">+7 (999) 000-00-00</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-4 shadow-sm mb-4">
              <h4 className="font-black text-slate-800 mb-3 flex items-center gap-2">
                <Icon name="Clock" size={16} className="text-violet-500" />
                История заказов
              </h4>
              {ORDER_HISTORY.map(order => (
                <div key={order.id} className="py-3 border-b border-slate-50 last:border-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-xs text-slate-400 mb-1">{order.date}</p>
                      <p className="text-sm text-slate-700"><span className="text-green-400">●</span> {order.from}</p>
                      <p className="text-sm text-slate-700"><span className="text-red-400">●</span> {order.to}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-800">{order.cost} ₽</p>
                      <span className="text-xs bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full font-medium">{order.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button onClick={onLogout} className="w-full bg-red-50 text-red-400 font-bold py-4 rounded-3xl border-2 border-red-100 active:scale-95 transition-transform text-sm">
              Выйти из аккаунта
            </button>
          </div>
        )}
      </div>

      {/* Bottom nav */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white/90 backdrop-blur-lg border-t border-violet-100/60 flex safe-bottom shadow-xl shadow-violet-100/50">
        <button onClick={() => setActiveTab("order")} className={`flex-1 flex flex-col items-center py-3 gap-0.5 transition-colors ${activeTab === "order" ? "text-violet-600" : "text-slate-300"}`}>
          <Icon name="Car" size={22} />
          <span className="text-[10px] font-bold">Заказ</span>
        </button>
        <button onClick={() => setActiveTab("profile")} className={`flex-1 flex flex-col items-center py-3 gap-0.5 transition-colors ${activeTab === "profile" ? "text-violet-600" : "text-slate-300"}`}>
          <Icon name="User" size={22} />
          <span className="text-[10px] font-bold">Профиль</span>
        </button>
      </div>
    </div>
  );
}
