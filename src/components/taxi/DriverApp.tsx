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
  {
    id: 1,
    tariff: "Стандарт",
    tariffIcon: "🚕",
    from: "ул. Ленина, 12",
    to: "Аэропорт",
    payment: "Перевод",
    comment: "Пожалуйста, помогите с вещами",
    price: 650,
    children: 0,
    luggage: true,
    time: "10:25",
    status: "free"
  },
  {
    id: 2,
    tariff: "Доставка",
    tariffIcon: "📦",
    to: "ул. Советская, 7, кв 14",
    description: "Пакет с документами, небольшой",
    payment: "Наличные",
    comment: "Позвоните перед доставкой",
    time: "10:42",
    status: "free"
  },
  {
    id: 3,
    tariff: "Стандарт",
    tariffIcon: "🚕",
    from: "ТЦ Планета",
    to: "пр. Мира, 88",
    via: "Аптека на Садовой",
    payment: "Наличные",
    children: 2,
    luggage: false,
    time: "11:05",
    status: "free"
  },
  {
    id: 4,
    tariff: "Грузовой",
    tariffIcon: "🚚",
    from: "Склад на ул. Промышленной",
    to: "ул. Новая, 34",
    description: "Мебель: диван + 2 кресла, разобрана",
    payment: "Перевод",
    price: 2500,
    time: "11:30",
    status: "free"
  },
];

const STATUS_LABELS: Record<OrderStatus, { label: string; color: string; bg: string }> = {
  free: { label: "Свободен", color: "text-green-700", bg: "bg-green-100" },
  in_progress: { label: "В работе", color: "text-orange-700", bg: "bg-orange-100" },
  done: { label: "Выполнен", color: "text-stone-500", bg: "bg-stone-100" },
};

export default function DriverApp({ userName, onLogout }: Props) {
  const [activeTab, setActiveTab] = useState<"orders" | "profile">("orders");
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const takeOrder = (id: number) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: "in_progress" } : o));
  };

  const completeOrder = (id: number) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: "done" } : o));
  };

  const freeOrders = orders.filter(o => o.status === "free");
  const myOrders = orders.filter(o => o.status === "in_progress");
  const doneOrders = orders.filter(o => o.status === "done");

  const renderOrder = (order: Order) => {
    const st = STATUS_LABELS[order.status];
    const isExpanded = expandedId === order.id;

    return (
      <div key={order.id} className="bg-white rounded-2xl shadow-sm overflow-hidden mb-3">
        <button
          className="w-full text-left p-4"
          onClick={() => setExpandedId(isExpanded ? null : order.id)}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">{order.tariffIcon}</span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-stone-800 text-sm">{order.tariff}</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${st.bg} ${st.color}`}>{st.label}</span>
                </div>
                <p className="text-xs text-stone-400 mt-0.5">
                  {order.from ? `${order.from} → ${order.to}` : `Доставка: ${order.to}`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-xs text-stone-400">{order.time}</span>
              <Icon name={isExpanded ? "ChevronUp" : "ChevronDown"} size={14} className="text-stone-300" />
            </div>
          </div>
        </button>

        {isExpanded && (
          <div className="px-4 pb-4 pt-0 space-y-2 border-t border-stone-50 animate-fade-in">
            <div className="bg-stone-50 rounded-xl p-3 space-y-1.5 mt-3">
              {order.from && (
                <div className="flex gap-2 text-sm">
                  <span className="text-green-500 mt-0.5">●</span>
                  <span className="text-stone-700">{order.from}</span>
                </div>
              )}
              {order.via && (
                <div className="flex gap-2 text-sm">
                  <span className="text-orange-400 mt-0.5">●</span>
                  <span className="text-stone-700">Через: {order.via}</span>
                </div>
              )}
              <div className="flex gap-2 text-sm">
                <span className="text-red-500 mt-0.5">●</span>
                <span className="text-stone-700">{order.to}</span>
              </div>
            </div>

            {order.description && (
              <div className="flex items-start gap-2 text-sm text-stone-600">
                <Icon name="Package" size={14} className="mt-0.5 text-orange-400 flex-shrink-0" />
                <span>{order.description}</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 mt-1">
              <div className="bg-orange-50 rounded-lg p-2">
                <p className="text-xs text-stone-400">Оплата</p>
                <p className="text-sm font-bold text-stone-700">{order.payment}</p>
              </div>
              {order.price && (
                <div className="bg-orange-50 rounded-lg p-2">
                  <p className="text-xs text-stone-400">Стоимость</p>
                  <p className="text-sm font-bold text-stone-700">{order.price} ₽</p>
                </div>
              )}
              {order.children !== undefined && order.children > 0 && (
                <div className="bg-orange-50 rounded-lg p-2">
                  <p className="text-xs text-stone-400">Дети</p>
                  <p className="text-sm font-bold text-stone-700">{order.children} чел.</p>
                </div>
              )}
              {order.luggage && (
                <div className="bg-orange-50 rounded-lg p-2">
                  <p className="text-xs text-stone-400">Багаж</p>
                  <p className="text-sm font-bold text-stone-700">Есть</p>
                </div>
              )}
            </div>

            {order.comment && (
              <div className="bg-amber-50 rounded-xl p-3 flex gap-2">
                <Icon name="MessageCircle" size={14} className="text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-stone-700">{order.comment}</p>
              </div>
            )}

            {order.status === "free" && (
              <button
                onClick={() => takeOrder(order.id)}
                className="w-full taxi-gradient text-white font-bold py-3 rounded-xl mt-2 active:scale-95 transition-transform text-sm"
              >
                Взять в работу
              </button>
            )}
            {order.status === "in_progress" && (
              <button
                onClick={() => completeOrder(order.id)}
                className="w-full bg-green-500 text-white font-bold py-3 rounded-xl mt-2 active:scale-95 transition-transform text-sm"
              >
                ✅ Завершить поездку
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-dvh flex flex-col">
      {/* Top bar */}
      <div className="taxi-gradient px-5 pt-12 pb-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-orange-100 text-xs font-medium">Водитель</p>
            <h2 className="text-white font-black text-lg">{userName}</h2>
          </div>
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <span className="text-xl">🚗</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-24">
        {activeTab === "orders" && (
          <div className="px-4 pt-5 animate-fade-in">
            {/* My active orders */}
            {myOrders.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-bold text-orange-500 uppercase tracking-wide mb-2">Мои заказы</p>
                {myOrders.map(renderOrder)}
              </div>
            )}

            {/* Free orders */}
            <p className="text-xs font-bold text-stone-500 uppercase tracking-wide mb-2">
              Свободные заказы ({freeOrders.length})
            </p>
            {freeOrders.length === 0 && (
              <div className="text-center py-10 text-stone-400">
                <span className="text-4xl mb-3 block">🚦</span>
                <p className="text-sm font-medium">Новых заказов пока нет</p>
              </div>
            )}
            {freeOrders.map(renderOrder)}

            {/* Done orders */}
            {doneOrders.length > 0 && (
              <div className="mt-2">
                <p className="text-xs font-bold text-stone-400 uppercase tracking-wide mb-2">Выполненные</p>
                {doneOrders.map(renderOrder)}
              </div>
            )}
          </div>
        )}

        {activeTab === "profile" && (
          <div className="px-4 pt-5 animate-fade-in">
            <div className="bg-white rounded-2xl p-5 shadow-sm mb-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 taxi-gradient rounded-2xl flex items-center justify-center shadow-md">
                  <span className="text-2xl">🚗</span>
                </div>
                <div>
                  <h3 className="font-black text-stone-800 text-lg">{userName}</h3>
                  <p className="text-stone-400 text-sm">Водитель</p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-stone-100 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center">
                    <Icon name="Phone" size={14} className="text-orange-500" />
                  </div>
                  <div>
                    <p className="text-xs text-stone-400">Телефон</p>
                    <p className="text-sm font-semibold text-stone-700">+7 (999) 111-22-33</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center">
                    <Icon name="Car" size={14} className="text-orange-500" />
                  </div>
                  <div>
                    <p className="text-xs text-stone-400">Автомобиль</p>
                    <p className="text-sm font-semibold text-stone-700">Toyota Camry • А123БВ</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center">
                    <Icon name="Palette" size={14} className="text-orange-500" />
                  </div>
                  <div>
                    <p className="text-xs text-stone-400">Цвет</p>
                    <p className="text-sm font-semibold text-stone-700">Белый</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
              <h4 className="font-black text-stone-800 mb-3 flex items-center gap-2">
                <Icon name="Clock" size={16} className="text-orange-500" />
                История поездок
              </h4>
              {doneOrders.length === 0 ? (
                <p className="text-stone-400 text-sm text-center py-4">Выполненных поездок пока нет</p>
              ) : (
                doneOrders.map(order => (
                  <div key={order.id} className="py-3 border-b border-stone-50 last:border-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs text-stone-400 mb-0.5">{order.tariff} • {order.time}</p>
                        <p className="text-sm text-stone-700">{order.to}</p>
                      </div>
                      <span className="text-xs bg-stone-100 text-stone-500 px-2 py-0.5 rounded-full font-medium">Выполнен</span>
                    </div>
                  </div>
                ))
              )}
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
          onClick={() => setActiveTab("orders")}
          className={`flex-1 flex flex-col items-center py-3 gap-0.5 transition-colors ${activeTab === "orders" ? "text-orange-500" : "text-stone-400"}`}
        >
          <Icon name="ClipboardList" size={22} />
          <span className="text-[10px] font-bold">Заказы</span>
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
