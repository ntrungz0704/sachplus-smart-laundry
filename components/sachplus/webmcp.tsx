"use client";

import { useEffect } from "react";
import { createLaundryOrder, getLaundryOrders, serviceCatalog, type LaundryService } from "@/lib/sachplus-data";

declare global {
  interface Document { modelContext?: { registerTool: (tool: unknown, options?: { signal?: AbortSignal }) => void | Promise<void> } }
}

export function WebMCPTools() {
  useEffect(() => {
    const context = document.modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    const services = serviceCatalog.map((item) => item.name);
    void Promise.resolve(context.registerTool({
      name: "read_laundry_orders",
      title: "Xem đơn giặt",
      description: "Đọc danh sách đơn giặt hiện có cùng trạng thái và thành tiền.",
      inputSchema: { type: "object", properties: {}, additionalProperties: false },
      annotations: { readOnlyHint: true, untrustedContentHint: false },
      execute: () => ({ orders: getLaundryOrders().map(({ id, service, pickupDate, pickupTime, status, total }) => ({ id, service, pickupDate, pickupTime, status, total })) }),
    }, { signal: lifecycle.signal })).catch(() => undefined);
    void Promise.resolve(context.registerTool({
      name: "create_laundry_order",
      title: "Tạo đơn giặt",
      description: "Tạo một đơn giặt mới với dịch vụ, ngày lấy, khung giờ và lựa chọn hỏa tốc.",
      inputSchema: { type: "object", properties: { service: { type: "string", enum: services }, pickupDate: { type: "string", description: "Ngày lấy theo định dạng YYYY-MM-DD" }, pickupTime: { type: "string", enum: ["09:00 – 11:00", "13:00 – 15:00", "17:00 – 19:00", "19:00 – 21:00"] }, express: { type: "boolean" } }, required: ["service", "pickupDate", "pickupTime"], additionalProperties: false },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute: (raw: unknown) => {
        const input = raw as { service?: LaundryService; pickupDate?: string; pickupTime?: string; express?: boolean };
        if (!input.service || !services.includes(input.service) || !input.pickupDate || !/^\d{4}-\d{2}-\d{2}$/.test(input.pickupDate) || !input.pickupTime) throw new Error("Thông tin đơn giặt không hợp lệ.");
        const order = createLaundryOrder({ service: input.service, pickupDate: input.pickupDate, pickupTime: input.pickupTime, express: Boolean(input.express) });
        return { id: order.id, status: order.status, total: order.total };
      },
    }, { signal: lifecycle.signal })).catch(() => undefined);
    return () => lifecycle.abort();
  }, []);
  return null;
}
