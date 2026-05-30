# PadelPro POS - V1 Funcional

## Objetivo real de la V1

La V1 no busca administrar todo el club. Busca resolver el trabajo de mostrador con el menor número de toques posible.

Prioridades:

- cobrar rápido
- ver deuda sin pensar
- separar cancha de consumos
- cerrar caja sin Excel
- usar todo desde celular

## Principio de producto

La app se comporta como una mezcla entre agenda operativa y mini POS.

La persona que atiende debe poder:

1. ver el estado de las canchas de un vistazo
2. entrar a un turno
3. cobrar cancha por jugador
4. cargar consumos sin mezclar ingresos
5. salir con la caja diaria clara

## Alcance V1

Incluye:

- login de administrador o empleado autorizado
- dashboard diario
- listado de turnos por franja horaria
- detalle fullscreen del turno
- pagos divididos por jugador
- consumos por jugador o venta general
- caja diaria separada por origen de ingreso
- pendientes y deudas
- historial básico de movimientos del día

No incluye en V1:

- reservas online para clientes
- integración bancaria
- facturación fiscal
- multi sucursal
- stock avanzado
- reportes históricos complejos
- permisos finos por rol

## Regla contable central

Hay dos bolsas separadas:

### 1. Ingresos por cancha

- alquiler del turno
- pago total o dividido
- efectivo
- transferencia
- pendiente

### 2. Ingresos por consumos

- bebidas
- snacks
- pelotas
- extras
- efectivo
- transferencia
- pendiente

Regla absoluta:

- un pago de cancha nunca suma al total de consumos
- un consumo nunca suma al total de cancha
- la caja siempre muestra ambos subtotales por separado antes del total general

## Navegación mobile-first

Bottom nav:

- Inicio
- Turnos
- Consumos
- Caja
- Más

## Estructura funcional por pantalla

## 1. Inicio

Pantalla para arrancar el día en menos de 5 segundos.

Bloques:

- total del día
- efectivo del día
- transferencia del día
- pendientes del día
- ingresos por cancha
- ingresos por consumos
- próximos 5 turnos
- alertas de deuda
- accesos rápidos

Acciones rápidas:

- nuevo turno
- cobrar deuda
- venta general
- ver caja

## 2. Turnos

Es la pantalla principal de operación.

Formato:

- lista por franja horaria
- cards grandes por cancha
- estado muy visible
- CTA de cobro inmediato si hay deuda o pago parcial

Cada card muestra:

- hora
- cancha
- cliente principal
- cantidad de jugadores
- estado
- deuda visible
- total cancha
- total consumos

Estados V1:

- Libre
- Parcialmente pagado
- Pagado
- Deuda

Color sugerido:

- Libre: gris suave
- Parcialmente pagado: ámbar
- Pagado: verde
- Deuda: rojo

Copy visible:

- `DEBE $8.000`
- `CANCHA PAGA`
- `2 JUGADORES PENDIENTES`

## 3. Detalle fullscreen del turno

Es el corazón operativo.

Header:

- hora
- cancha
- cliente principal
- estado global del turno

Bloque superior:

- total cancha
- total consumos
- pendiente total

Lista de jugadores:

Cada jugador tiene 2 secciones separadas.

### A. Pago de cancha

- monto asignado
- método de pago
- estado
- acción rápida para cobrar

Estados:

- efectivo
- transferencia
- pendiente

### B. Consumos

- chips o rows por producto
- cantidad
- precio
- método de pago
- estado

Acciones rápidas dentro del turno:

- cobrar cancha en efectivo
- cobrar cancha por transferencia
- marcar pendiente
- agregar consumo
- editar consumo
- cobrar todo del jugador

Resumen inferior fijo:

- ingresos cancha efectivo
- ingresos cancha transferencia
- ingresos consumos efectivo
- ingresos consumos transferencia
- pendiente total
- total general

La caja del turno debe sentirse como una mini caja independiente.

## 4. Consumos

Modo POS de alta velocidad.

Primer nivel:

- Agua
- Coca
- Gatorade
- Turrón
- Pelotas
- Otro

Flujo ideal:

1. tocar producto
2. elegir cantidad
3. elegir destino
4. elegir pago
5. guardar

Destino:

- asociar a turno
- asociar a jugador
- visitante
- venta general

Método:

- efectivo
- transferencia
- pendiente

## 5. Caja diaria

Debe responder rápido tres preguntas:

1. cuánto entró hoy
2. cuánto falta cobrar
3. cuánto es cancha y cuánto es consumos

Bloques:

- total general
- pendientes
- ingresos por cancha
- ingresos por consumos
- gráfico simple comparativo
- timeline de movimientos
- últimos pagos
- últimas deudas

## 6. Más

V1 simple:

- clientes
- precios
- productos
- cierre de caja
- salir

## Modelo de datos V1

## Colecciones MongoDB

### users

- name
- email
- passwordHash
- role: `admin | staff`
- active
- lastLoginAt

### courts

- name
- type
- active
- order

### players

- name
- phone
- notes

### products

- name
- category
- price
- active
- quickButton
- sortOrder

### bookings

- courtId
- date
- startTime
- endTime
- status: `free | active | partial | paid | debt | cancelled`
- customerName
- playerIds
- courtTotal
- notes

### booking_players

Se puede modelar embebido dentro de `bookings` para simplificar V1.

Campos:

- playerName
- courtShareAmount
- courtPaymentStatus: `paid | pending | partial`
- courtPaymentMethod: `cash | transfer | pending | mixed`
- courtPaidAmount

### sales

Representa consumos.

- type: `booking_consumption | walk_in_sale`
- bookingId nullable
- playerName nullable
- items[]
- subtotal
- paymentStatus: `paid | pending | partial`
- paymentMethod: `cash | transfer | pending | mixed`
- paidAmount
- createdBy

### payments

Ledger simple de caja. Cada pago genera un movimiento.

- sourceType: `court | consumption`
- sourceId
- bookingId nullable
- playerName nullable
- amount
- method: `cash | transfer`
- status: `paid | pending`
- createdBy
- createdAt

### cash_closures

- date
- totals
- notes
- closedBy
- closedAt

## Decisión técnica importante

Para V1 conviene:

- guardar `players` del turno embebidos en `bookings`
- guardar los `payments` como movimientos independientes
- calcular dashboard y caja desde `payments`

Esto reduce complejidad y hace más simple auditar.

## Reglas operativas

## Regla 1

Un turno puede existir aunque todavía nadie haya pagado.

## Regla 2

Cada jugador puede deber distinto monto de cancha.

## Regla 3

Un jugador puede pagar cancha y dejar consumos pendientes, o al revés.

## Regla 4

Los consumos pueden estar:

- asociados a un turno
- asociados a un jugador
- sin asociación, como venta general

## Regla 5

La deuda visible de un turno es:

- pendiente de cancha
- más pendiente de consumos del turno

Pero en caja ambos pendientes siguen viéndose separados.

## Rutas frontend V1

- `/login`
- `/`
- `/turnos`
- `/turnos/:bookingId`
- `/consumos`
- `/caja`
- `/mas`
- `/mas/productos`
- `/mas/precios`

## Estructura frontend recomendada

```txt
src/
  app/
    router.jsx
    providers.jsx
  components/
    layout/
    navigation/
    cards/
    sheets/
    charts/
    ui/
  features/
    auth/
    dashboard/
    bookings/
    consumptions/
    cash/
    settings/
  services/
    api.js
    auth.js
  hooks/
  lib/
    currency.js
    dates.js
    status.js
  pages/
```

## Componentes clave

- `BottomNav`
- `MetricCard`
- `BookingCard`
- `DebtBadge`
- `QuickPayButton`
- `PlayerPaymentCard`
- `ConsumptionItemRow`
- `TurnSummaryBar`
- `QuickProductGrid`
- `CashSplitCard`
- `MovementTimeline`

## Backend Express recomendado

```txt
server/
  src/
    config/
    controllers/
    middlewares/
    models/
    routes/
    services/
    utils/
    app.js
    server.js
```

## API REST V1

### Auth

- `POST /api/auth/login`
- `GET /api/auth/me`

### Courts

- `GET /api/courts`

### Bookings

- `GET /api/bookings?date=YYYY-MM-DD`
- `POST /api/bookings`
- `GET /api/bookings/:id`
- `PATCH /api/bookings/:id`
- `POST /api/bookings/:id/players`
- `POST /api/bookings/:id/payments`

### Consumptions

- `GET /api/sales?date=YYYY-MM-DD`
- `POST /api/sales`
- `PATCH /api/sales/:id`

### Products

- `GET /api/products`
- `POST /api/products`
- `PATCH /api/products/:id`

### Cash

- `GET /api/cash/summary?date=YYYY-MM-DD`
- `GET /api/cash/movements?date=YYYY-MM-DD`
- `POST /api/cash/close`

## Flujos críticos

## Flujo A - Cargar turno en menos de 15 segundos

1. tocar `+ nuevo turno`
2. elegir hora
3. elegir cancha
4. cargar nombre principal
5. elegir cantidad de jugadores
6. guardar

Opcional en V1:

- autocompletar jugadores frecuentes

## Flujo B - Cobro parcial de cancha

1. abrir turno
2. tocar jugador
3. tocar `Efectivo` o `Transferencia`
4. confirmar

Si paga menos:

1. editar monto
2. confirmar pago parcial

## Flujo C - Agregar consumo dentro del turno

1. abrir turno
2. tocar `Agregar consumo`
3. tocar producto
4. tocar cantidad
5. elegir jugador
6. elegir método
7. guardar

## Flujo D - Venta general rápida

1. entrar a `Consumos`
2. tocar producto
3. tocar cantidad
4. tocar método
5. guardar

## Visual y UX

Dirección visual:

- dark mode premium
- verde como color de decisión
- rojo reservado para deuda real
- tarjetas con separación generosa
- tipografía grande para importes
- chips claros para estados

Patrones recomendados:

- bottom sheet para acciones rápidas
- modal fullscreen para turno
- botones de 48px o más
- números alineados y destacados
- resumen fijo abajo cuando hay algo por cobrar

Evitar:

- tablas
- modales chicos
- formularios largos
- demasiados campos opcionales
- mezclar cancha y consumos en un mismo subtotal

## Qué hace realista esta V1

- usa CRUD simple
- no requiere motor complejo de reservas
- no depende de integraciones externas
- se puede implementar en MERN modularmente
- soporta operación diaria desde el primer despliegue

## Recomendación de implementación

Orden sugerido:

1. auth
2. productos y canchas
3. turnos
4. pagos de cancha
5. consumos
6. caja diaria
7. cierre de caja

## Resultado esperado de V1

Si esta V1 está bien hecha, el dueño debería poder:

- reemplazar Excel para la operación diaria
- ver al instante qué se cobró y qué no
- distinguir caja de cancha vs caja de consumos
- detectar deuda antes de que el cliente se vaya
- cerrar el día con menos errores manuales
