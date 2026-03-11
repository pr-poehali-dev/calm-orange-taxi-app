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

export default function PassengerApp({ userName, onLogout }: Props) {
  const [activeTab, setActiveTab] = useState<"order" | "profile">("order");
  const [tariff, setTariff] = useState<Tariff>("standard");

  // Standard form
  const [from, setFrom] = useState("");
  const [via, setVia] = useState("");
  const [to, setTo] = useState("");
  const [children, setChildren] = useState(0);
  const [luggage, setLuggage] = useState(false);
  const [payment, setPayment] = useState<PaymentType>("cash");
  const [comment, setComment] = useState("");
  const [price, setPrice] = useState("");

  // Delivery form
  const [delivTo, setDelivTo] = useState("");
  const [delivWhat, setDelivWhat] = useState("");
  const [delivPayment, setDelivPayment] = useState<PaymentType>("cash");
  const [delivComment, setDelivComment] = useState("");

  // Cargo form
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

  return (
    <div className="min-h-dvh flex flex-col">
      {/* Top bar */}
      <div className="taxi-gradient px-5 pt-12 pb-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-orange-100 text-xs font-medium">Добро пожаловать</p>
            <h2 className="text-white font-black text-lg">{userName || "Пассажир"}</h2>
          </div>
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <span className="text-xl">👤</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-24">
        {activeTab === "order" && (
          <div className="px-4 pt-5 animate-fade-in">
            {/* Tariff selector */}
            <div className="bg-white rounded-2xl p-1.5 flex gap-1 mb-5 shadow-sm">
              {tariffTabs.map(t => (
                <button
                  key={t.id}
                  onClick={() => setTariff(t.id)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    tariff === t.id
                      ? "taxi-gradient text-white shadow-md"
                      : "text-stone-500"
                  }`}
                >
                  <span>{t.icon}</span>
                  {t.label}
                </button>
              ))}
            </div>

            {/* Standard tariff */}
            {tariff === "standard" && (
              <div className="space-y-3 animate-fade-in">
                <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
                  <h3 className="font-black text-stone-800 text-base flex items-center gap-2">
                    <span>🚕</span> Тариф Стандарт
                  </h3>
                  <div className="relative">
                    <div className="absolute left-4 top-3.5 w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                    <input
                      type="text"
                      placeholder="Откуда"
                      value={from}
                      onChange={e => setFrom(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-100 rounded-xl pl-8 pr-4 py-3 text-sm text-stone-800 placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-orange-300"
                    />
                  </div>
                  <div className="relative">
                    <div className="absolute left-4 top-3.5 w-2 h-2 rounded-full border-2 border-orange-400 flex-shrink-0" />
                    <input
                      type="text"
                      placeholder="Промежуточный адрес (если нужно)"
                      value={via}
                      onChange={e => setVia(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-100 rounded-xl pl-8 pr-4 py-3 text-sm text-stone-800 placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-orange-300"
                    />
                  </div>
                  <div className="relative">
                    <div className="absolute left-4 top-3.5 w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
                    <input
                      type="text"
                      placeholder="Куда"
                      value={to}
                      onChange={e => setTo(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-100 rounded-xl pl-8 pr-4 py-3 text-sm text-stone-800 placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-orange-300"
                    />
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-4 shadow-sm space-y-4">
                  <h4 className="font-bold text-stone-700 text-sm">Опции</h4>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span>👶</span>
                      <span className="text-sm text-stone-700">Дети до 7 лет</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button onClick={() => setChildren(Math.max(0, children - 1))} className="w-7 h-7 rounded-full border-2 border-orange-300 flex items-center justify-center text-orange-500 font-bold text-sm">-</button>
                      <span className="font-bold text-stone-800 w-4 text-center">{children}</span>
                      <button onClick={() => setChildren(children + 1)} className="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 font-bold text-sm">+</button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span>🧳</span>
                      <span className="text-sm text-stone-700">Багаж</span>
                    </div>
                    <button
                      onClick={() => setLuggage(!luggage)}
                      className={`w-12 h-6 rounded-full transition-colors ${luggage ? "taxi-gradient" : "bg-stone-200"} relative`}
                    >
                      <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${luggage ? "translate-x-6" : "translate-x-0.5"}`} />
                    </button>
                  </div>

                  <div>
                    <p className="text-sm text-stone-700 mb-2 flex items-center gap-2"><span>💳</span> Оплата</p>
                    <div className="flex gap-2">
                      <button onClick={() => setPayment("cash")} className={`flex-1 py-2 rounded-xl text-xs font-bold border-2 transition-all ${payment === "cash" ? "border-orange-400 bg-orange-50 text-orange-700" : "border-stone-100 text-stone-400"}`}>💵 Наличные</button>
                      <button onClick={() => setPayment("transfer")} className={`flex-1 py-2 rounded-xl text-xs font-bold border-2 transition-all ${payment === "transfer" ? "border-orange-400 bg-orange-50 text-orange-700" : "border-stone-100 text-stone-400"}`}>📲 Перевод</button>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-stone-700 mb-2">Комментарий</p>
                    <textarea
                      placeholder="Пожелания к поездке..."
                      value={comment}
                      onChange={e => setComment(e.target.value)}
                      rows={2}
                      className="w-full bg-stone-50 border border-stone-100 rounded-xl px-4 py-3 text-sm text-stone-800 placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-orange-300 resize-none"
                    />
                  </div>

                  <div>
                    <p className="text-sm text-stone-700 mb-2">Предлагаемая стоимость</p>
                    <input
                      type="number"
                      placeholder="₽ Ваша цена"
                      value={price}
                      onChange={e => setPrice(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-100 rounded-xl px-4 py-3 text-sm text-stone-800 placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-orange-300"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Delivery tariff */}
            {tariff === "delivery" && (
              <div className="space-y-3 animate-fade-in">
                <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
                  <h3 className="font-black text-stone-800 text-base flex items-center gap-2">
                    <span>📦</span> Тариф Доставка
                  </h3>
                  <div className="relative">
                    <div className="absolute left-4 top-3.5 w-2 h-2 rounded-full bg-red-500" />
                    <input
                      type="text"
                      placeholder="Куда доставить"
                      value={delivTo}
                      onChange={e => setDelivTo(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-100 rounded-xl pl-8 pr-4 py-3 text-sm text-stone-800 placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-orange-300"
                    />
                  </div>
                  <textarea
                    placeholder="Что нужно доставить..."
                    value={delivWhat}
                    onChange={e => setDelivWhat(e.target.value)}
                    rows={3}
                    className="w-full bg-stone-50 border border-stone-100 rounded-xl px-4 py-3 text-sm text-stone-800 placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-orange-300 resize-none"
                  />
                </div>

                <div className="bg-white rounded-2xl p-4 shadow-sm space-y-4">
                  <h4 className="font-bold text-stone-700 text-sm">Опции</h4>
                  <div>
                    <p className="text-sm text-stone-700 mb-2 flex items-center gap-2"><span>💳</span> Оплата</p>
                    <div className="flex gap-2">
                      <button onClick={() => setDelivPayment("cash")} className={`flex-1 py-2 rounded-xl text-xs font-bold border-2 transition-all ${delivPayment === "cash" ? "border-orange-400 bg-orange-50 text-orange-700" : "border-stone-100 text-stone-400"}`}>💵 Наличные</button>
                      <button onClick={() => setDelivPayment("transfer")} className={`flex-1 py-2 rounded-xl text-xs font-bold border-2 transition-all ${delivPayment === "transfer" ? "border-orange-400 bg-orange-50 text-orange-700" : "border-stone-100 text-stone-400"}`}>📲 Перевод</button>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-stone-700 mb-2">Комментарий</p>
                    <textarea
                      placeholder="Дополнительные инструкции..."
                      value={delivComment}
                      onChange={e => setDelivComment(e.target.value)}
                      rows={2}
                      className="w-full bg-stone-50 border border-stone-100 rounded-xl px-4 py-3 text-sm text-stone-800 placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-orange-300 resize-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Cargo tariff */}
            {tariff === "cargo" && (
              <div className="space-y-3 animate-fade-in">
                <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
                  <h3 className="font-black text-stone-800 text-base flex items-center gap-2">
                    <span>🚚</span> Тариф Грузовой
                  </h3>
                  <div className="relative">
                    <div className="absolute left-4 top-3.5 w-2 h-2 rounded-full bg-green-500" />
                    <input
                      type="text"
                      placeholder="Откуда"
                      value={cargoFrom}
                      onChange={e => setCargoFrom(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-100 rounded-xl pl-8 pr-4 py-3 text-sm text-stone-800 placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-orange-300"
                    />
                  </div>
                  <div className="relative">
                    <div className="absolute left-4 top-3.5 w-2 h-2 rounded-full bg-red-500" />
                    <input
                      type="text"
                      placeholder="Куда"
                      value={cargoTo}
                      onChange={e => setCargoTo(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-100 rounded-xl pl-8 pr-4 py-3 text-sm text-stone-800 placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-orange-300"
                    />
                  </div>
                  <textarea
                    placeholder="Описание груза (размер, вес, особенности)..."
                    value={cargoDesc}
                    onChange={e => setCargoDesc(e.target.value)}
                    rows={3}
                    className="w-full bg-stone-50 border border-stone-100 rounded-xl px-4 py-3 text-sm text-stone-800 placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-orange-300 resize-none"
                  />
                </div>

                <div className="bg-white rounded-2xl p-4 shadow-sm space-y-4">
                  <h4 className="font-bold text-stone-700 text-sm">Опции</h4>
                  <div>
                    <p className="text-sm text-stone-700 mb-2 flex items-center gap-2"><span>💳</span> Оплата</p>
                    <div className="flex gap-2">
                      <button onClick={() => setCargoPayment("cash")} className={`flex-1 py-2 rounded-xl text-xs font-bold border-2 transition-all ${cargoPayment === "cash" ? "border-orange-400 bg-orange-50 text-orange-700" : "border-stone-100 text-stone-400"}`}>💵 Наличные</button>
                      <button onClick={() => setCargoPayment("transfer")} className={`flex-1 py-2 rounded-xl text-xs font-bold border-2 transition-all ${cargoPayment === "transfer" ? "border-orange-400 bg-orange-50 text-orange-700" : "border-stone-100 text-stone-400"}`}>📲 Перевод</button>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-stone-700 mb-2">Комментарий</p>
                    <textarea
                      placeholder="Дополнительные пожелания..."
                      value={cargoComment}
                      onChange={e => setCargoComment(e.target.value)}
                      rows={2}
                      className="w-full bg-stone-50 border border-stone-100 rounded-xl px-4 py-3 text-sm text-stone-800 placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-orange-300 resize-none"
                    />
                  </div>
                  <div>
                    <p className="text-sm text-stone-700 mb-2">Предлагаемая стоимость</p>
                    <input
                      type="number"
                      placeholder="₽ Ваша цена"
                      value={cargoPrice}
                      onChange={e => setCargoPrice(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-100 rounded-xl px-4 py-3 text-sm text-stone-800 placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-orange-300"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Order button */}
            <div className="mt-4 mb-2">
              {ordered ? (
                <div className="w-full bg-green-500 text-white font-bold py-4 rounded-2xl text-center text-base animate-scale-in">
                  ✅ Заказ отправлен! Ожидайте водителя
                </div>
              ) : (
                <button
                  onClick={handleOrder}
                  className="w-full taxi-gradient text-white font-bold py-4 rounded-2xl shadow-lg shadow-orange-200 active:scale-95 transition-transform text-base"
                >
                  Заказать
                </button>
              )}
            </div>
          </div>
        )}

        {activeTab === "profile" && (
          <div className="px-4 pt-5 animate-fade-in">
            <div className="bg-white rounded-2xl p-5 shadow-sm mb-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 taxi-gradient rounded-2xl flex items-center justify-center shadow-md">
                  <span className="text-2xl">👤</span>
                </div>
                <div>
                  <h3 className="font-black text-stone-800 text-lg">{userName || "Пассажир"}</h3>
                  <p className="text-stone-400 text-sm">Пассажир</p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-stone-100 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center">
                    <Icon name="Phone" size={14} className="text-orange-500" />
                  </div>
                  <div>
                    <p className="text-xs text-stone-400">Телефон</p>
                    <p className="text-sm font-semibold text-stone-700">+7 (999) 000-00-00</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
              <h4 className="font-black text-stone-800 mb-3 flex items-center gap-2">
                <Icon name="Clock" size={16} className="text-orange-500" />
                История заказов
              </h4>
              {ORDER_HISTORY.map(order => (
                <div key={order.id} className="py-3 border-b border-stone-50 last:border-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-xs text-stone-400 mb-1">{order.date}</p>
                      <p className="text-sm text-stone-700">
                        <span className="text-green-500">●</span> {order.from}
                      </p>
                      <p className="text-sm text-stone-700">
                        <span className="text-red-500">●</span> {order.to}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-stone-800">{order.cost} ₽</p>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">{order.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={onLogout}
              className="w-full bg-red-50 text-red-500 font-bold py-4 rounded-2xl border-2 border-red-100 active:scale-95 transition-transform text-sm"
            >
              Выйти из аккаунта
            </button>
          </div>
        )}
      </div>

      {/* Bottom navigation */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-orange-100 flex safe-bottom shadow-lg">
        <button
          onClick={() => setActiveTab("order")}
          className={`flex-1 flex flex-col items-center py-3 gap-0.5 transition-colors ${activeTab === "order" ? "text-orange-500" : "text-stone-400"}`}
        >
          <Icon name="Car" size={22} />
          <span className="text-[10px] font-bold">Заказ</span>
        </button>
        <button
          onClick={() => setActiveTab("profile")}
          className={`flex-1 flex flex-col items-center py-3 gap-0.5 transition-colors ${activeTab === "profile" ? "text-orange-500" : "text-stone-400"}`}
        >
          <Icon name="User" size={22} />
          <span className="text-[10px] font-bold">Профиль</span>
        </button>
      </div>
    </div>
  );
}
