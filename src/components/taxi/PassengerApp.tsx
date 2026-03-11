import { useState } from "react";
import Icon from "@/components/ui/icon";
import TaxiLogo from "./TaxiLogo";

interface Props {
  userName: string;
  onLogout: () => void;
}

type Tariff = "standard" | "delivery" | "cargo";
type PaymentType = "cash" | "transfer";

const ORDER_HISTORY = [
  { id: 1, date: "10 марта", from: "ул. Ленина, 12", to: "ул. Мира, 45", cost: 350 },
  { id: 2, date: "8 марта", from: "Аэропорт", to: "ул. Советская, 3", cost: 890 },
  { id: 3, date: "5 марта", from: "ул. Гагарина, 7", to: "ТЦ Планета", cost: 280 },
];

const inputCls = "w-full bg-[#f1f3f4] border border-transparent rounded-2xl px-4 py-3.5 text-[#17212b] placeholder-[#a0adb8] focus:outline-none focus:border-[#2AABEE] focus:bg-white focus:ring-2 focus:ring-[#2AABEE]/15 text-[14px] transition-all resize-none";

function SectionCard({ children }: { children: React.ReactNode }) {
  return <div className="bg-white rounded-2xl p-4 border border-[#e6ebf1] space-y-3">{children}</div>;
}
function OptionsCard({ children }: { children: React.ReactNode }) {
  return <div className="bg-white rounded-2xl p-4 border border-[#e6ebf1] space-y-4">{children}</div>;
}
function PayBtn({ val, cur, set, label, emoji }: { val: PaymentType; cur: PaymentType; set: (v: PaymentType) => void; label: string; emoji: string }) {
  return (
    <button onClick={() => set(val)}
      className={`flex-1 py-2.5 rounded-xl text-[13px] font-semibold border-2 transition-all ${cur === val ? "border-[#2AABEE] bg-[#e8f6fd] text-[#006aad]" : "border-[#e6ebf1] text-[#708499] bg-white"}`}>
      {emoji} {label}
    </button>
  );
}

export default function PassengerApp({ userName, onLogout }: Props) {
  const [activeTab, setActiveTab] = useState<"order" | "profile">("order");
  const [tariff, setTariff] = useState<Tariff>("standard");

  const [from, setFrom] = useState(""); const [via, setVia] = useState(""); const [to, setTo] = useState("");
  const [children, setChildren] = useState(0); const [luggage, setLuggage] = useState(false);
  const [payment, setPayment] = useState<PaymentType>("cash"); const [comment, setComment] = useState(""); const [price, setPrice] = useState("");

  const [delivTo, setDelivTo] = useState(""); const [delivWhat, setDelivWhat] = useState("");
  const [delivPayment, setDelivPayment] = useState<PaymentType>("cash"); const [delivComment, setDelivComment] = useState("");

  const [cargoFrom, setCargoFrom] = useState(""); const [cargoTo, setCargoTo] = useState(""); const [cargoDesc, setCargoDesc] = useState("");
  const [cargoPayment, setCargoPayment] = useState<PaymentType>("cash"); const [cargoComment, setCargoComment] = useState(""); const [cargoPrice, setCargoPrice] = useState("");

  const [ordered, setOrdered] = useState(false);
  const handleOrder = () => { setOrdered(true); setTimeout(() => setOrdered(false), 3000); };

  const tariffTabs: { id: Tariff; label: string; icon: string }[] = [
    { id: "standard", label: "Стандарт", icon: "🚕" },
    { id: "delivery", label: "Доставка", icon: "📦" },
    { id: "cargo", label: "Грузовой", icon: "🚚" },
  ];

  return (
    <div className="min-h-dvh flex flex-col" style={{ background: "#f1f3f4" }}>
      <div className="tg-gradient px-5 pt-12 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="drop-shadow-lg"><TaxiLogo size={38} /></div>
          <div>
            <h2 className="text-white font-black text-[16px] leading-tight">Алло Антипиха</h2>
            <p className="text-white/75 text-[11px]">{userName || "Пассажир"}</p>
          </div>
        </div>
        <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center text-lg">👤</div>
      </div>

      <div className="flex-1 overflow-y-auto pb-24 px-4 pt-4">
        {activeTab === "order" && (
          <div className="space-y-3 animate-fade-in">
            <div className="bg-white rounded-2xl p-1.5 flex gap-1 border border-[#e6ebf1]">
              {tariffTabs.map(t => (
                <button key={t.id} onClick={() => setTariff(t.id)}
                  className={`flex-1 py-2.5 rounded-xl text-[12px] font-semibold transition-all flex items-center justify-center gap-1.5 ${tariff === t.id ? "tg-gradient text-white shadow-sm" : "text-[#708499]"}`}>
                  {t.icon} {t.label}
                </button>
              ))}
            </div>

            {tariff === "standard" && (<>
              <SectionCard>
                <p className="font-bold text-[#17212b] text-[14px]">🚕 Тариф Стандарт</p>
                <div className="relative"><span className="absolute left-3.5 top-4 w-2 h-2 rounded-full bg-[#4dcd5e]" /><input type="text" placeholder="Откуда" value={from} onChange={e => setFrom(e.target.value)} className={inputCls + " pl-8"} /></div>
                <div className="relative"><span className="absolute left-3.5 top-4 w-2 h-2 rounded-full border-2 border-[#2AABEE]" /><input type="text" placeholder="Промежуточный адрес (необязательно)" value={via} onChange={e => setVia(e.target.value)} className={inputCls + " pl-8"} /></div>
                <div className="relative"><span className="absolute left-3.5 top-4 w-2 h-2 rounded-full bg-red-400" /><input type="text" placeholder="Куда" value={to} onChange={e => setTo(e.target.value)} className={inputCls + " pl-8"} /></div>
              </SectionCard>
              <OptionsCard>
                <p className="text-[12px] font-bold text-[#708499] uppercase tracking-wide">Опции</p>
                <div className="flex items-center justify-between">
                  <span className="text-[14px] text-[#17212b]">👶 Дети до 7 лет</span>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setChildren(Math.max(0, children - 1))} className="w-8 h-8 rounded-full border-2 border-[#e6ebf1] flex items-center justify-center text-[#2AABEE] font-bold text-lg leading-none">−</button>
                    <span className="font-bold text-[#17212b] w-4 text-center">{children}</span>
                    <button onClick={() => setChildren(children + 1)} className="w-8 h-8 rounded-full bg-[#e8f6fd] flex items-center justify-center text-[#2AABEE] font-bold text-lg leading-none">+</button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[14px] text-[#17212b]">🧳 Багаж</span>
                  <button onClick={() => setLuggage(!luggage)} className={`w-12 h-6 rounded-full relative transition-colors ${luggage ? "tg-gradient" : "bg-[#e6ebf1]"}`}>
                    <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${luggage ? "translate-x-6" : "translate-x-0.5"}`} />
                  </button>
                </div>
                <div>
                  <p className="text-[13px] text-[#708499] font-semibold mb-2">💳 Оплата</p>
                  <div className="flex gap-2"><PayBtn val="cash" cur={payment} set={setPayment} label="Наличные" emoji="💵" /><PayBtn val="transfer" cur={payment} set={setPayment} label="Перевод" emoji="📲" /></div>
                </div>
                <div>
                  <p className="text-[13px] text-[#708499] font-semibold mb-2">Комментарий</p>
                  <textarea placeholder="Пожелания к поездке..." value={comment} onChange={e => setComment(e.target.value)} rows={2} className={inputCls} />
                </div>
                <div>
                  <p className="text-[13px] text-[#708499] font-semibold mb-2">Предлагаемая стоимость</p>
                  <input type="number" placeholder="₽ Ваша цена" value={price} onChange={e => setPrice(e.target.value)} className={inputCls} />
                </div>
              </OptionsCard>
            </>)}

            {tariff === "delivery" && (<>
              <SectionCard>
                <p className="font-bold text-[#17212b] text-[14px]">📦 Тариф Доставка</p>
                <div className="relative"><span className="absolute left-3.5 top-4 w-2 h-2 rounded-full bg-red-400" /><input type="text" placeholder="Куда доставить" value={delivTo} onChange={e => setDelivTo(e.target.value)} className={inputCls + " pl-8"} /></div>
                <textarea placeholder="Что нужно доставить..." value={delivWhat} onChange={e => setDelivWhat(e.target.value)} rows={3} className={inputCls} />
              </SectionCard>
              <OptionsCard>
                <p className="text-[12px] font-bold text-[#708499] uppercase tracking-wide">Опции</p>
                <div><p className="text-[13px] text-[#708499] font-semibold mb-2">💳 Оплата</p><div className="flex gap-2"><PayBtn val="cash" cur={delivPayment} set={setDelivPayment} label="Наличные" emoji="💵" /><PayBtn val="transfer" cur={delivPayment} set={setDelivPayment} label="Перевод" emoji="📲" /></div></div>
                <div><p className="text-[13px] text-[#708499] font-semibold mb-2">Комментарий</p><textarea placeholder="Дополнительные инструкции..." value={delivComment} onChange={e => setDelivComment(e.target.value)} rows={2} className={inputCls} /></div>
              </OptionsCard>
            </>)}

            {tariff === "cargo" && (<>
              <SectionCard>
                <p className="font-bold text-[#17212b] text-[14px]">🚚 Тариф Грузовой</p>
                <div className="relative"><span className="absolute left-3.5 top-4 w-2 h-2 rounded-full bg-[#4dcd5e]" /><input type="text" placeholder="Откуда" value={cargoFrom} onChange={e => setCargoFrom(e.target.value)} className={inputCls + " pl-8"} /></div>
                <div className="relative"><span className="absolute left-3.5 top-4 w-2 h-2 rounded-full bg-red-400" /><input type="text" placeholder="Куда" value={cargoTo} onChange={e => setCargoTo(e.target.value)} className={inputCls + " pl-8"} /></div>
                <textarea placeholder="Описание груза (размер, вес, особенности)..." value={cargoDesc} onChange={e => setCargoDesc(e.target.value)} rows={3} className={inputCls} />
              </SectionCard>
              <OptionsCard>
                <p className="text-[12px] font-bold text-[#708499] uppercase tracking-wide">Опции</p>
                <div><p className="text-[13px] text-[#708499] font-semibold mb-2">💳 Оплата</p><div className="flex gap-2"><PayBtn val="cash" cur={cargoPayment} set={setCargoPayment} label="Наличные" emoji="💵" /><PayBtn val="transfer" cur={cargoPayment} set={setCargoPayment} label="Перевод" emoji="📲" /></div></div>
                <div><p className="text-[13px] text-[#708499] font-semibold mb-2">Комментарий</p><textarea placeholder="Дополнительные пожелания..." value={cargoComment} onChange={e => setCargoComment(e.target.value)} rows={2} className={inputCls} /></div>
                <div><p className="text-[13px] text-[#708499] font-semibold mb-2">Предлагаемая стоимость</p><input type="number" placeholder="₽ Ваша цена" value={cargoPrice} onChange={e => setCargoPrice(e.target.value)} className={inputCls} /></div>
              </OptionsCard>
            </>)}

            <div className="pb-2">
              {ordered
                ? <div className="w-full bg-[#4dcd5e] text-white font-bold py-4 rounded-2xl text-center text-[15px] animate-scale-in">✅ Заказ принят! Ожидайте водителя</div>
                : <button onClick={handleOrder} className="w-full tg-gradient text-white font-bold py-4 rounded-2xl shadow-md shadow-[#2AABEE]/25 active:scale-95 transition-all text-[15px]">Заказать</button>
              }
            </div>
          </div>
        )}

        {activeTab === "profile" && (
          <div className="space-y-3 animate-fade-in">
            <div className="bg-white rounded-2xl p-4 border border-[#e6ebf1]">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 tg-gradient rounded-full flex items-center justify-center text-2xl shadow-md">👤</div>
                <div>
                  <h3 className="font-black text-[#17212b] text-[16px]">{userName || "Пассажир"}</h3>
                  <p className="text-[#708499] text-[13px]">Пассажир</p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-[#f1f3f4] flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#e8f6fd] flex items-center justify-center"><Icon name="Phone" size={14} className="text-[#2AABEE]" /></div>
                <div><p className="text-[11px] text-[#708499]">Телефон</p><p className="text-[14px] font-semibold text-[#17212b]">+7 (999) 000-00-00</p></div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-[#e6ebf1] overflow-hidden">
              <div className="px-4 py-3 flex items-center gap-2 border-b border-[#f1f3f4]">
                <Icon name="Clock" size={15} className="text-[#2AABEE]" />
                <h4 className="font-bold text-[#17212b] text-[14px]">История заказов</h4>
              </div>
              {ORDER_HISTORY.map((order, i) => (
                <div key={order.id} className={`px-4 py-3 ${i < ORDER_HISTORY.length - 1 ? "border-b border-[#f1f3f4]" : ""}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0 pr-2">
                      <p className="text-[11px] text-[#708499] mb-1">{order.date}</p>
                      <p className="text-[13px] text-[#17212b] truncate"><span className="text-[#4dcd5e]">●</span> {order.from}</p>
                      <p className="text-[13px] text-[#17212b] truncate"><span className="text-red-400">●</span> {order.to}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-bold text-[#17212b] text-[14px]">{order.cost} ₽</p>
                      <span className="text-[11px] bg-[#e8f8ec] text-[#2ab54c] px-2 py-0.5 rounded-full font-medium">Выполнен</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button onClick={onLogout} className="w-full bg-white text-red-500 font-semibold py-3.5 rounded-2xl border border-[#e6ebf1] active:scale-95 transition-all text-[14px]">
              Выйти из аккаунта
            </button>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-[#e6ebf1] flex safe-bottom">
        <button onClick={() => setActiveTab("order")} className={`flex-1 flex flex-col items-center py-3 gap-0.5 ${activeTab === "order" ? "text-[#2AABEE]" : "text-[#c5d0dc]"}`}>
          <Icon name="Car" size={22} /><span className="text-[10px] font-semibold">Заказ</span>
        </button>
        <button onClick={() => setActiveTab("profile")} className={`flex-1 flex flex-col items-center py-3 gap-0.5 ${activeTab === "profile" ? "text-[#2AABEE]" : "text-[#c5d0dc]"}`}>
          <Icon name="User" size={22} /><span className="text-[10px] font-semibold">Профиль</span>
        </button>
      </div>
    </div>
  );
}
