import { useState } from "react";
import Icon from "@/components/ui/icon";

interface Props {
  userName: string;
  onLogout: () => void;
}

type OrderStatus = "free" | "in_progress" | "done";

interface Order {
  id: number;
  tariff: string;
  tariffIcon: string;
  from?: string;
  to: string;
  via?: string;
  description?: string;
  payment: string;
  comment?: string;
  price?: number;
  children?: number;
  luggage?: boolean;
  time: string;
  status: OrderStatus;
}

const INITIAL_ORDERS: Order[] = [
  { id: 1, tariff: "Стандарт", tariffIcon: "🚕", from: "ул. Ленина, 12", to: "Аэропорт", payment: "Перевод", comment: "Пожалуйста, помогите с вещами", price: 650, children: 0, luggage: true, time: "10:25", status: "free" },
  { id: 2, tariff: "Доставка", tariffIcon: "📦", to: "ул. Советская, 7, кв 14", description: "Пакет с документами, небольшой", payment: "Наличные", comment: "Позвоните перед доставкой", time: "10:42", status: "free" },
  { id: 3, tariff: "Стандарт", tariffIcon: "🚕", from: "ТЦ Планета", to: "пр. Мира, 88", via: "Аптека на Садовой", payment: "Наличные", children: 2, luggage: false, time: "11:05", status: "free" },
  { id: 4, tariff: "Грузовой", tariffIcon: "🚚", from: "Склад на ул. Промышленной", to: "ул. Новая, 34", description: "Мебель: диван + 2 кресла, разобрана", payment: "Перевод", price: 2500, time: "11:30", status: "free" },
];

const STATUS_LABELS: Record<OrderStatus, { label: string; color: string; bg: string }> = {
  free: { label: "Свободен", color: "text-emerald-700", bg: "bg-emerald-100" },
  in_progress: { label: "В работе", color: "text-violet-700", bg: "bg-violet-100" },
  done: { label: "Выполнен", color: "text-slate-500", bg: "bg-slate-100" },
};

export default function DriverApp({ userName, onLogout }: Props) {
  const [activeTab, setActiveTab] = useState<"orders" | "profile">("orders");
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const takeOrder = (id: number) => setOrders(prev => prev.map(o => o.id === id ? { ...o, status: "in_progress" as OrderStatus } : o));
  const completeOrder = (id: number) => setOrders(prev => prev.map(o => o.id === id ? { ...o, status: "done" as OrderStatus } : o));

  const freeOrders = orders.filter(o => o.status === "free");
  const myOrders = orders.filter(o => o.status === "in_progress");
  const doneOrders = orders.filter(o => o.status === "done");

  const renderOrder = (order: Order) => {
    const st = STATUS_LABELS[order.status];
    const isExpanded = expandedId === order.id;
    return (
      <div key={order.id} className="bg-white rounded-3xl shadow-sm overflow-hidden mb-3">
        <button className="w-full text-left p-4" onClick={() => setExpandedId(isExpanded ? null : order.id)}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">{order.tariffIcon}</span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-800 text-sm">{order.tariff}</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${st.bg} ${st.color}`}>{st.label}</span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  {order.from ? `${order.from} → ${order.to}` : `Доставка: ${order.to}`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-xs text-slate-400">{order.time}</span>
              <Icon name={isExpanded ? "ChevronUp" : "ChevronDown"} size={14} className="text-slate-300" />
            </div>
          </div>
        </button>

        {isExpanded && (
          <div className="px-4 pb-4 pt-0 space-y-2 border-t border-slate-50 animate-fade-in">
            <div className="bg-slate-50 rounded-2xl p-3 space-y-1.5 mt-3">
              {order.from && <div className="flex gap-2 text-sm"><span className="text-green-400 mt-0.5">●</span><span className="text-slate-700">{order.from}</span></div>}
              {order.via && <div className="flex gap-2 text-sm"><span className="text-violet-400 mt-0.5">●</span><span className="text-slate-700">Через: {order.via}</span></div>}
              <div className="flex gap-2 text-sm"><span className="text-red-400 mt-0.5">●</span><span className="text-slate-700">{order.to}</span></div>
            </div>

            {order.description && (
              <div className="flex items-start gap-2 text-sm text-slate-600">
                <Icon name="Package" size={14} className="mt-0.5 text-violet-400 flex-shrink-0" />
                <span>{order.description}</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 mt-1">
              <div className="rounded-2xl p-2" style={{ background: "linear-gradient(135deg, #f5f3ff, #ede9fe)" }}>
                <p className="text-xs text-slate-400">Оплата</p>
                <p className="text-sm font-bold text-slate-700">{order.payment}</p>
              </div>
              {order.price && (
                <div className="rounded-2xl p-2" style={{ background: "linear-gradient(135deg, #f5f3ff, #ede9fe)" }}>
                  <p className="text-xs text-slate-400">Стоимость</p>
                  <p className="text-sm font-bold text-slate-700">{order.price} ₽</p>
                </div>
              )}
              {order.children !== undefined && order.children > 0 && (
                <div className="rounded-2xl p-2" style={{ background: "linear-gradient(135deg, #f5f3ff, #ede9fe)" }}>
                  <p className="text-xs text-slate-400">Дети</p>
                  <p className="text-sm font-bold text-slate-700">{order.children} чел.</p>
                </div>
              )}
              {order.luggage && (
                <div className="rounded-2xl p-2" style={{ background: "linear-gradient(135deg, #f5f3ff, #ede9fe)" }}>
                  <p className="text-xs text-slate-400">Багаж</p>
                  <p className="text-sm font-bold text-slate-700">Есть</p>
                </div>
              )}
            </div>

            {order.comment && (
              <div className="bg-violet-50 rounded-2xl p-3 flex gap-2">
                <Icon name="MessageCircle" size={14} className="text-violet-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-slate-700">{order.comment}</p>
              </div>
            )}

            {order.status === "free" && (
              <button onClick={() => takeOrder(order.id)} className="w-full taxi-gradient text-white font-bold py-3 rounded-2xl mt-2 active:scale-95 transition-transform text-sm shadow-lg shadow-violet-300/30">
                Взять в работу
              </button>
            )}
            {order.status === "in_progress" && (
              <button onClick={() => completeOrder(order.id)} className="w-full bg-emerald-500 text-white font-bold py-3 rounded-2xl mt-2 active:scale-95 transition-transform text-sm">
                ✅ Завершить поездку
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-dvh flex flex-col bg-slate-50">
      <div className="taxi-gradient px-5 pt-12 pb-6 rounded-b-[2rem]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-violet-200 text-xs font-medium">Водитель</p>
            <h2 className="text-white font-black text-lg">{userName}</h2>
          </div>
          <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center text-xl">🚗</div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-24">
        {activeTab === "orders" && (
          <div className="px-4 pt-5 animate-fade-in">
            {myOrders.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-bold text-violet-500 uppercase tracking-wide mb-2">Мои заказы</p>
                {myOrders.map(renderOrder)}
              </div>
            )}
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Свободные заказы ({freeOrders.length})</p>
            {freeOrders.length === 0 && (
              <div className="text-center py-10 text-slate-300">
                <span className="text-4xl mb-3 block">🚦</span>
                <p className="text-sm font-medium">Новых заказов пока нет</p>
              </div>
            )}
            {freeOrders.map(renderOrder)}
            {doneOrders.length > 0 && (
              <div className="mt-2">
                <p className="text-xs font-bold text-slate-300 uppercase tracking-wide mb-2">Выполненные</p>
                {doneOrders.map(renderOrder)}
              </div>
            )}
          </div>
        )}

        {activeTab === "profile" && (
          <div className="px-4 pt-5 animate-fade-in">
            <div className="bg-white rounded-3xl p-5 shadow-sm mb-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 taxi-gradient rounded-3xl flex items-center justify-center shadow-lg shadow-violet-300/30 text-2xl">🚗</div>
                <div>
                  <h3 className="font-black text-slate-800 text-lg">{userName}</h3>
                  <p className="text-slate-400 text-sm">Водитель</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-50 space-y-3">
                {[
                  { icon: "Phone", label: "Телефон", val: "+7 (999) 111-22-33" },
                  { icon: "Car", label: "Автомобиль", val: "Toyota Camry • А123БВ" },
                  { icon: "Palette", label: "Цвет", val: "Белый" },
                ].map(row => (
                  <div key={row.icon} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #ede9fe, #ddd6fe)" }}>
                      <Icon name={row.icon} size={14} className="text-violet-500" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">{row.label}</p>
                      <p className="text-sm font-semibold text-slate-700">{row.val}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl p-4 shadow-sm mb-4">
              <h4 className="font-black text-slate-800 mb-3 flex items-center gap-2">
                <Icon name="Clock" size={16} className="text-violet-500" />
                История поездок
              </h4>
              {doneOrders.length === 0 ? (
                <p className="text-slate-300 text-sm text-center py-4">Выполненных поездок пока нет</p>
              ) : (
                doneOrders.map(order => (
                  <div key={order.id} className="py-3 border-b border-slate-50 last:border-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs text-slate-400 mb-0.5">{order.tariff} · {order.time}</p>
                        <p className="text-sm text-slate-700">{order.to}</p>
                      </div>
                      <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-medium">Выполнен</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <button onClick={onLogout} className="w-full bg-red-50 text-red-400 font-bold py-4 rounded-3xl border-2 border-red-100 active:scale-95 transition-transform text-sm">
              Выйти из аккаунта
            </button>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white/90 backdrop-blur-lg border-t border-violet-100/60 flex safe-bottom shadow-xl shadow-violet-100/50">
        <button onClick={() => setActiveTab("orders")} className={`flex-1 flex flex-col items-center py-3 gap-0.5 transition-colors ${activeTab === "orders" ? "text-violet-600" : "text-slate-300"}`}>
          <Icon name="ClipboardList" size={22} />
          <span className="text-[10px] font-bold">Заказы</span>
        </button>
        <button onClick={() => setActiveTab("profile")} className={`flex-1 flex flex-col items-center py-3 gap-0.5 transition-colors ${activeTab === "profile" ? "text-violet-600" : "text-slate-300"}`}>
          <Icon name="User" size={22} />
          <span className="text-[10px] font-bold">Профиль</span>
        </button>
      </div>
    </div>
  );
}
