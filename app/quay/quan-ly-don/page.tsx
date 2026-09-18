"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Camera,
  Check,
  ChevronRight,
  CircleAlert,
  Clock3,
  PackageCheck,
  Play,
  Plus,
  QrCode,
  Scale,
  ScanLine,
  Shirt,
  Truck,
  WashingMachine,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  createLaundryOrder,
  getLaundryOrders,
  updateOrderStatus,
  getMachines,
  saveMachines,
  type LaundryOrder,
  type MachineItem,
  type LaundryStatus,
  type LaundryService,
} from "@/lib/sachplus-data";

const columns = ["Đơn mới", "Phân loại", "Đang giặt", "Đang sấy", "QC & đóng gói"] as const;
type KanbanColumn = (typeof columns)[number];

function getKanbanColumn(status: LaundryStatus): KanbanColumn | null {
  switch (status) {
    case "Đã đặt":
    case "Shipper đã lấy":
    case "Đã nhận tại tiệm":
      return "Đơn mới";
    case "Đang phân loại":
      return "Phân loại";
    case "Đang giặt":
      return "Đang giặt";
    case "Đang sấy":
      return "Đang sấy";
    case "QC & đóng gói":
      return "QC & đóng gói";
    case "Đang giao":
    case "Hoàn tất":
    default:
      return null;
  }
}

const INTAKE_STEPS: { icon: LucideIcon; label: string }[] = [
  { icon: Scale, label: "Cân & ghi khối lượng thực tế (kg) vào hệ thống" },
  { icon: Camera, label: "Chụp ảnh hiện trạng (vết ố, sờn vải, cúc áo)" },
  { icon: Shirt, label: "Phân loại chất liệu: Đồ màu, đồ trắng, lụa/vest" },
  { icon: CircleAlert, label: "Ghi nhận đồ cần tẩy điểm hoặc lưu ý đặc biệt" },
  { icon: PackageCheck, label: "In tem mã QR, niêm phong túi và gán vào kệ chờ giặt" },
];

export default function StaffPage() {
  const [orders, setOrders] = useState<LaundryOrder[]>(getLaundryOrders);
  const [machines, setMachines] = useState<MachineItem[]>(getMachines);
  const [searchCode, setSearchCode] = useState("");
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedMachine, setSelectedMachine] = useState<string | null>(null);
  const [mobileKanbanCol, setMobileKanbanCol] = useState<string>("all");

  // Walk-in order modal state (Khách mang đồ trực tiếp tới tiệm)
  const [walkinModalOpen, setWalkinModalOpen] = useState(false);
  const [walkinName, setWalkinName] = useState("");
  const [walkinPhone, setWalkinPhone] = useState("");
  const [walkinWeight, setWalkinWeight] = useState("3.5");
  const [walkinService, setWalkinService] = useState<LaundryService>("Giặt & sấy");
  const [walkinCafeVoucher, setWalkinCafeVoucher] = useState(true);

  const handleWalkinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!walkinPhone.trim()) {
      toast.error("Vui lòng nhập số điện thoại để hệ thống gửi thông báo khi giặt xong.");
      return;
    }
    const order = createLaundryOrder({
      service: walkinService,
      pickupDate: new Date().toISOString().split("T")[0],
      pickupTime: "Trực tiếp tại quầy",
      journey: "Khách mang đến → Tự lấy",
      express: false,
      cafeTotal: 0,
      cafeItems: walkinCafeVoucher ? ["Voucher giảm 10% Café Lầu 1"] : [],
      customerName: walkinName.trim() || "Khách tại quầy",
      customerPhone: walkinPhone.trim(),
      customerAddress: "Shophouse SH-08 Tầng trệt",
    });

    updateOrderStatus(order.id, "Đã nhận tại tiệm");
    setOrders(getLaundryOrders());
    setWalkinModalOpen(false);
    toast.success(`Đã tiếp nhận đơn #${order.id} (${walkinWeight} kg). Cấp tem: ${order.id}-SGPARK`);
    setWalkinName("");
    setWalkinPhone("");
  };

  useEffect(() => {
    const refresh = () => {
      setOrders(getLaundryOrders());
      setMachines(getMachines());
    };
    refresh();

    const handleComplaint = () => {
      toast.info('📩 Khiếu nại mới từ khách hàng!');
      refresh();
    };

    window.addEventListener("sachplus:order-created", refresh);
    window.addEventListener("sachplus:order-updated", refresh);
    window.addEventListener("sachplus:machines-updated", refresh);
    window.addEventListener("sachplus:complaint-submitted", handleComplaint);

    return () => {
      window.removeEventListener("sachplus:order-created", refresh);
      window.removeEventListener("sachplus:order-updated", refresh);
      window.removeEventListener("sachplus:machines-updated", refresh);
      window.removeEventListener("sachplus:complaint-submitted", handleComplaint);
    };
  }, []);

  // Topbar KPIs derived from real localStorage orders
  const pendingNewCount = orders.filter(
    (o) => o.status === "Đã đặt" || o.status === "Shipper đã lấy" || o.status === "Đã nhận tại tiệm"
  ).length;
  const inMachineCount = orders.filter(
    (o) => o.status === "Đang giặt" || o.status === "Đang sấy"
  ).length;
  const expressCount = orders.filter(
    (o) => o.express && o.status !== "Hoàn tất"
  ).length;
  const qcDeliveryCount = orders.filter(
    (o) => o.status === "QC & đóng gói" || o.status === "Đang giao"
  ).length;

  const kpis: { value: string; label: string; icon: LucideIcon }[] = [
    { value: String(pendingNewCount), label: "Đơn mới chờ nhận", icon: Plus },
    { value: String(inMachineCount), label: "Đang xử lý tại máy", icon: WashingMachine },
    { value: String(expressCount), label: "Hỏa tốc ưu tiên", icon: Clock3 },
    { value: String(qcDeliveryCount), label: "Chờ QC & giao", icon: Truck },
  ];

  const advance = (order: LaundryOrder) => {
    const currentColumn = getKanbanColumn(order.status);
    if (!currentColumn) return;

    const index = columns.indexOf(currentColumn);
    if (index === columns.length - 1) {
      // Step: "QC & đóng gói" -> next is "Đang giao" (leaves kanban)
      const currentMachines = getMachines();
      const updatedMachines = currentMachines.map((m) =>
        m.assignedOrder === order.id || m.id === order.machineId
          ? { ...m, status: "Trống", note: "Sẵn sàng nhận đơn mới", state: "idle" as const, assignedOrder: undefined }
          : m
      );
      saveMachines(updatedMachines);
      setMachines(updatedMachines);

      updateOrderStatus(order.id, "Đang giao", { machineId: undefined, machineTimer: undefined });
      setOrders(getLaundryOrders());
      toast.success(`${order.id} đã hoàn tất QC và chuyển sang danh sách Đang giao!`);
      return;
    }

    const nextColumn = columns[index + 1];

    if (nextColumn === "Phân loại") {
      updateOrderStatus(order.id, "Đang phân loại");
      setOrders(getLaundryOrders());
      toast.success(`Đã chuyển đơn ${order.id} sang bước "Phân loại"`);
    } else if (nextColumn === "Đang giặt") {
      const washer = machines.find(
        (m) => m.state === "idle" && (m.id.startsWith("W") || m.type.toLowerCase().includes("giặt"))
      );
      const washerId = washer?.id || order.machineId || "W-01";
      const timer = "Còn 30p";
      if (washer) {
        const updatedMachines = machines.map((m) =>
          m.id === washer.id
            ? { ...m, status: "Đang giặt", note: `Đơn #${order.id} · Còn 30 phút`, state: "running" as const, assignedOrder: order.id }
            : m
        );
        saveMachines(updatedMachines);
        setMachines(updatedMachines);
      }
      updateOrderStatus(order.id, "Đang giặt", { machineId: washerId, machineTimer: timer });
      setOrders(getLaundryOrders());
      toast.success(`Đã chuyển đơn ${order.id} sang bước "Đang giặt" (${washerId})`);
    } else if (nextColumn === "Đang sấy") {
      const dryer = machines.find(
        (m) => m.state === "idle" && (m.id.startsWith("D") || m.type.toLowerCase().includes("sấy"))
      );
      const dryerId = dryer?.id || "D-01";
      const timer = "Còn 25p";
      const updatedMachines = machines.map((m) => {
        if (m.assignedOrder === order.id || m.id === order.machineId) {
          return { ...m, status: "Trống", note: "Sẵn sàng nhận đơn mới", state: "idle" as const, assignedOrder: undefined };
        }
        if (dryer && m.id === dryer.id) {
          return { ...m, status: "Đang sấy", note: `Đơn #${order.id} · Còn 25 phút`, state: "running" as const, assignedOrder: order.id };
        }
        return m;
      });
      saveMachines(updatedMachines);
      setMachines(updatedMachines);
      updateOrderStatus(order.id, "Đang sấy", { machineId: dryerId, machineTimer: timer });
      setOrders(getLaundryOrders());
      toast.success(`Đã chuyển đơn ${order.id} sang bước "Đang sấy" (${dryerId})`);
    } else if (nextColumn === "QC & đóng gói") {
      const updatedMachines = machines.map((m) =>
        m.assignedOrder === order.id || m.id === order.machineId
          ? { ...m, status: "Trống", note: "Sẵn sàng nhận đồ sấy", state: "idle" as const, assignedOrder: undefined }
          : m
      );
      saveMachines(updatedMachines);
      setMachines(updatedMachines);
      updateOrderStatus(order.id, "QC & đóng gói", { machineId: undefined, machineTimer: undefined });
      setOrders(getLaundryOrders());
      toast.success(`Đã chuyển đơn ${order.id} sang bước "QC & đóng gói"`);
    }
  };

  const handleScan = () => {
    const target = searchCode.trim().toUpperCase();
    if (!target) {
      if (orders.length === 0) {
        toast.info("Chưa có đơn hàng nào trong hệ thống");
        return;
      }
      const first = orders[0];
      toast.success(
        `Nhận diện thành công: ${first.id} (${first.service}${first.weight ? ` - ${first.weight}` : ""})`
      );
      return;
    }
    const found = orders.find(
      (o) =>
        o.id.toUpperCase().includes(target) ||
        (o.qrCode && o.qrCode.toUpperCase().includes(target))
    );
    if (found) {
      toast.success(
        `Nhận diện thành công: ${found.id} (${found.service}${found.weight ? ` - ${found.weight}` : ""})`
      );
    } else {
      toast.info(`Mã QR hợp lệ: ${target} · Cấp hồ sơ tiếp nhận mới.`);
    }
    setSearchCode("");
  };

  const assignMachine = (machineId: string) => {
    setSelectedMachine(machineId);
    setAssignDialogOpen(true);
  };

  const confirmAssign = (orderId: string) => {
    if (!selectedMachine) return;
    const isDryer = selectedMachine.startsWith("D");
    const targetStatus: LaundryStatus = isDryer ? "Đang sấy" : "Đang giặt";
    const timerText = isDryer ? "Còn 35 phút" : "Còn 45 phút";

    const updatedMachines = machines.map((m) =>
      m.id === selectedMachine
        ? {
            ...m,
            status: isDryer ? "Đang sấy" : "Đang giặt",
            note: `Đơn #${orderId} · ${timerText}`,
            state: "running" as const,
            assignedOrder: orderId,
          }
        : m
    );
    setMachines(updatedMachines);
    saveMachines(updatedMachines);

    updateOrderStatus(orderId, targetStatus, {
      machineId: selectedMachine,
      machineTimer: timerText,
    });
    setOrders(getLaundryOrders());

    setAssignDialogOpen(false);
    toast.success(`Đã gán đơn ${orderId} vào máy ${selectedMachine}!`);
  };

  const assignableOrders = useMemo(() => {
    const isDryer = selectedMachine?.startsWith("D");
    return orders.filter((o) => {
      const col = getKanbanColumn(o.status);
      if (!col) return false;
      if (isDryer) {
        return col === "Đang giặt" || col === "Phân loại" || col === "Đơn mới";
      }
      return col === "Đơn mới" || col === "Phân loại";
    });
  }, [orders, selectedMachine]);

  return (
    <div className="w-full min-w-0">
      {/* Topbar ca làm việc */}
      <header className="ops-topbar flex flex-wrap items-center justify-between gap-4">
        <div>
          <p>Thứ Năm, 17 tháng 9 · Shophouse Sài Gòn Park</p>
          <h1>Vận hành ca sáng (07:00 – 15:00)</h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setWalkinModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#0284C7] hover:bg-[#0284C7] text-white rounded-md text-xs font-bold tracking-wide shadow-sm transition hover:shadow cursor-pointer"
          >
            <Plus size={15} /> Tiếp nhận tại quầy (Walk-in)
          </button>
          <div className="shift-status">
            <i /> Đang trong ca làm · 3 nhân viên trực
          </div>
        </div>
      </header>

      {/* KPI Vận hành */}
      <section className="ops-kpis">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <article key={kpi.label}>
              <span>
                <Icon size={20} />
              </span>
              <div>
                <strong>{kpi.value}</strong>
                <p>{kpi.label}</p>
              </div>
            </article>
          );
        })}
      </section>

      {/* 3 Tabs chính của Staff */}
      <Tabs defaultValue="kanban" className="ops-tabs">
        <TabsList>
          <TabsTrigger value="kanban">Bảng Kanban Công Việc</TabsTrigger>
          <TabsTrigger value="receive">Tiếp Nhận Đồ & Quét QR</TabsTrigger>
          <TabsTrigger value="machines">Giám Sát Máy Giặt / Sấy</TabsTrigger>
        </TabsList>

        {/* 1. KANBAN BOARD */}
        <TabsContent value="kanban">
          {orders.length === 0 ? (
            <div className="py-16 text-center bg-white border border-stone-200 rounded-md p-8 my-4">
              <PackageCheck size={48} className="mx-auto mb-3 text-stone-400" />
              <h3 className="text-base font-semibold text-stone-700">Chưa có đơn hàng nào trong hệ thống</h3>
              <p className="text-xs text-stone-500 mt-1">Đơn đặt mới sẽ tự động hiển thị tại đây theo thời gian thực.</p>
            </div>
          ) : (
            <div className="w-full min-w-0">
              {/* Mobile Column Filter Pills (< 640px) */}
              <div className="sm:hidden flex items-center gap-1.5 overflow-x-auto pb-2 mb-3 no-scrollbar">
                <button
                  type="button"
                  onClick={() => setMobileKanbanCol("all")}
                  className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                    mobileKanbanCol === "all"
                      ? "bg-[#0284C7] text-white shadow-xs"
                      : "bg-white text-stone-600 border border-stone-200"
                  }`}
                >
                  Tất cả ({orders.length})
                </button>
                {columns.map((col) => {
                  const count = orders.filter((o) => getKanbanColumn(o.status) === col).length;
                  return (
                    <button
                      key={col}
                      type="button"
                      onClick={() => setMobileKanbanCol(col)}
                      className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                        mobileKanbanCol === col
                          ? "bg-[#0284C7] text-white shadow-xs"
                          : "bg-white text-stone-600 border border-stone-200"
                      }`}
                    >
                      {col} ({count})
                    </button>
                  );
                })}
              </div>

              <div className={`kanban-board ${mobileKanbanCol !== "all" ? "!grid-cols-1" : ""}`}>
                {columns
                  .filter((col) => mobileKanbanCol === "all" || mobileKanbanCol === col)
                  .map((column, index) => {
                    const columnOrders = orders.filter((o) => getKanbanColumn(o.status) === column);
                    return (
                      <section key={column} className="kanban-column">
                        <div className="column-head">
                          <div>
                            <span>{String(columns.indexOf(column) + 1).padStart(2, "0")}</span>
                            <h2>{column}</h2>
                          </div>
                          <b>{columnOrders.length}</b>
                        </div>

                    <div className="kanban-stack">
                      {columnOrders.map((order) => (
                        <article key={order.id} className={order.express ? "priority" : ""}>
                          <div className="job-head">
                            <strong>{order.id}</strong>
                            {order.express && <span>HỎA TỐC</span>}
                          </div>
                          <h3>{order.service}</h3>
                          <p>
                            <Scale size={13} /> {order.weight || "Tiêu chuẩn"} <span>•</span>
                            <Clock3 size={13} /> Hạn: {order.pickupTime || "Trong ngày"}
                          </p>
                          {order.machineId && (
                            <div className="machine-tag">
                              <WashingMachine size={13} /> {order.machineId} {order.machineTimer ? `· ${order.machineTimer}` : ""}
                            </div>
                          )}
                          <button type="button" onClick={() => advance(order)}>
                            {index === columns.length - 1 ? "Hoàn tất QC & Giao" : "Chuyển bước"}
                            <ChevronRight size={14} />
                          </button>
                        </article>
                      ))}

                      {columnOrders.length === 0 && (
                        <div className="empty-column py-8 text-center text-stone-400 text-xs">
                          <Check size={24} className="mx-auto mb-1 text-[#0284C7]" />
                          <span>Không có đơn tồn</span>
                        </div>
                      )}
                    </div>
                  </section>
                );
              })}
              </div>
            </div>
          )}
        </TabsContent>

        {/* 2. TIẾP NHẬN & QUÉT QR */}
        <TabsContent value="receive">
          <div className="receive-layout" id="scan">
            <section className="scanner-panel">
              <div className="scan-window">
                <ScanLine size={48} className="text-[#0284C7] animate-pulse" />
                <span className="font-semibold text-sm text-stone-700">Đưa mã QR trên túi đồ vào khung camera</span>
                <small className="text-xs text-stone-500">Hỗ trợ nhận diện mã tem in sẵn và mã trên điện thoại khách hàng</small>
              </div>

              <button type="button" onClick={handleScan}>
                <QrCode size={18} /> Kích hoạt máy quét Barcode/QR
              </button>

              <div className="mt-4 pt-4 border-t border-stone-200">
                <p className="text-xs font-bold text-stone-600 mb-2">Hoặc tra cứu mã đơn thủ công:</p>
                <div className="flex gap-2">
                  <input
                    value={searchCode}
                    onChange={(e) => setSearchCode(e.target.value)}
                    placeholder="Nhập mã đơn (VD: SP-123456)..."
                    className="flex-1 px-3 py-2 border rounded-md text-sm"
                  />
                  <button type="button" onClick={handleScan} className="px-4 py-2 bg-stone-900 text-white rounded-md text-xs font-bold">
                    Tìm kiếm
                  </button>
                </div>
              </div>
            </section>

            <section className="receive-checklist">
              <p className="kicker">QUY TRÌNH 5 BƯỚC TIẾP NHẬN</p>
              <h2>Mỗi túi đồ, một hồ sơ kiểm định rõ ràng.</h2>

              {INTAKE_STEPS.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div key={step.label} className="flex items-center gap-3 py-3 border-b border-stone-200">
                    <span className="w-9 h-9 rounded-md bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center shrink-0">
                      <Icon size={18} />
                    </span>
                    <div>
                      <strong className="text-xs font-bold text-stone-900 block">
                        {index + 1}. {step.label}
                      </strong>
                    </div>
                  </div>
                );
              })}
            </section>
          </div>
        </TabsContent>

        {/* 3. QUẢN LÝ MÁY GIẶT SẤY LIVE */}
        <TabsContent value="machines">
          <div className="machine-grid" id="machines">
            {machines.map((machine) => (
              <article className={`machine-card ${machine.state}`} key={machine.id}>
                <div className="machine-top">
                  <span>
                    <WashingMachine size={20} />
                  </span>
                  <div>
                    <strong>{machine.id}</strong>
                    <small>{machine.type}</small>
                  </div>
                  <i />
                </div>
                <h3>{machine.status}</h3>
                <p>{machine.note}</p>
                <button
                  type="button"
                  disabled={machine.state !== "idle" && machine.state !== "waiting"}
                  onClick={() => {
                    if (machine.state === "idle") {
                      assignMachine(machine.id);
                    } else if (machine.state === "waiting") {
                      const updated = machines.map((m) =>
                        m.id === machine.id
                          ? { ...m, status: "Trống", note: "Sẵn sàng nhận đơn mới", state: "idle" as const, assignedOrder: undefined }
                          : m
                      );
                      setMachines(updated);
                      saveMachines(updated);
                      toast.success(`Máy ${machine.id} đã hoàn tất và sẵn sàng cho mẻ mới!`);
                    }
                  }}
                >
                  <Play size={14} />
                  {machine.state === "idle"
                    ? "Gán đơn vào máy này"
                    : machine.state === "waiting"
                    ? "Lấy đồ ra · Đặt về Trống"
                    : machine.state === "error"
                    ? "Đang bảo trì"
                    : "Đang vận hành"}
                </button>
              </article>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* DIALOG GÁN ĐƠN VÀO MÁY */}
      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent className="sm:max-w-[400px] p-6 bg-white rounded-md">
          <DialogHeader>
            <p className="kicker text-[#0284C7]">VẬN HÀNH THIẾT BỊ</p>
            <DialogTitle className="text-xl font-bold tracking-tight">Gán đơn vào máy {selectedMachine}</DialogTitle>
            <DialogDescription className="text-xs text-stone-500">
              Chọn đơn từ danh sách chờ để bắt đầu chu trình {selectedMachine?.startsWith("D") ? "sấy" : "giặt"}:
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 my-3 max-h-[300px] overflow-y-auto">
            {assignableOrders.length === 0 ? (
              <div className="py-8 text-center text-stone-500 text-xs">
                {orders.length === 0 ? "Chưa có đơn hàng nào trong hệ thống" : "Không có đơn hàng nào chờ gán máy"}
              </div>
            ) : (
              assignableOrders.map((order) => (
                <div
                  key={order.id}
                  onClick={() => confirmAssign(order.id)}
                  className="p-3 bg-stone-50 hover:bg-[#E0F2FE] border border-stone-200 hover:border-[#0284C7] rounded-md cursor-pointer transition flex items-center justify-between"
                >
                  <div>
                    <strong className="text-xs text-stone-900 block">{order.id} · {order.service}</strong>
                    <small className="text-stone-500 text-[11px]">
                      {order.weight || "Tiêu chuẩn"} · Hạn {order.pickupTime || "Trong ngày"}
                      {order.express && <span className="ml-1 text-[#0369A1] font-bold">· HỎA TỐC</span>}
                    </small>
                  </div>
                  <ChevronRight size={16} className="text-stone-400" />
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* DIALOG TIẾP NHẬN TẠI QUẦY (WALK-IN) */}
      <Dialog open={walkinModalOpen} onOpenChange={setWalkinModalOpen}>
        <DialogContent className="sm:max-w-[480px] p-6 bg-white rounded-md">
          <DialogHeader>
            <p className="kicker text-[#0284C7]">TIẾP NHẬN TẠI QUẦY (WALK-IN)</p>
            <DialogTitle className="text-xl font-bold tracking-tight">Khách gửi đồ trực tiếp tại Shophouse SH-08</DialogTitle>
            <DialogDescription className="text-xs text-stone-500">
              Nhập nhanh thông tin khách hàng, cân ký và in tem định danh mã QR dán lên giỏ đồ. Khách có thể lên Tầng 1 uống cà phê chờ lấy.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleWalkinSubmit} className="space-y-4 my-2">
            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">
                Tên khách hàng
              </label>
              <input
                type="text"
                placeholder="VD: Anh Minh hoặc Chị Linh (Căn hộ S2.05)"
                value={walkinName}
                onChange={(e) => setWalkinName(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0284C7]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">
                Số điện thoại nhận tin nhắn xong đồ <span className="text-[#DC2626]">*</span>
              </label>
              <input
                type="tel"
                required
                placeholder="VD: 0912 345 678"
                value={walkinPhone}
                onChange={(e) => setWalkinPhone(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0284C7]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Khối lượng thực tế (kg)
                </label>
                <input
                  type="text"
                  value={walkinWeight}
                  onChange={(e) => setWalkinWeight(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0284C7]"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Gói dịch vụ
                </label>
                <select
                  value={walkinService}
                  onChange={(e) => setWalkinService(e.target.value as LaundryService)}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0284C7] bg-white"
                >
                  <option value="Giặt & sấy">Giặt & sấy lấy liền (45p)</option>
                  <option value="Giặt sấy + Gấp">Giặt sấy + Gấp gọn</option>
                  <option value="Giặt hấp Eco">Giặt hấp Eco cao cấp</option>
                  <option value="Chăn mền ga gối">Chăn mền ga gối</option>
                </select>
              </div>
            </div>

            <div className="p-3 bg-[#F0F9FF]/70 border border-[#0284C7]/20 rounded-md flex items-center justify-between">
              <div>
                <strong className="text-xs text-[#0369A1] block">Tặng Voucher Café Tầng 1 (-10%)</strong>
                <p className="text-[11px] text-[#0369A1]">Mời khách lên lầu 1 thưởng thức cà phê máy trong thời gian chờ</p>
              </div>
              <input
                type="checkbox"
                checked={walkinCafeVoucher}
                onChange={(e) => setWalkinCafeVoucher(e.target.checked)}
                className="w-4 h-4 text-[#0284C7] rounded cursor-pointer"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setWalkinModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-md cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold text-white bg-[#0284C7] hover:bg-[#0284C7] rounded-md shadow cursor-pointer"
              >
                Xác nhận & In tem QR
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
