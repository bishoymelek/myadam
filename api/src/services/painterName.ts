export function derivePainterName(painterId: string): string {
  if (!painterId) {
    return "Painter";
  }

  if (painterId.startsWith("painter-")) {
    const parts = painterId.split("-");
    const suffix = parts[1] || painterId;
    // painter-1 -> Painter 1, painter-a -> Painter A
    return `Painter ${suffix.toUpperCase()}`;
  }

  // Fallback: Title-case the identifier
  return `Painter ${painterId.replace(/[_-]+/g, " ")}`.replace(/\b\w/g, (c) =>
    c.toUpperCase()
  );
}
