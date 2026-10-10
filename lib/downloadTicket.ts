export type TicketDownloadParams = {
  venueName: string;
  slot: string;
  bookingId: string | number;
  price: number;
  playerCount?: number;
  dateString?: string;
};

export function downloadTicketImage({
  venueName,
  slot,
  bookingId,
  price,
  playerCount = 1,
  dateString = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }),
}: TicketDownloadParams) {
  const scale = 2; // High resolution 2x export
  const width = 640;
  const height = 420;

  const canvas = document.createElement("canvas");
  canvas.width = width * scale;
  canvas.height = height * scale;
  const ctx = canvas.getContext("2d");

  if (!ctx) return;

  ctx.scale(scale, scale);

  // Dark Canvas Background
  const grad = ctx.createLinearGradient(0, 0, width, height);
  grad.addColorStop(0, "#09090b");
  grad.addColorStop(1, "#18181b");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // Outer Border Box
  ctx.strokeStyle = "#27272a";
  ctx.lineWidth = 2;
  ctx.strokeRect(10, 10, width - 20, height - 20);

  // Red Brand Top Accent
  const redGrad = ctx.createLinearGradient(0, 0, width, 0);
  redGrad.addColorStop(0, "#dc2626");
  redGrad.addColorStop(1, "#e11d48");
  ctx.fillStyle = redGrad;
  ctx.fillRect(10, 10, width - 20, 8);

  // Platform Watermark Logo Header
  ctx.fillStyle = "#ffffff";
  ctx.font = "900 22px system-ui, sans-serif";
  ctx.fillText("SPORTS BOOKING PASS", 35, 52);

  // Verified Badge
  ctx.fillStyle = "#15803d";
  ctx.fillRect(440, 32, 160, 26);
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 11px system-ui, sans-serif";
  ctx.fillText("VERIFIED PASS", 470, 49);

  ctx.fillStyle = "#a1a1aa";
  ctx.font = "500 13px system-ui, sans-serif";
  ctx.fillText(`Issued On: ${dateString}`, 35, 75);

  // Horizontal Divider Line
  ctx.strokeStyle = "#27272a";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(35, 95);
  ctx.lineTo(width - 35, 95);
  ctx.stroke();

  // Venue Name Section
  ctx.fillStyle = "#71717a";
  ctx.font = "bold 11px system-ui, sans-serif";
  ctx.fillText("RESERVED ARENA / GROUND", 35, 125);
  ctx.fillStyle = "#ffffff";
  ctx.font = "900 18px system-ui, sans-serif";
  ctx.fillText(venueName, 35, 150);

  // Time Slot Section
  ctx.fillStyle = "#71717a";
  ctx.font = "bold 11px system-ui, sans-serif";
  ctx.fillText("TIME SLOT", 35, 195);
  ctx.fillStyle = "#f87171";
  ctx.font = "bold 16px system-ui, sans-serif";
  ctx.fillText(slot, 35, 220);

  // Group Pass Size Section
  ctx.fillStyle = "#71717a";
  ctx.font = "bold 11px system-ui, sans-serif";
  ctx.fillText("PASS QUANTITY", 340, 125);
  ctx.fillStyle = "#ffffff";
  ctx.font = "900 18px system-ui, sans-serif";
  ctx.fillText(`${playerCount} ${playerCount === 1 ? "Person" : "People"}`, 340, 150);

  // Total Paid Section
  ctx.fillStyle = "#71717a";
  ctx.font = "bold 11px system-ui, sans-serif";
  ctx.fillText("TOTAL PAID", 340, 195);
  ctx.fillStyle = "#4ade80";
  ctx.font = "900 18px system-ui, sans-serif";
  ctx.fillText(`₹${price}`, 340, 220);

  // Booking Ref Footer Box
  ctx.fillStyle = "#18181b";
  ctx.fillRect(35, 270, width - 70, 90);
  ctx.strokeStyle = "#3f3f46";
  ctx.strokeRect(35, 270, width - 70, 90);

  ctx.fillStyle = "#a1a1aa";
  ctx.font = "bold 11px system-ui, sans-serif";
  ctx.fillText("BOOKING REFERENCE ID", 55, 300);
  ctx.fillStyle = "#f87171";
  ctx.font = "900 18px monospace";
  ctx.fillText(String(bookingId), 55, 330);

  // QR Note Right Side of Footer Box
  ctx.fillStyle = "#a1a1aa";
  ctx.font = "bold 10px system-ui, sans-serif";
  ctx.fillText("SCAN AT ARENA TURNSTILE", 400, 315);
  ctx.fillStyle = "#71717a";
  ctx.font = "500 10px system-ui, sans-serif";
  ctx.fillText("PRESENT DIGITAL PASS ON ARRIVAL", 400, 332);

  // Trigger Download
  const link = document.createElement("a");
  link.download = `entry-pass-${bookingId}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
}
