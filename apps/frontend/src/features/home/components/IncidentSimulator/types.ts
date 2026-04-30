"use client";

export type View = "dashboard" | "incidents" | "status" | "logs" | "settings";
export type Level = "ll-info" | "ll-warn" | "ll-err" | "ll-sys" | "ll-debug";
export type Status = "up" | "crashing" | "crashed" | "recovering";

export interface ServerData {
  id: string;
  name: string;
  env: string;
  cpu: number;
  mem: number;
  rps: number;
  err: number;
  status: Status;
  exp: string;
}

export interface Incident {
  id: string;
  title: string;
  sev: "SEV1" | "SEV2" | "SEV3";
  status: "open" | "resolved";
  responder: TeamMember | null;
  assignMode: "auto" | "manual" | "admin";
  updates: { ts: string; msg: string }[];
  sid: string;
  ts: string;
  aiStatus: "thinking" | "done" | null;
  escalated: boolean;
  acked: boolean;
  sc: any;
  resolvedTs?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  av: string;
  duty: boolean;
  exp: string[];
}

export interface LogEntry {
  id: string;
  ts: string;
  sid: string;
  cls: Level;
  msg: string;
}

export interface TimelineItem {
  ts: string;
  msg: string;
  color: string;
  detail: string;
}

export interface Toast {
  id: number;
  msg: string;
  type: "info" | "danger" | "success" | "warn";
}
