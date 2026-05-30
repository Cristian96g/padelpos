export const dashboardStats = {
  totalDay: 142500,
  cash: 58200,
  transfer: 84300,
  pending: 12400,
  courtIncome: 98000,
  consumptionIncome: 44500,
};

export const nextBookings = [
  {
    id: "bk-1",
    time: "17:30",
    court: "C1",
    customerName: "Carlos Thompson",
    players: 4,
    duration: "90 min",
    status: "paid",
  },
  {
    id: "bk-2",
    time: "18:00",
    court: "C2",
    customerName: "Reserva Web #429",
    players: 0,
    duration: "60 min",
    status: "pending",
  },
  {
    id: "bk-3",
    time: "19:00",
    court: "C1",
    customerName: "Valentina Ruiz",
    players: 1,
    duration: "60 min",
    status: "debt",
  },
];

export const homeAlerts = [
  {
    id: "alert-1",
    title: "Turno 19:00 - Cancha 1",
    subtitle: "Valentina Ruiz",
    detail: "Debe $8.000",
    tone: "debt",
  },
  {
    id: "alert-2",
    title: "Juan - Turno 20:00",
    subtitle: "Cancha 1",
    detail: "Pendiente confirmar pago",
    tone: "pending",
  },
  {
    id: "alert-3",
    title: "Ariel - Agua",
    subtitle: "Turno 20:00",
    detail: "Consumo pendiente $600",
    tone: "debt",
  },
];

export const bookingGroups = [
  {
    slot: "20:00 - 21:30",
    bookings: [
      {
        id: "turno-2000-c1",
        court: "Cancha 1",
        customerName: "Roman Alvarez",
        playersCount: 4,
        status: "partial",
        debt: 8000,
        courtTotal: 24000,
        consumptionTotal: 9600,
      },
      {
        id: "turno-2000-c2",
        court: "Cancha 2",
        customerName: "Marcos Paz",
        playersCount: 4,
        status: "debt",
        debt: 8500,
        courtTotal: 24000,
        consumptionTotal: 0,
      },
    ],
  },
  {
    slot: "21:30 - 23:00",
    bookings: [
      {
        id: "turno-2130-c1",
        court: "Cancha 1",
        customerName: "S. Rodriguez",
        playersCount: 4,
        status: "pending",
        debt: 12000,
        courtTotal: 12000,
        consumptionTotal: 0,
      },
      {
        id: "turno-2130-c2",
        court: "Cancha 2",
        customerName: "Disponible",
        playersCount: 0,
        status: "free",
        debt: 0,
        courtTotal: 0,
        consumptionTotal: 0,
      },
    ],
  },
];

export const turnDetails = {
  "turno-2000-c1": {
    id: "turno-2000-c1",
    title: "20:00 - Cancha 1",
    customerName: "Roman Alvarez",
    schedule: "4 jugadores · 90 min · 20:00 a 21:30",
    status: "partial",
    courtTotal: 24000,
    consumptionTotal: 9600,
    pendingTotal: 8600,
    grandTotal: 33600,
    summary: {
      courtCash: 6000,
      courtTransfer: 12000,
      consumptionCash: 3000,
      consumptionTransfer: 4000,
    },
    movements: [
      { id: "tm-1", title: "Roman pago cancha", meta: "Transferencia · hace 4 min", amount: 6000 },
      { id: "tm-2", title: "Gatorade Roman", meta: "Efectivo · hace 3 min", amount: 3000 },
      { id: "tm-3", title: "Pedro pago cancha", meta: "Efectivo · hace 9 min", amount: 6000 },
      { id: "tm-4", title: "Ariel debe agua", meta: "Pendiente · hace 1 min", amount: 600 },
    ],
    players: [
      {
        id: "p1",
        name: "Roman",
        courtShare: 6000,
        courtMethod: "Transferencia",
        courtStatus: "paid",
        courtDebt: 0,
        consumptions: [
          { id: "c1", name: "Gatorade", price: 3000, quantity: 1, method: "Efectivo", status: "paid" },
        ],
      },
      {
        id: "p2",
        name: "Juan",
        courtShare: 6000,
        courtMethod: "Pendiente",
        courtStatus: "debt",
        courtDebt: 6000,
        consumptions: [],
      },
      {
        id: "p3",
        name: "Pedro",
        courtShare: 6000,
        courtMethod: "Efectivo",
        courtStatus: "paid",
        courtDebt: 0,
        consumptions: [],
      },
      {
        id: "p4",
        name: "Ariel",
        courtShare: 6000,
        courtMethod: "Transferencia",
        courtStatus: "paid",
        courtDebt: 0,
        consumptions: [
          { id: "c2", name: "Agua", price: 600, quantity: 1, method: "Pendiente", status: "debt" },
        ],
      },
    ],
  },
};

export const quickProducts = [
  { id: "prod-1", name: "Agua", price: 800, icon: "Droplets", category: "Bebidas", favorite: true, recent: true, soldToday: 24 },
  { id: "prod-2", name: "Coca", price: 1200, icon: "CupSoda", category: "Bebidas", favorite: true, recent: true, soldToday: 18 },
  { id: "prod-3", name: "Gatorade", price: 1500, icon: "BottleWine", category: "Bebidas", favorite: true, recent: true, soldToday: 15 },
  { id: "prod-4", name: "Turron", price: 400, icon: "Cookie", category: "Snacks", favorite: false, recent: false, soldToday: 7 },
  { id: "prod-5", name: "Pelotas", price: 8500, icon: "CircleDot", category: "Cancha", favorite: true, recent: false, soldToday: 4 },
  { id: "prod-6", name: "Grip", price: 2200, icon: "Package2", category: "Cancha", favorite: false, recent: true, soldToday: 5 },
  { id: "prod-7", name: "Barra", price: 1300, icon: "Candy", category: "Snacks", favorite: false, recent: false, soldToday: 6 },
  { id: "prod-8", name: "Otro", price: null, icon: "PlusCircle", category: "Manual", favorite: false, recent: false, soldToday: 1 },
];

export const cashSummary = {
  total: 142500,
  pending: 12400,
  court: {
    total: 98000,
    cash: 45000,
    transfer: 53000,
    pending: 8000,
  },
  consumptions: {
    total: 44500,
    cash: 18200,
    transfer: 26300,
    pending: 4400,
  },
};

export const cashSession = {
  opening: 20000,
  systemTotal: 142500,
  physicalTotal: 140000,
  difference: -2500,
  status: "warning",
};

export const cashAlerts = [
  {
    id: "cash-alert-1",
    title: "Hay 3 pendientes hace mas de 2 horas",
    detail: "Conviene cobrarlos antes del cierre para bajar deuda viva.",
    tone: "warning",
  },
  {
    id: "cash-alert-2",
    title: "Diferencia negativa en caja",
    detail: "El sistema marca $2.500 mas que la caja fisica.",
    tone: "danger",
  },
  {
    id: "cash-alert-3",
    title: "Mucho efectivo acumulado",
    detail: "El efectivo ya representa el 41% de los ingresos del dia.",
    tone: "info",
  },
];

export const cashPendingItems = [
  {
    id: "pending-1",
    name: "Juan",
    amount: 6000,
    context: "Cancha 1 · 20:00",
    type: "Cancha",
  },
  {
    id: "pending-2",
    name: "Roman",
    amount: 3000,
    context: "Consumos · Gatorade",
    type: "Consumos",
  },
  {
    id: "pending-3",
    name: "Ariel",
    amount: 3400,
    context: "Cancha 1 · Agua + cancha",
    type: "Mixto",
  },
];

export const cashInsights = [
  { id: "insight-1", label: "Metodo mas usado", value: "Transferencia", meta: "59% del dia" },
  { id: "insight-2", label: "Producto mas vendido", value: "Agua", meta: "24 unidades" },
  { id: "insight-3", label: "Horario mas rentable", value: "20:00", meta: "$48.000 facturados" },
  { id: "insight-4", label: "Cancha mas rentable", value: "Cancha 1", meta: "$62.000 acumulados" },
];

export const cashBreakdownDetails = {
  court: [
    { id: "court-detail-1", label: "20:00 · Cancha 1", amount: 24000, method: "Transferencia" },
    { id: "court-detail-2", label: "21:30 · Cancha 2", amount: 18000, method: "Efectivo" },
    { id: "court-detail-3", label: "23:00 · Cancha 1", amount: 12000, method: "Transferencia" },
  ],
  consumptions: [
    { id: "cons-detail-1", label: "Gatorade + Agua", amount: 3000, method: "Efectivo" },
    { id: "cons-detail-2", label: "Cervezas + papas", amount: 4200, method: "Efectivo" },
    { id: "cons-detail-3", label: "Pelotas + grip", amount: 8500, method: "Transferencia" },
  ],
};

export const cashMovements = [
  {
    id: "m1",
    time: "20:00",
    title: "Turno 20:00 cobrado",
    origin: "Cancha 1",
    method: "Transferencia",
    amount: 24000,
    tone: "positive",
    category: "Canchas",
    detail: "Roman, Pedro y Ariel dejaron la cancha paga.",
  },
  {
    id: "m2",
    time: "20:12",
    title: "Consumos mostrador",
    origin: "Coca + Agua + Turron",
    method: "Efectivo",
    amount: 3000,
    tone: "positive",
    category: "Consumos",
    detail: "Venta general sin asociar a turno.",
  },
  {
    id: "m3",
    time: "20:40",
    title: "Pendiente cobrado",
    origin: "Juan · Turno 20:00",
    method: "Transferencia",
    amount: 6000,
    tone: "positive",
    category: "Pendientes",
    detail: "Se regularizo deuda de cancha.",
  },
  {
    id: "m4",
    time: "21:05",
    title: "Reposicion de pelotas",
    origin: "Compra operativa",
    method: "Efectivo",
    amount: -15000,
    tone: "negative",
    category: "Canchas",
    detail: "Salida de caja para insumos.",
  },
  {
    id: "m5",
    time: "21:14",
    title: "Gatorade Ariel",
    origin: "Consumos · Turno 20:00",
    method: "Pendiente",
    amount: 600,
    tone: "pending",
    category: "Pendientes",
    detail: "Consumo cargado y pendiente de cobro.",
  },
];

export const moreActions = [
  { id: "clients", title: "Clientes", description: "Jugadores frecuentes y telefonos" },
  { id: "products", title: "Productos", description: "Precios rapidos para POS" },
  { id: "prices", title: "Precios de cancha", description: "Tarifas por horario y tipo" },
  { id: "close", title: "Cierre de caja", description: "Resumen y cierre del dia" },
  { id: "logout", title: "Salir", description: "Cerrar sesion del panel" },
];
