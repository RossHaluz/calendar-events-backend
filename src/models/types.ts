export interface Event {
  title: string;
  description?: string;
  priority: "LOW" | "MIDDLE" | "HIGH";
  start: string | Date;
  end: string | Date;
}
