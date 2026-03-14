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
  distance?: string; duration?: string;
}

const INITIAL_ORDERS: Order[] = [
  { id: 1, tariff: "Эконом", tariffIcon: "🚕", from: "Южная (НОТ 3 Объединение) улица, 4А (р-н Дачи Антипиха)", to: "Кирова улица, 37 (р-н Витэн)", payment: "Перевод", comment: "дом", price: 315, children: 0, luggage: false, time: "10:25", status: "free", distance: "7.4 км.", duration: "0:00:06" },
  { id: 2, tariff: "Стандарт", tariffIcon: "🚕", from: "ул. Ленина, 12", to: "Аэропорт", payment: "Перевод", comment: "Пожалуйста, помогите с вещами", price: 650, children: 0, luggage: true, time: "10:42", status: "free" },
  { id: 3, tariff: "Доставка", tariffIcon: "📦", to: "ул. Советская, 7, кв 14", description: "Пакет с документами", payment: "Наличные", comment: "Позвоните перед доставкой", time: "11:05", status: "free" },
  { id: 4, tariff: "Грузовой", tariffIcon: "🚚", from: "Склад Промышленная", to: "ул. Новая, 34", description: "Мебель: диван + 2 кресла", payment: "Перевод", price: 2500, time: "11:30", status: "free" },
];

const ST: Record<OrderStatus, { label: string; color: string; bg: string }> = {
  free: { label: "Свободен", color: "#2ab54c", bg: "#e8f8ec" },
  in_progress: { label: "В работе", color: "#009688", bg: "#e0f2f0" },
  done: { label: "Выполнен", color: "#888", bg: "#f0f0f0" },
};

export default function DriverApp({ userName, onLogout }: Props) {
  const [activeTab, setActiveTab] = useState<"orders" | "profile">("orders");
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [showActions, setShowActions] = useState<number | null>(null);

  const takeOrder = (id: number) => setOrders(p => p.map(o => o.id === id ? { ...o, status: "in_progress" as OrderStatus } : o));
  const completeOrder = (id: number) => setOrders(p => p.map(o => o.id === id ? { ...o, status: "done" as OrderStatus } : o));

  const freeOrders = orders.filter(o => o.status === "free");
  const myOrders = orders.filter(o => o.status === "in_progress");
  const doneOrders = orders.filter(o => o.status === "done");

  const renderOrder = (order: Order) => {
    const st = ST[order.status];
    const isOpen = expandedId === order.id;
    const isInProgress = order.status === "in_progress";

    return (
      <div key={order.id} className="bg-white rounded-2xl overflow-hidden mb-2" style={{ border: "1px solid #e8e8e8" }}>
        <button className="w-full text-left px-4 py-3.5 flex items-center justify-between" onClick={() => setExpandedId(isOpen ? null : order.id)}>
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-xl flex-shrink-0">{order.tariffIcon}</span>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-[14px]" style={{ color: "#1a1a1a" }}>{order.tariff}</span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ color: st.color, background: st.bg }}>{st.label}</span>
              </div>
              <p className="text-[12px] mt-0.5 truncate" style={{ color: "#888" }}>
                {order.from ? `${order.from} → ${order.to}` : `📦 ${order.to}`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 ml-2">
            <span className="text-[12px]" style={{ color: "#888" }}>{order.time}</span>
            <Icon name={isOpen ? "ChevronUp" : "ChevronDown"} size={14} style={{ color: "#ccc" } as React.CSSProperties} />
          </div>
        </button>

        {isOpen && (
          <div className="px-4 pb-4 pt-3 space-y-3 animate-fade-in" style={{ borderTop: "1px solid #f0f0f0" }}>
            {order.price && (
              <div>
                <p className="text-[32px] font-black leading-none" style={{ color: "#1a1a1a" }}>{order.price} ₽</p>
                <p className="text-[14px] mt-0.5" style={{ color: "#aaa" }}>{order.payment.toLowerCase()}</p>
              </div>
            )}

            <div className="rounded-2xl p-3 space-y-2" style={{ background: "#f8f8f8" }}>
              {order.from && (
                <div className="flex gap-3 text-[13px]">
                  <span className="mt-1 flex-shrink-0 w-2 h-2 rounded-full" style={{ background: "#009688", marginTop: "4px" }} />
                  <div>
                    <span style={{ color: "#1a1a1a" }}>{order.from}</span>
                    {order.comment && <p style={{ color: "#888" }}>{order.comment}</p>}
                  </div>
                </div>
              )}
              {order.via && (
                <div className="flex gap-3 text-[13px]">
                  <span className="flex-shrink-0 w-2 h-2 rounded-full" style={{ background: "#009688", marginTop: "4px" }} />
                  <span style={{ color: "#1a1a1a" }}>Через: {order.via}</span>
                </div>
              )}
              <div className="flex gap-3 text-[13px]">
                <span className="flex-shrink-0 w-2 h-2 rounded-full" style={{ background: "#009688", marginTop: "4px" }} />
                <span style={{ color: "#1a1a1a" }}>{order.to}</span>
              </div>
            </div>

            {order.description && (
              <div className="flex items-start gap-2 text-[13px]" style={{ color: "#888" }}>
                <Icon name="Package" size={14} style={{ color: "#009688", marginTop: "2px" } as React.CSSProperties} />
                <span>{order.description}</span>
              </div>
            )}

            {(order.distance || order.duration) && (
              <div className="grid grid-cols-2 gap-3">
                {order.distance && (
                  <div>
                    <p className="text-[16px] font-semibold" style={{ color: "#1a1a1a" }}>{order.distance}</p>
                    <p className="text-[12px]" style={{ color: "#aaa" }}>Длина маршрута</p>
                  </div>
                )}
                {order.duration && (
                  <div>
                    <p className="text-[16px] font-semibold" style={{ color: "#1a1a1a" }}>{order.duration}</p>
                    <p className="text-[12px]" style={{ color: "#aaa" }}>Время выполнения заказа</p>
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              {!order.price && (
                <div className="rounded-xl p-2.5" style={{ background: "#f8f8f8" }}>
                  <p className="text-[11px]" style={{ color: "#888" }}>Оплата</p>
                  <p className="text-[13px] font-semibold" style={{ color: "#1a1a1a" }}>{order.payment}</p>
                </div>
              )}
              {(order.children ?? 0) > 0 && (
                <div className="rounded-xl p-2.5" style={{ background: "#f8f8f8" }}>
                  <p className="text-[11px]" style={{ color: "#888" }}>Дети</p>
                  <p className="text-[13px] font-semibold" style={{ color: "#1a1a1a" }}>{order.children} чел.</p>
                </div>
              )}
              {order.luggage && (
                <div className="rounded-xl p-2.5" style={{ background: "#f8f8f8" }}>
                  <p className="text-[11px]" style={{ color: "#888" }}>Багаж</p>
                  <p className="text-[13px] font-semibold" style={{ color: "#1a1a1a" }}>Есть</p>
                </div>
              )}
            </div>

            {order.status === "free" && (
              <button
                onClick={() => takeOrder(order.id)}
                className="w-full font-semibold py-3.5 rounded-2xl text-[15px] text-white active:scale-95 transition-all"
                style={{ background: "#009688" }}
              >
                Взять в работу
              </button>
            )}

            {isInProgress && (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setShowActions(showActions === order.id ? null : order.id)}
                  className="py-3.5 rounded-2xl font-semibold text-[15px] active:scale-95 transition-all"
                  style={{ background: "#fff", border: "2px solid #009688", color: "#009688" }}
                >
                  Действия
                </button>
                <button
                  onClick={() => completeOrder(order.id)}
                  className="py-3.5 rounded-2xl font-semibold text-[15px] text-white active:scale-95 transition-all"
                  style={{ background: "#009688" }}
                >
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
    <div className="min-h-dvh flex flex-col" style={{ background: "#f0f0f0" }}>
      <div className="px-5 pt-12 pb-4 flex items-center justify-between" style={{ background: "#2e3440" }}>
        <div className="flex items-center gap-3">
          <div className="drop-shadow-lg"><TaxiLogo size={38} /></div>
          <div>
            <h2 className="font-black text-[16px] leading-tight text-white">Алло Антипиха</h2>
            <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.55)" }}>{userName}</p>
          </div>
        </div>
        <div className="w-9 h-9 rounded-full flex items-center justify-center text-lg" style={{ background: "rgba(255,255,255,0.12)" }}>🚗</div>
      </div>

      <div className="flex-1 overflow-y-auto pb-24 px-4 pt-4">
        {activeTab === "orders" && (
          <div className="animate-fade-in">
            {myOrders.length > 0 && (
              <div className="mb-4">
                <p className="text-[11px] font-bold uppercase tracking-wider mb-2" style={{ color: "#009688" }}>В работе</p>
                {myOrders.map(renderOrder)}
              </div>
            )}
            <p className="text-[11px] font-bold uppercase tracking-wider mb-2" style={{ color: "#888" }}>Свободные заказы ({freeOrders.length})</p>
            {freeOrders.length === 0 && (
              <div className="text-center py-12">
                <span className="text-4xl block mb-3">🚦</span>
                <p className="text-[14px] font-medium" style={{ color: "#888" }}>Новых заказов пока нет</p>
              </div>
            )}
            {freeOrders.map(renderOrder)}
            {doneOrders.length > 0 && (
              <div className="mt-3">
                <p className="text-[11px] font-bold uppercase tracking-wider mb-2" style={{ color: "#ccc" }}>Выполненные</p>
                {doneOrders.map(renderOrder)}
              </div>
            )}
          </div>
        )}

        {activeTab === "profile" && (
          <div className="space-y-3 animate-fade-in">
            <div className="bg-white rounded-2xl p-4" style={{ border: "1px solid #e8e8e8" }}>
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full flex items-center justify-center text-3xl" style={{ background: "#f0f0f0" }}>🚗</div>
                <div>
                  <p className="font-bold text-[16px]" style={{ color: "#1a1a1a" }}>{userName}</p>
                  <p className="text-[13px] mt-0.5" style={{ color: "#888" }}>Водитель</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[
                { val: orders.filter(o => o.status === "done").length, label: "Выполнено" },
                { val: myOrders.length, label: "В работе" },
                { val: freeOrders.length, label: "Доступно" },
              ].map(s => (
                <div key={s.label} className="bg-white rounded-2xl p-3 text-center" style={{ border: "1px solid #e8e8e8" }}>
                  <p className="text-[22px] font-black" style={{ color: "#009688" }}>{s.val}</p>
                  <p className="text-[11px]" style={{ color: "#888" }}>{s.label}</p>
                </div>
              ))}
            </div>

            <button onClick={onLogout}
              className="w-full bg-white rounded-2xl p-4 flex items-center gap-3 active:scale-[0.98] transition-all"
              style={{ border: "1px solid #e8e8e8" }}>
              <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "#fff3f3" }}>
                <Icon name="LogOut" size={16} style={{ color: "#e53e3e" } as React.CSSProperties} />
              </div>
              <span className="font-semibold text-[14px]" style={{ color: "#e53e3e" }}>Выйти из аккаунта</span>
            </button>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white safe-bottom" style={{ borderTop: "1px solid #e8e8e8" }}>
        <div className="flex">
          {([
            { id: "orders" as const, icon: "ClipboardList", label: "Заказы", badge: freeOrders.length },
            { id: "profile" as const, icon: "User", label: "Профиль" },
          ] as const).map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className="flex-1 py-3 flex flex-col items-center gap-1 relative transition-all">
              {"badge" in tab && tab.badge > 0 && (
                <span className="absolute top-2 right-1/3 w-4 h-4 rounded-full text-[10px] font-bold text-white flex items-center justify-center" style={{ background: "#e53e3e" }}>{tab.badge}</span>
              )}
              <Icon name={tab.icon} size={22} style={{ color: activeTab === tab.id ? "#009688" : "#bbb" } as React.CSSProperties} />
              <span className="text-[10px] font-semibold" style={{ color: activeTab === tab.id ? "#009688" : "#bbb" }}>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}