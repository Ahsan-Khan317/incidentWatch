"use client";
import React from "react";
import { motion } from "framer-motion";
import { Shield, Bell, Zap, Globe, Lock, Sliders } from "lucide-react";

const SettingsGroup = ({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: any;
  children: React.ReactNode;
}) => (
  <div className="bg-white/[0.03] border border-white/[0.06] rounded-md p-8 space-y-8">
    <div className="flex items-center gap-3 border-b border-white/[0.06] pb-6 mb-8">
      <div className="p-2 bg-primary/10 rounded-md text-primary border border-primary/20">
        <Icon size={18} />
      </div>
      <h3 className="text-sm font-bold text-white uppercase tracking-widest">
        {title}
      </h3>
    </div>
    <div className="space-y-6">{children}</div>
  </div>
);

const SettingItem = ({
  title,
  desc,
  enabled = false,
}: {
  title: string;
  desc: string;
  enabled?: boolean;
}) => (
  <div className="flex items-center justify-between group">
    <div className="max-w-md">
      <h4 className="text-sm font-bold text-white group-hover:text-primary transition-colors">
        {title}
      </h4>
      <p className="text-[11px] text-zinc-500 mt-1 leading-relaxed">{desc}</p>
    </div>
    <button
      className={`w-10 h-5 rounded-md relative transition-all duration-300 ${enabled ? "bg-primary" : "bg-white/[0.06]"}`}
    >
      <div
        className={`absolute top-1 w-3 h-3 bg-white rounded-md transition-all ${enabled ? "left-6" : "left-1"}`}
      />
    </button>
  </div>
);

export const SettingsView: React.FC = () => {
  return (
    <motion.div
      key="settings"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="grid grid-cols-1 lg:grid-cols-2 gap-8"
    >
      <SettingsGroup title="Operations" icon={Zap}>
        <SettingItem
          title="AI Root Cause Analysis"
          desc="Use Claude 3.5 Sonnet to automatically diagnose incidents."
          enabled={true}
        />
        <SettingItem
          title="Auto-Assign Responder"
          desc="Intelligently route incidents to on-call engineers."
          enabled={true}
        />
        <SettingItem
          title="Smart Escalation"
          desc="Escalate SEV1 alerts if not acknowledged in 3 mins."
          enabled={true}
        />
      </SettingsGroup>

      <SettingsGroup title="Security" icon={Lock}>
        <SettingItem
          title="2FA Enforcement"
          desc="Require multi-factor auth for all responders."
          enabled={true}
        />
        <SettingItem
          title="Audit Logging"
          desc="Track all actions within the incident watch dashboard."
          enabled={true}
        />
        <SettingItem
          title="SSO Integration"
          desc="Connect with Okta or Google Workspace."
          enabled={false}
        />
      </SettingsGroup>

      <SettingsGroup title="Notifications" icon={Bell}>
        <SettingItem
          title="Slack Integration"
          desc="Send critical alerts to #incident-command."
          enabled={true}
        />
        <SettingItem
          title="SMS Backups"
          desc="Call or text engineers if Slack is unresponsive."
          enabled={true}
        />
        <SettingItem
          title="Weekly Reports"
          desc="Receive a digest of MTTR and system health."
          enabled={false}
        />
      </SettingsGroup>

      <SettingsGroup title="Global" icon={Globe}>
        <SettingItem
          title="Public Status Page"
          desc="Automatically update status.yourdomain.com."
          enabled={false}
        />
        <SettingItem
          title="Telemetry Sync"
          desc="Ingest logs from DataDog and NewRelic."
          enabled={true}
        />
        <SettingItem
          title="API Access"
          desc="Manage API keys for third-party automation."
          enabled={true}
        />
      </SettingsGroup>
    </motion.div>
  );
};
