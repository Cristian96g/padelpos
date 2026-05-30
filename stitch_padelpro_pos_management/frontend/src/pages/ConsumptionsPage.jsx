import { useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronUp,
  Search,
  ShoppingCart,
  Sparkles,
  UserRound,
  Wallet,
  X,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { DesktopEmptyState } from "../components/desktop/DesktopEmptyState";
import { DesktopPanelCard } from "../components/desktop/DesktopPanelCard";
import { DesktopSearchField } from "../components/desktop/DesktopSearchField";
import { BottomSheet } from "../components/sheets/BottomSheet";
import { quickProducts } from "../mocks/data";
import { formatCurrency } from "../lib/format";
import { useTurnStore } from "../store/TurnStoreProvider";

const categories = ["Mas vendidos", "Bebidas", "Snacks", "Cancha", "Manual"];
const chargeMethods = ["Efectivo", "Transferencia"];
const saleTargets = ["Visitante", "Turno 20:00", "Roman"];

function ChargeSheet({ total, selectedMethod, onSelectMethod, onConfirm, onClose }) {
  return (
    <BottomSheet onClose={onClose} fitContent maxHeight="62dvh">
      <div className="flex items-start justify-between gap-3 px-4 pb-3 pt-1">
        <div>
          <h3 className="text-2xl font-extrabold text-content">{formatCurrency(total)}</h3>
          <p className="mt-1 text-sm text-muted">Cobrar carrito</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="button-secondary flex h-9 w-9 items-center justify-center border-0"
        >
          <X size={16} />
        </button>
      </div>

      <div className="space-y-3 px-4">
        {chargeMethods.map((method) => (
          <button
            key={method}
            type="button"
            onClick={() => onSelectMethod(method)}
            className={`flex w-full items-center justify-between px-4 py-3 text-left ${
              selectedMethod === method
                ? "surface-card border-primary/25 bg-primary/10"
                : "surface-card pressable-card"
            }`}
          >
            <div>
              <p className="text-base font-extrabold text-content">{method}</p>
              <p className="mt-0.5 text-sm text-muted">
                {selectedMethod === method ? "Metodo seleccionado" : "Cobrar este carrito ahora"}
              </p>
            </div>
            <p className="text-sm font-extrabold text-content">{formatCurrency(total)}</p>
          </button>
        ))}

        {selectedMethod && (
          <button
            type="button"
            onClick={onConfirm}
            className="button-primary w-full rounded-3xl px-4 py-3 text-sm font-extrabold"
          >
            Confirmar cobro
          </button>
        )}
      </div>
    </BottomSheet>
  );
}

function PhoneField({ customerPhone, onPhoneChange }) {
  const [showPhone, setShowPhone] = useState(Boolean(customerPhone));

  useEffect(() => {
    if (!customerPhone) {
      setShowPhone(false);
    }
  }, [customerPhone]);

  if (!showPhone) {
    return (
      <button
        type="button"
        onClick={() => setShowPhone(true)}
        className="text-sm font-bold text-muted underline underline-offset-4"
      >
        + Agregar telefono
      </button>
    );
  }

  return (
    <label className="block">
      <span className="metric-label">Telefono (opcional)</span>
      <input
        value={customerPhone}
        onChange={(event) => onPhoneChange(event.target.value)}
        placeholder="Ej. 11 5555 5555"
        className="mt-1.5 w-full rounded-[20px] border border-line bg-white/5 px-4 py-3 text-sm font-bold text-content outline-none placeholder:text-muted"
      />
    </label>
  );
}

function PendingSheet({
  total,
  saleTarget,
  customerName,
  customerPhone,
  onNameChange,
  onPhoneChange,
  onClose,
  onSave,
}) {
  return (
    <BottomSheet onClose={onClose} fitContent maxHeight="70dvh">
      <div className="flex items-start justify-between gap-3 px-4 pb-1 pt-1">
        <div>
          <p className="text-sm font-bold text-content">Registrar pendiente</p>
          <h3 className="mt-1 text-[26px] font-extrabold leading-none text-primaryStrong">
            {formatCurrency(total)}
          </h3>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="button-secondary flex h-9 w-9 items-center justify-center border-0"
        >
          <X size={16} />
        </button>
      </div>

      <div className="px-4">
        <div className="space-y-2">
          <div className="rounded-[22px] bg-white/5 px-3.5 py-2.5">
            <p className="metric-label">Asociado a</p>
            <p className="mt-1 text-sm font-extrabold text-content">{saleTarget}</p>
          </div>

          <label className="block">
            <span className="metric-label">Nombre cliente</span>
            <input
              value={customerName}
              onChange={(event) => onNameChange(event.target.value)}
              placeholder="Ej. Roman"
              className="mt-1.5 w-full rounded-[20px] border border-line bg-white/5 px-4 py-3 text-sm font-bold text-content outline-none placeholder:text-muted"
            />
          </label>

          <PhoneField customerPhone={customerPhone} onPhoneChange={onPhoneChange} />
        </div>

        <div className="pb-[calc(8px+env(safe-area-inset-bottom))] pt-3">
          <button
            type="button"
            onClick={onSave}
            disabled={!customerName.trim()}
            className="button-primary w-full rounded-3xl px-4 py-3 text-sm font-extrabold disabled:opacity-50"
          >
            Registrar pendiente
          </button>
        </div>
      </div>
    </BottomSheet>
  );
}

function EditCartSheet({ cartItems, total, onClose, onChangeQuantity, onPending, onCharge }) {
  return (
    <BottomSheet onClose={onClose} height="58dvh" maxHeight="68dvh">
      <div className="flex items-start justify-between gap-3 px-4 pb-3 pt-1">
        <div>
          <h3 className="text-2xl font-extrabold text-content">{`${cartItems.length} productos`}</h3>
          <p className="mt-1 text-sm text-muted">{formatCurrency(total)}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="button-secondary flex h-9 w-9 items-center justify-center border-0"
        >
          <X size={16} />
        </button>
      </div>

      <div className="space-y-2.5 px-4">
        {cartItems.map((item) => (
          <div key={item.id} className="surface-soft flex items-center justify-between gap-3 px-3 py-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-extrabold text-content">{item.name}</p>
              <p className="mt-0.5 text-xs text-muted">{formatCurrency(item.price ?? 0)}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onChangeQuantity(item.id, item.quantity - 1)}
                className="button-secondary flex h-9 w-9 items-center justify-center border-0 text-base font-extrabold"
                aria-label={`Quitar ${item.name}`}
              >
                -
              </button>
              <div className="min-w-[28px] text-center text-sm font-extrabold text-content">{item.quantity}</div>
              <button
                type="button"
                onClick={() => onChangeQuantity(item.id, item.quantity + 1)}
                className="button-primary flex h-9 w-9 items-center justify-center text-base font-extrabold"
                aria-label={`Sumar ${item.name}`}
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 px-4">
        <button
          type="button"
          onClick={onPending}
          className="w-full rounded-3xl border border-warning/30 bg-warning/12 px-4 py-3 text-sm font-bold text-warning"
        >
          Registrar pendiente
        </button>
      </div>

      <div className="mt-2 px-4">
        <button
          type="button"
          onClick={onCharge}
          className="button-primary w-full rounded-3xl px-4 py-3 text-sm font-extrabold"
        >
          Cobrar {formatCurrency(total)}
        </button>
      </div>
    </BottomSheet>
  );
}

function ProductCard({ product, quantity, onChangeQuantity }) {
  return (
    <div className="surface-card px-3.5 py-3">
      <div>
        <p className="text-sm font-extrabold text-content">{product.name}</p>
        <p className="mt-1 text-xs text-muted">{product.price ? formatCurrency(product.price) : "Manual"}</p>
      </div>

      <div className="mt-4">
        {quantity === 0 ? (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => onChangeQuantity(product.id, 1)}
              className="button-primary flex h-11 w-11 items-center justify-center rounded-full text-xl font-extrabold"
              aria-label={`Agregar ${product.name}`}
            >
              +
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onChangeQuantity(product.id, quantity - 1)}
              className="button-secondary flex h-11 w-11 items-center justify-center border-0 text-lg font-extrabold"
            >
              -
            </button>
            <div className="flex-1 rounded-2xl bg-white/5 px-3 py-3 text-center text-base font-extrabold text-content">
              {quantity}
            </div>
            <button
              type="button"
              onClick={() => onChangeQuantity(product.id, quantity + 1)}
              className="button-primary flex h-11 w-11 items-center justify-center text-lg font-extrabold"
            >
              +
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function DesktopCartPanel({
  saleTarget,
  cartItems,
  cartCount,
  cartTotal,
  selectedChargeMethod,
  onSelectChargeMethod,
  onConfirmCharge,
  customerName,
  customerPhone,
  onNameChange,
  onPhoneChange,
  onSavePending,
  mode,
  onModeChange,
  onChangeQuantity,
}) {
  return (
    <DesktopPanelCard
      title="Carrito"
      subtitle={saleTarget}
      className="flex h-full flex-col"
      action={
        <div className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-primary/12 text-primaryStrong">
          <ShoppingCart size={18} />
        </div>
      }
    >
      <h2 className="text-2xl font-extrabold text-content">
        {cartCount > 0 ? formatCurrency(cartTotal) : "Sin productos"}
      </h2>

      {cartItems.length === 0 ? (
        <DesktopEmptyState
          className="mt-5 flex-1"
          title="Todavia no hay productos"
          description="Toca un producto en el panel central y el carrito va a vivir siempre aca."
        />
      ) : (
        <>
          <div className="mt-5 space-y-2 overflow-y-auto pr-1">
            {cartItems.map((item) => (
              <div key={item.id} className="rounded-[22px] border border-line bg-white/5 px-3.5 py-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-extrabold text-content">{item.name}</p>
                    <p className="mt-1 text-xs text-muted">{formatCurrency(item.price ?? 0)}</p>
                  </div>
                  <p className="text-sm font-extrabold text-content">
                    {formatCurrency((item.price ?? 0) * item.quantity)}
                  </p>
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onChangeQuantity(item.id, item.quantity - 1)}
                    className="button-secondary flex h-10 w-10 items-center justify-center border-0 text-base font-extrabold"
                  >
                    -
                  </button>
                  <div className="flex-1 rounded-2xl bg-app px-3 py-2.5 text-center text-sm font-extrabold text-content">
                    {item.quantity}
                  </div>
                  <button
                    type="button"
                    onClick={() => onChangeQuantity(item.id, item.quantity + 1)}
                    className="button-primary flex h-10 w-10 items-center justify-center text-base font-extrabold"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-[24px] border border-line bg-white/5 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="metric-label">Resumen</p>
                <p className="mt-1 text-lg font-extrabold text-content">{cartCount} productos</p>
              </div>
              <p className="text-lg font-extrabold text-content">{formatCurrency(cartTotal)}</p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onModeChange("pending")}
              className={`rounded-3xl px-4 py-3 text-sm font-bold ${
                mode === "pending"
                  ? "border border-warning/35 bg-warning/12 text-warning"
                  : "button-secondary"
              }`}
            >
              Registrar pendiente
            </button>
            <button
              type="button"
              onClick={() => onModeChange("charge")}
              className={`rounded-3xl px-4 py-3 text-sm font-extrabold ${
                mode === "charge" ? "button-primary" : "button-secondary"
              }`}
            >
              Cobrar
            </button>
          </div>

          {mode === "charge" && (
            <div className="mt-4 rounded-[24px] border border-line bg-app px-4 py-4">
              <p className="section-title">Como paga</p>
              <div className="mt-3 space-y-2">
                {chargeMethods.map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => onSelectChargeMethod(method)}
                    className={`flex w-full items-center justify-between rounded-[22px] px-4 py-3 text-left ${
                      selectedChargeMethod === method
                        ? "border border-primary/25 bg-primary/10"
                        : "border border-line bg-white/5"
                    }`}
                  >
                    <div>
                      <p className="text-sm font-extrabold text-content">{method}</p>
                      <p className="mt-0.5 text-xs text-muted">
                        {selectedChargeMethod === method ? "Metodo seleccionado" : "Cobrar este carrito ahora"}
                      </p>
                    </div>
                    <Wallet size={16} className="text-primaryStrong" />
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={onConfirmCharge}
                disabled={!selectedChargeMethod}
                className="button-primary mt-4 w-full px-4 py-3 text-sm font-extrabold disabled:opacity-50"
              >
                Confirmar cobro {formatCurrency(cartTotal)}
              </button>
            </div>
          )}

          {mode === "pending" && (
            <div className="mt-4 rounded-[24px] border border-line bg-app px-4 py-4">
              <p className="section-title">Registrar deuda</p>
              <div className="mt-3 space-y-3">
                <div className="rounded-[20px] bg-white/5 px-3.5 py-3">
                  <p className="metric-label">Asociado a</p>
                  <p className="mt-1 text-sm font-extrabold text-content">{saleTarget}</p>
                </div>

                <label className="block">
                  <span className="metric-label">Nombre cliente</span>
                  <input
                    value={customerName}
                    onChange={(event) => onNameChange(event.target.value)}
                    placeholder="Ej. Roman"
                    className="mt-1.5 w-full rounded-[20px] border border-line bg-white/5 px-4 py-3 text-sm font-bold text-content outline-none placeholder:text-muted"
                  />
                </label>

                <PhoneField customerPhone={customerPhone} onPhoneChange={onPhoneChange} />

                <button
                  type="button"
                  onClick={onSavePending}
                  disabled={!customerName.trim()}
                  className="button-primary w-full px-4 py-3 text-sm font-extrabold disabled:opacity-50"
                >
                  Guardar pendiente
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </DesktopPanelCard>
  );
}

export function ConsumptionsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { addConsumptions, pushFlash } = useTurnStore();
  const consumptionContext = location.state?.association ?? null;
  const returnTo = location.state?.returnTo ?? null;
  const bookingId = location.state?.bookingId ?? null;
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [search, setSearch] = useState("");
  const [saleTarget, setSaleTarget] = useState(saleTargets[0]);
  const [cart, setCart] = useState({});
  const [showEditCartSheet, setShowEditCartSheet] = useState(false);
  const [showChargeSheet, setShowChargeSheet] = useState(false);
  const [showPendingSheet, setShowPendingSheet] = useState(false);
  const [selectedChargeMethod, setSelectedChargeMethod] = useState(null);
  const [pendingCustomerName, setPendingCustomerName] = useState("");
  const [pendingCustomerPhone, setPendingCustomerPhone] = useState("");
  const [desktopCartMode, setDesktopCartMode] = useState("summary");
  const searchRef = useRef(null);

  useEffect(() => {
    searchRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!consumptionContext) {
      return;
    }

    setSaleTarget(consumptionContext.saleTarget ?? consumptionContext.label ?? saleTargets[0]);

    if (consumptionContext.type === "player" && consumptionContext.playerName) {
      setPendingCustomerName(consumptionContext.playerName);
    }
  }, [consumptionContext]);

  const mostSoldToday = useMemo(
    () => [...quickProducts].sort((a, b) => b.soldToday - a.soldToday).slice(0, 4),
    [],
  );

  const visibleProducts = useMemo(() => {
    const baseProducts =
      selectedCategory === "Mas vendidos"
        ? mostSoldToday
        : quickProducts.filter((product) => product.category === selectedCategory);

    if (!search.trim()) {
      return baseProducts;
    }

    const normalizedSearch = search.toLowerCase();
    return baseProducts.filter((product) => product.name.toLowerCase().includes(normalizedSearch));
  }, [mostSoldToday, search, selectedCategory]);

  const cartItems = useMemo(
    () =>
      quickProducts
        .filter((product) => (cart[product.id] ?? 0) > 0)
        .map((product) => ({
          ...product,
          quantity: cart[product.id],
        })),
    [cart],
  );

  const cartCount = useMemo(() => cartItems.reduce((acc, item) => acc + item.quantity, 0), [cartItems]);
  const cartTotal = useMemo(
    () =>
      cartItems.reduce((acc, item) => {
        const price = item.price ?? 0;
        return acc + price * item.quantity;
      }, 0),
    [cartItems],
  );

  function setProductQuantity(productId, nextQuantity) {
    setCart((current) => {
      const nextCart = { ...current };

      if (nextQuantity <= 0) {
        delete nextCart[productId];
      } else {
        nextCart[productId] = nextQuantity;
      }

      return nextCart;
    });
  }

  function resetPendingForm() {
    setPendingCustomerName(consumptionContext?.type === "player" ? consumptionContext.playerName ?? "" : "");
    setPendingCustomerPhone("");
    setDesktopCartMode("summary");
  }

  function persistConsumptionResult({ method, customerName }) {
    if (!bookingId || !consumptionContext) {
      return false;
    }

    addConsumptions({
      bookingId,
      association: consumptionContext,
      cartItems,
      paymentMethod: method,
      customerName,
    });

    return true;
  }

  function finishTurnFlow(flash) {
    setCart({});
    resetPendingForm();
    setSelectedChargeMethod(null);
    pushFlash(flash);
    navigate(returnTo);
  }

  function clearAfterStandalone(flash) {
    pushFlash(flash);
    setCart({});
    setSelectedChargeMethod(null);
    resetPendingForm();
  }

  function handleSavePending() {
    const customerName = pendingCustomerName.trim();

    if (!customerName) {
      return;
    }

    const didPersistInTurn = persistConsumptionResult({
      method: "Pendiente",
      customerName,
    });

    if (didPersistInTurn && returnTo) {
      finishTurnFlow({
        tone: "warning",
        message: `Pendiente guardado para ${customerName}`,
      });
      setShowPendingSheet(false);
      return;
    }

    clearAfterStandalone({
      tone: "warning",
      message: `Pendiente guardado para ${customerName}`,
    });
    setShowPendingSheet(false);
  }

  function handleConfirmCharge() {
    if (!selectedChargeMethod) {
      return;
    }

    const didPersistInTurn = persistConsumptionResult({
      method: selectedChargeMethod,
      customerName: consumptionContext?.playerName ?? saleTarget,
    });

    if (didPersistInTurn && returnTo) {
      finishTurnFlow({
        tone: "success",
        message: `Consumo registrado para ${consumptionContext?.playerName ?? saleTarget}`,
      });
      setShowChargeSheet(false);
      return;
    }

    clearAfterStandalone({
      tone: "success",
      message: `Cobro registrado para ${saleTarget}`,
    });
    setShowChargeSheet(false);
  }

  return (
    <div className="pb-24 lg:pb-0">
      <div className="space-y-3 lg:hidden">
        {consumptionContext && (
          <section className="surface-card border-primary/20 bg-primary/10 px-4 py-3">
            <p className="text-sm font-extrabold text-primaryStrong">
              {consumptionContext.type === "player"
                ? `Consumo asociado a ${consumptionContext.playerName}`
                : consumptionContext.type === "visitor"
                  ? "Consumo asociado a visitante"
                  : "Consumo asociado a caja general"}
            </p>
          </section>
        )}

        <section className="surface-card px-4 py-3.5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/5 text-primaryStrong">
              <Search size={18} />
            </div>
            <input
              ref={searchRef}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar producto..."
              className="w-full bg-transparent text-base font-bold text-content outline-none placeholder:text-muted"
            />
          </div>
        </section>

        <section className="flex gap-2 overflow-x-auto pb-1">
          <span className="pill-chip whitespace-nowrap text-content">Venta para:</span>
          {saleTargets.map((target) => (
            <button
              key={target}
              type="button"
              onClick={() => setSaleTarget(target)}
              className={`whitespace-nowrap px-3.5 py-2 text-sm font-bold ${
                saleTarget === target
                  ? "button-secondary rounded-full border-primary/20 bg-primary/10 text-primaryStrong"
                  : "pill-chip text-content"
              }`}
            >
              {target}
            </button>
          ))}
        </section>

        <section className="flex gap-2 overflow-x-auto pb-1">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={`whitespace-nowrap px-3.5 py-2 text-sm font-bold ${
                selectedCategory === category
                  ? "button-secondary rounded-full border-primary/20 bg-primary/10 text-primaryStrong"
                  : "pill-chip text-content"
              }`}
            >
              {category}
            </button>
          ))}
        </section>

        <section className="grid grid-cols-2 gap-2.5">
          {visibleProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              quantity={cart[product.id] ?? 0}
              onChangeQuantity={setProductQuantity}
            />
          ))}
        </section>

        <section className="fixed bottom-[84px] left-0 right-0 z-40">
          <div className="mx-auto max-w-lg px-4">
            <div className="surface-card shadow-glow">
              {cartItems.length === 0 ? (
                <div className="flex items-center justify-between gap-3 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <ShoppingCart size={16} className="text-primaryStrong" />
                    <p className="text-sm font-extrabold text-content">Tu carrito aparece aca</p>
                  </div>
                  <p className="text-sm font-extrabold text-muted">{formatCurrency(0)}</p>
                </div>
              ) : (
                <div className="flex items-center gap-2 px-3 py-2.5">
                  <button
                    type="button"
                    onClick={() => setShowEditCartSheet(true)}
                    className="flex min-w-0 flex-1 items-center gap-2 rounded-2xl px-2 py-2 text-left"
                  >
                    <ShoppingCart size={16} className="shrink-0 text-primaryStrong" />
                    <p className="truncate text-sm font-extrabold text-content">
                      {`${cartCount} producto${cartCount === 1 ? "" : "s"} · ${formatCurrency(cartTotal)}`}
                    </p>
                    <ChevronUp size={16} className="shrink-0 text-muted" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowChargeSheet(true)}
                    className="button-primary min-w-[112px] rounded-2xl px-4 py-2.5 text-sm font-extrabold"
                  >
                    Cobrar
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      <div className="hidden lg:flex lg:min-h-[calc(100vh-180px)] lg:flex-col">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="section-title">Consumos</p>
            <h1 className="mt-1 text-[32px] font-extrabold tracking-[-0.03em] text-content">Punto de venta</h1>
            <p className="mt-1 text-sm text-muted">
              {consumptionContext
                ? `Venta asociada a ${consumptionContext.playerName ?? consumptionContext.label}`
                : "Venta rapida para mostrador, turno o visitante."}
            </p>
          </div>

          <DesktopSearchField
            value={search}
            onChange={setSearch}
            placeholder="Buscar producto..."
            inputRef={searchRef}
            className="min-w-[340px]"
          />
        </div>

        <section className="grid flex-1 grid-cols-[260px_minmax(0,1fr)_360px] gap-5">
          <aside className="space-y-4">
            <DesktopPanelCard
              title="Venta para"
              subtitle={
                consumptionContext
                  ? consumptionContext.type === "player"
                    ? "Consumo asociado al jugador del turno"
                    : consumptionContext.type === "visitor"
                      ? "Consumo para visitante sin jugador asociado"
                      : "Venta libre de mostrador"
                  : "Elegi el contexto operativo de la venta."
              }
              action={
                <div className="flex h-11 w-11 items-center justify-center rounded-[18px] bg-primary/12 text-primaryStrong">
                  <UserRound size={17} />
                </div>
              }
            >
              <h2 className="text-xl font-extrabold text-content">{saleTarget}</h2>

              {!consumptionContext && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {saleTargets.map((target) => (
                    <button
                      key={target}
                      type="button"
                      onClick={() => setSaleTarget(target)}
                      className={`px-3.5 py-2 text-sm font-bold ${
                        saleTarget === target
                          ? "button-secondary rounded-full border-primary/20 bg-primary/10 text-primaryStrong"
                          : "pill-chip text-content"
                      }`}
                    >
                      {target}
                    </button>
                  ))}
                </div>
              )}
            </DesktopPanelCard>

            <DesktopPanelCard title="Categorias">
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    className={`flex w-full items-center justify-between rounded-[20px] px-3.5 py-3 text-left ${
                      selectedCategory === category
                        ? "border border-primary/20 bg-primary/10 text-primaryStrong"
                        : "border border-line bg-white/5 text-content"
                    }`}
                  >
                    <span className="text-sm font-extrabold">{category}</span>
                    <ChevronUp
                      size={14}
                      className={`rotate-90 ${selectedCategory === category ? "text-primaryStrong" : "text-muted"}`}
                    />
                  </button>
                ))}
              </div>
            </DesktopPanelCard>

            <DesktopPanelCard
              title="Mas vendidos hoy"
              action={<Sparkles size={16} className="text-primaryStrong" />}
            >
              <div className="space-y-2">
                {mostSoldToday.map((product) => (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => setProductQuantity(product.id, (cart[product.id] ?? 0) + 1)}
                    className="flex w-full items-center justify-between rounded-[20px] border border-line bg-white/5 px-3.5 py-3 text-left"
                  >
                    <div>
                      <p className="text-sm font-extrabold text-content">{product.name}</p>
                      <p className="mt-1 text-xs text-muted">{product.soldToday} vendidos</p>
                    </div>
                    <p className="text-sm font-extrabold text-primaryStrong">{formatCurrency(product.price ?? 0)}</p>
                  </button>
                ))}
              </div>
            </DesktopPanelCard>
          </aside>

          <DesktopPanelCard
            title="Productos"
            subtitle={selectedCategory}
            action={<p className="text-sm font-bold text-muted">{visibleProducts.length} visibles</p>}
          >
            <div className="grid grid-cols-3 gap-3 xl:grid-cols-4">
              {visibleProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  quantity={cart[product.id] ?? 0}
                  onChangeQuantity={setProductQuantity}
                />
              ))}
            </div>
          </DesktopPanelCard>

          <DesktopCartPanel
            saleTarget={saleTarget}
            cartItems={cartItems}
            cartCount={cartCount}
            cartTotal={cartTotal}
            selectedChargeMethod={selectedChargeMethod}
            onSelectChargeMethod={setSelectedChargeMethod}
            onConfirmCharge={handleConfirmCharge}
            customerName={pendingCustomerName}
            customerPhone={pendingCustomerPhone}
            onNameChange={setPendingCustomerName}
            onPhoneChange={setPendingCustomerPhone}
            onSavePending={handleSavePending}
            mode={desktopCartMode}
            onModeChange={setDesktopCartMode}
            onChangeQuantity={setProductQuantity}
          />
        </section>
      </div>

      {showEditCartSheet && cartItems.length > 0 && (
        <EditCartSheet
          cartItems={cartItems}
          total={cartTotal}
          onClose={() => setShowEditCartSheet(false)}
          onChangeQuantity={setProductQuantity}
          onPending={() => {
            setShowEditCartSheet(false);
            setShowPendingSheet(true);
          }}
          onCharge={() => {
            setShowEditCartSheet(false);
            setShowChargeSheet(true);
          }}
        />
      )}

      {showChargeSheet && (
        <ChargeSheet
          total={cartTotal}
          selectedMethod={selectedChargeMethod}
          onSelectMethod={setSelectedChargeMethod}
          onConfirm={handleConfirmCharge}
          onClose={() => {
            setShowChargeSheet(false);
            setSelectedChargeMethod(null);
          }}
        />
      )}

      {showPendingSheet && (
        <PendingSheet
          total={cartTotal}
          saleTarget={saleTarget}
          customerName={pendingCustomerName}
          customerPhone={pendingCustomerPhone}
          onNameChange={setPendingCustomerName}
          onPhoneChange={setPendingCustomerPhone}
          onClose={() => {
            setShowPendingSheet(false);
            resetPendingForm();
          }}
          onSave={handleSavePending}
        />
      )}
    </div>
  );
}
