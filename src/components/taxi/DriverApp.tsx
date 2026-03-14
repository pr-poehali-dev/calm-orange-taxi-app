import { useState } from "react";
import Icon from "@/components/ui/icon";
import TaxiLogo from "./TaxiLogo";

interface Props {
  userName: string;
  onLogout: () => void;
}

type OrderStatus = "free" | "in_progress" | "done";
interface Order {
  id: number; tariff: string; tariffIcon: string; from?: string; to: string; via?: string;
  description?: string; payment: string; comment?: string; price?: number;
  children?: number; luggage?: boolean; time: string; status: OrderStatus;
}

const INITIAL_ORDERS: Order[] = [
  { id: 1, tariff: "Стандарт", tariffIcon: "🚕", from: "ул. Ленина, 12", to: "Аэропорт", payment: "Перевод", comment: "Пожалуйста, помогите с вещами", price: 650, children: 0, luggage: true, time: "10:25", status: "free" },
  { id: 2, tariff: "Доставка", tariffIcon: "📦", to: "ул. Советская, 7, кв 14", description: "Пакет с документами", payment: "Наличные", comment: "Позвоните перед доставкой", time: "10:42", status: "free" },
  { id: 3, tariff: "Стандарт", tariffIcon: "🚕", from: "ТЦ Планета", to: "пр. Мира, 88", via: "Аптека на Садовой", payment: "Наличные", children: 2, time: "11:05", status: "free" },
  { id: 4, tariff: "Грузовой", tariffIcon: "🚚", from: "Склад Промышленная", to: "ул. Новая, 34", description: "Мебель: диван + 2 кресла", payment: "Перевод", price: 2500, time: "11:30", status: "free" },
];

const ST: Record<OrderStatus, { label: string; color: string; bg: string }> = {
  free: { label: "Свободен", color: "text-[#2ab54c]", bg: "bg-[#e8f8ec]" },
  in_progress: { label: "В работе", color: "text-[#006aad]", bg: "bg-[#e8f6fd]" },
  done: { label: "Выполнен", color: "text-[#708499]", bg: "bg-[#f1f3f4]" },
};

export default function DriverApp({ userName, onLogout }: Props) {
  const [activeTab, setActiveTab] = useState<"orders" | "profile">("orders");
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const takeOrder = (id: number) => setOrders(p => p.map(o => o.id === id ? { ...o, status: "in_progress" as OrderStatus } : o));
  const completeOrder = (id: number) => setOrders(p => p.map(o => o.id === id ? { ...o, status: "done" as OrderStatus } : o));

  const freeOrders = orders.filter(o => o.status === "free");
  const myOrders = orders.filter(o => o.status === "in_progress");
  const doneOrders = orders.filter(o => o.status === "done");

  const renderOrder = (order: Order) => {
    const st = ST[order.status];
    const isOpen = expandedId === order.id;
    return (
      <div key={order.id} className="bg-white rounded-2xl border border-[#e6ebf1] overflow-hidden mb-2">
        <button className="w-full text-left px-4 py-3.5 flex items-center justify-between" onClick={() => setExpandedId(isOpen ? null : order.id)}>
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-xl flex-shrink-0">{order.tariffIcon}</span>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-[#17212b] text-[14px]">{order.tariff}</span>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${st.bg} ${st.color}`}>{st.label}</span>
              </div>
              <p className="text-[12px] text-[#708499] mt-0.5 truncate">
                {order.from ? `${order.from} → ${order.to}` : `📦 ${order.to}`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 ml-2">
            <span className="text-[12px] text-[#708499]">{order.time}</span>
            <Icon name={isOpen ? "ChevronUp" : "ChevronDown"} size={14} className="text-[#c5d0dc]" />
          </div>
        </button>

        {isOpen && (
          <div className="px-4 pb-4 border-t border-[#f1f3f4] space-y-3 animate-fade-in pt-3">
            <div className="bg-[#f1f3f4] rounded-xl p-3 space-y-1.5">
              {order.from && <div className="flex gap-2 text-[13px]"><span className="text-[#4dcd5e] flex-shrink-0">●</span><span className="text-[#17212b]">{order.from}</span></div>}
              {order.via && <div className="flex gap-2 text-[13px]"><span className="text-[#2AABEE] flex-shrink-0">●</span><span className="text-[#17212b]">Через: {order.via}</span></div>}
              <div className="flex gap-2 text-[13px]"><span className="text-red-400 flex-shrink-0">●</span><span className="text-[#17212b]">{order.to}</span></div>
            </div>

            {order.description && (
              <div className="flex items-start gap-2 text-[13px] text-[#708499]">
                <Icon name="Package" size={14} className="text-[#2AABEE] flex-shrink-0 mt-0.5" />
                <span>{order.description}</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              <div className="bg-[#f1f3f4] rounded-xl p-2.5">
                <p className="text-[11px] text-[#708499]">Оплата</p>
                <p className="text-[13px] font-semibold text-[#17212b]">{order.payment}</p>
              </div>
              {order.price && <div className="bg-[#f1f3f4] rounded-xl p-2.5"><p className="text-[11px] text-[#708499]">Стоимость</p><p className="text-[13px] font-semibold text-[#17212b]">{order.price} ₽</p></div>}
              {(order.children ?? 0) > 0 && <div className="bg-[#f1f3f4] rounded-xl p-2.5"><p className="text-[11px] text-[#708499]">Дети</p><p className="text-[13px] font-semibold text-[#17212b]">{order.children} чел.</p></div>}
              {order.luggage && <div className="bg-[#f1f3f4] rounded-xl p-2.5"><p className="text-[11px] text-[#708499]">Багаж</p><p className="text-[13px] font-semibold text-[#17212b]">Есть</p></div>}
            </div>

            {order.comment && (
              <div className="bg-[#e8f6fd] rounded-xl p-3 flex gap-2">
                <Icon name="MessageCircle" size={13} className="text-[#2AABEE] flex-shrink-0 mt-0.5" />
                <p className="text-[13px] text-[#17212b]">{order.comment}</p>
              </div>
            )}

            {order.status === "free" && (
              <button onClick={() => takeOrder(order.id)} className="w-full text-white font-semibold py-3 rounded-xl text-[14px] active:scale-95 transition-all" style={{ background: "#007e7a" }}>
                Взять в работу
              </button>
            )}
            {order.status === "in_progress" && (
              <div className="flex gap-2">
                <button className="flex-1 bg-white text-[#2d3540] font-semibold py-3 rounded-xl text-[14px] active:scale-95 transition-all border border-[#e6ebf1]">
                  Действия
                </button>
                <button onClick={() => completeOrder(order.id)} className="flex-1 text-white font-semibold py-3 rounded-xl text-[14px] active:scale-95 transition-all" style={{ background: "#007e7a" }}>
                  Завершить
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-dvh flex flex-col" style={{ background: "#f1f3f4" }}>
      <div className="px-5 pt-12 pb-4 flex items-center justify-between" style={{ background: "#2d3540" }}>
        <div className="flex items-center gap-3">
          <div className="drop-shadow-lg"><TaxiLogo size={38} /></div>
          <div>
            <h2 className="text-white font-black text-[16px] leading-tight">Алло Антипиха</h2>
            <p className="text-white/75 text-[11px]">{userName}</p>
          </div>
        </div>
        <div className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center text-lg">🚗</div>
      </div>

      <div className="flex-1 overflow-y-auto pb-24 px-4 pt-4">
        {activeTab === "orders" && (
          <div className="animate-fade-in">
            {myOrders.length > 0 && (
              <div className="mb-4">
                <p className="text-[11px] font-bold text-[#2AABEE] uppercase tracking-wider mb-2">Мои заказы</p>
                {myOrders.map(renderOrder)}
              </div>
            )}
            <p className="text-[11px] font-bold text-[#708499] uppercase tracking-wider mb-2">Свободные заказы ({freeOrders.length})</p>
            {freeOrders.length === 0 && (
              <div className="text-center py-12">
                <span className="text-4xl block mb-3">🚦</span>
                <p className="text-[14px] font-medium text-[#708499]">Новых заказов пока нет</p>
              </div>
            )}
            {freeOrders.map(renderOrder)}
            {doneOrders.length > 0 && (
              <div className="mt-3">
                <p className="text-[11px] font-bold text-[#c5d0dc] uppercase tracking-wider mb-2">Выполненные</p>
                {doneOrders.map(renderOrder)}
              </div>
            )}
          </div>
        )}

        {activeTab === "profile" && (
          <div className="space-y-3 animate-fade-in">
            <div className="bg-white rounded-2xl p-4 border border-[#e6ebf1]">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 tg-gradient rounded-full flex items-center justify-center shadow-md text-2xl">🚗</div>
                <div><h3 className="font-black text-[#17212b] text-[16px]">{userName}</h3><p className="text-[#708499] text-[13px]">Водитель</p></div>
              </div>
              <div className="mt-3 pt-3 border-t border-[#f1f3f4] space-y-2.5">
                {[
                  { icon: "Phone", label: "Телефон", val: "+7 (999) 111-22-33" },
                  { icon: "Car", label: "Автомобиль", val: "Toyota Camry · А123БВ" },
                  { icon: "Palette", label: "Цвет", val: "Белый" },
                ].map(row => (
                  <div key={row.icon} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#e8f6fd] flex items-center justify-center flex-shrink-0">
                      <Icon name={row.icon} size={14} className="text-[#2AABEE]" />
                    </div>
                    <div><p className="text-[11px] text-[#708499]">{row.label}</p><p className="text-[14px] font-semibold text-[#17212b]">{row.val}</p></div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-[#e6ebf1] overflow-hidden">
              <div className="px-4 py-3 flex items-center gap-2 border-b border-[#f1f3f4]">
                <Icon name="Clock" size={15} className="text-[#2AABEE]" />
                <h4 className="font-bold text-[#17212b] text-[14px]">История поездок</h4>
              </div>
              {doneOrders.length === 0
                ? <p className="text-[#708499] text-[13px] text-center py-6">Выполненных поездок пока нет</p>
                : doneOrders.map((order, i) => (
                  <div key={order.id} className={`px-4 py-3 ${i < doneOrders.length - 1 ? "border-b border-[#f1f3f4]" : ""}`}>
                    <div className="flex items-center justify-between">
                      <div><p className="text-[12px] text-[#708499]">{order.tariff} · {order.time}</p><p className="text-[14px] text-[#17212b] font-medium">{order.to}</p></div>
                      <span className="text-[11px] bg-[#f1f3f4] text-[#708499] px-2 py-0.5 rounded-full">Выполнен</span>
                    </div>
                  </div>
                ))
              }
            </div>

            <button onClick={onLogout} className="w-full bg-white text-red-500 font-semibold py-3.5 rounded-2xl border border-[#e6ebf1] active:scale-95 transition-all text-[14px]">
              Выйти из аккаунта
            </button>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-[#e6ebf1] flex safe-bottom">
        <button onClick={() => setActiveTab("orders")} className={`flex-1 flex flex-col items-center py-3 gap-0.5 ${activeTab === "orders" ? "text-[#2AABEE]" : "text-[#c5d0dc]"}`}>
          <Icon name="ClipboardList" size={22} /><span className="text-[10px] font-semibold">Заказы</span>
        </button>
        <button onClick={() => setActiveTab("profile")} className={`flex-1 flex flex-col items-center py-3 gap-0.5 ${activeTab === "profile" ? "text-[#2AABEE]" : "text-[#c5d0dc]"}`}>
          <Icon name="User" size={22} /><span className="text-[10px] font-semibold">Профиль</span>
        </button>
      </div>
    </div>
  );
}