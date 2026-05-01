"use client";
import React from "react";
import { motion } from "framer-motion";
import {
  Activity,
  UploadCloud,
  Webhook,
  PlusCircle,
  History,
  Terminal,
  Key,
} from "lucide-react";
import { ApiKeyManager } from "../../apikey/components/ApiKeyManager";

export const SettingsView: React.FC = () => {
  return (
    <motion.div
      key="settings"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="max-w-5xl mx-auto pb-20 pt-8"
    >
      <div className="space-y-12">
        {/* Section: Organization */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-1 pr-6">
            <h2 className="font-bold text-2xl text-primary mb-2">
              Organization
            </h2>
            <p className="text-sm text-muted leading-relaxed">
              Manage your workspace identity, regional compliance settings, and
              primary communication metadata.
            </p>
          </div>
          <div className="col-span-2 space-y-4">
            <div className="bg-surface-1 border border-border-soft p-6 rounded-md shadow-sm space-y-6">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted">
                  Workspace Name
                </label>
                <input
                  className="bg-transparent border border-border-soft rounded-md px-4 py-2.5 text-sm focus:border-primary focus:outline-none transition-colors text-heading"
                  type="text"
                  defaultValue="IncidentWatch Global"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted">
                  Resource Region
                </label>
                <select className="bg-surface-2 border border-border-soft rounded-md px-4 py-2.5 text-sm focus:border-primary focus:outline-none transition-colors text-heading appearance-none cursor-pointer">
                  <option>US-East (Northern Virginia)</option>
                  <option>EU-Central (Frankfurt)</option>
                  <option>AP-South (Singapore)</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        <hr className="border-border-soft" />

        {/* Section: Notifications */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-1 pr-6">
            <h2 className="font-bold text-2xl text-primary mb-2">
              Notifications
            </h2>
            <p className="text-sm text-muted leading-relaxed">
              Configure how your team receives critical alerts and system
              heartbeat summaries.
            </p>
          </div>
          <div className="col-span-2">
            <div className="bg-surface-1 border border-border-soft rounded-md divide-y divide-border-soft shadow-sm">
              <div className="p-6 flex items-center justify-between">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-heading">
                    Email Alerts
                  </h4>
                  <p className="text-xs text-muted">
                    Send high-priority incident reports to admin email
                    addresses.
                  </p>
                </div>
                <div className="w-10 h-5 rounded-md relative transition-all duration-300 bg-primary cursor-pointer shadow-sm">
                  <div className="absolute top-1 w-3 h-3 bg-surface-1 rounded-md transition-all left-6 shadow-sm" />
                </div>
              </div>
              <div className="p-6 flex items-center justify-between">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-heading">
                    Slack Integration
                  </h4>
                  <p className="text-xs text-muted">
                    Push real-time system logs to the #ops-monitoring channel.
                  </p>
                </div>
                <div className="w-10 h-5 rounded-md relative transition-all duration-300 bg-primary cursor-pointer shadow-sm">
                  <div className="absolute top-1 w-3 h-3 bg-surface-1 rounded-md transition-all left-6 shadow-sm" />
                </div>
              </div>
              <div className="p-6 flex items-center justify-between">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-heading">
                    Desktop Push
                  </h4>
                  <p className="text-xs text-muted">
                    Visual browser notifications for immediate status shifts.
                  </p>
                </div>
                <div className="w-10 h-5 rounded-md relative transition-all duration-300 bg-surface-3 border border-border-soft cursor-pointer shadow-sm">
                  <div className="absolute top-1 w-3 h-3 bg-muted rounded-md transition-all left-1 shadow-sm" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <hr className="border-border-soft" />

        {/* Section: Integrations */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-1 pr-6">
            <h2 className="font-bold text-2xl text-primary mb-2">
              Integrations
            </h2>
            <p className="text-sm text-muted leading-relaxed">
              Connect IncidentWatch with external data sources and observability
              platforms.
            </p>
          </div>
          <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-surface-1 border border-border-soft p-4 rounded-md flex flex-col gap-4 border-l-2 border-l-primary shadow-sm hover:bg-surface-2 transition-colors group">
              <div className="flex items-center gap-3">
                <Activity
                  className="text-primary group-hover:scale-110 transition-transform"
                  size={16}
                />
                <h4 className="text-sm font-bold text-heading">
                  Grafana Cloud
                </h4>
              </div>
              <p className="text-[11px] text-muted leading-tight">
                Bi-directional telemetry sync active since 48h ago.
              </p>
              <button className="text-[10px] uppercase font-bold tracking-widest text-primary hover:underline text-left mt-auto">
                Configure
              </button>
            </div>

            <div className="bg-surface-1 border border-border-soft p-4 rounded-md flex flex-col gap-4 shadow-sm hover:bg-surface-2 transition-colors group">
              <div className="flex items-center gap-3">
                <UploadCloud
                  className="text-muted group-hover:text-primary transition-colors"
                  size={16}
                />
                <h4 className="text-sm font-bold text-heading">
                  AWS S3 Archiving
                </h4>
              </div>
              <p className="text-[11px] text-muted leading-tight">
                Automatic log rotation and cold storage storage.
              </p>
              <button className="text-[10px] uppercase font-bold tracking-widest text-muted hover:text-heading transition-colors text-left mt-auto">
                Connect
              </button>
            </div>

            <div className="bg-surface-1 border border-border-soft p-4 rounded-md flex flex-col gap-4 shadow-sm hover:bg-surface-2 transition-colors group">
              <div className="flex items-center gap-3">
                <Webhook
                  className="text-muted group-hover:text-primary transition-colors"
                  size={16}
                />
                <h4 className="text-sm font-bold text-heading">Webhook API</h4>
              </div>
              <p className="text-[11px] text-muted leading-tight">
                Securely push telemetry and incident data via API.
              </p>
              <span className="text-[9px] uppercase font-black tracking-widest text-primary/60 mt-auto">
                Configured in API
              </span>
            </div>

            <div className="bg-primary-soft border border-primary/30 p-4 rounded-md flex flex-col gap-4 shadow-sm hover:bg-primary/10 transition-colors group cursor-pointer">
              <div className="flex items-center gap-3">
                <PlusCircle
                  className="text-primary group-hover:scale-110 transition-transform"
                  size={16}
                />
                <h4 className="text-sm font-bold text-heading">Custom Sync</h4>
              </div>
              <p className="text-[11px] text-muted leading-tight">
                Define a new endpoint for system telemetry.
              </p>
              <button className="text-[10px] uppercase font-bold tracking-widest text-primary hover:underline text-left mt-auto">
                Browse Catalog
              </button>
            </div>
          </div>
        </section>

        <hr className="border-border-soft" />

        {/* Section: API */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-1 pr-6">
            <h2 className="font-bold text-2xl text-primary mb-2">API</h2>
            <p className="text-sm text-muted leading-relaxed">
              Generate and manage API keys for programmatic access to your
              incidents and telemetry data.
            </p>
          </div>
          <div className="col-span-2 space-y-4">
            <div className="bg-surface-1 border border-border-soft p-6 rounded-md shadow-sm">
              <ApiKeyManager />
            </div>

            <div className="bg-surface-1 border border-border-soft p-6 rounded-md shadow-sm flex items-center justify-between group cursor-pointer hover:bg-surface-2 transition-colors">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-primary-soft rounded-md">
                  <Terminal size={18} className="text-primary" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-heading">
                    API Documentation
                  </h4>
                  <p className="text-xs text-muted">
                    Explore our comprehensive API reference and integration
                    guides.
                  </p>
                </div>
              </div>
              <button className="text-[10px] uppercase font-bold tracking-widest text-primary hover:underline">
                View Docs
              </button>
            </div>
          </div>
        </section>

        <hr className="border-border-soft" />

        {/* Section: Security */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-1 pr-6">
            <h2 className="font-bold text-2xl text-primary mb-2">Security</h2>
            <p className="text-sm text-muted leading-relaxed">
              Hardened access controls and audit logging for system integrity.
            </p>
          </div>
          <div className="col-span-2 space-y-4">
            <div className="bg-surface-1 border border-border-soft p-6 rounded-md shadow-sm">
              <div className="flex items-center justify-between pb-6 border-b border-border-soft">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-heading">
                    Two-Factor Auth (2FA)
                  </h4>
                  <p className="text-xs text-muted">
                    Require an authenticator app for all admin logins.
                  </p>
                </div>
                <span className="px-2 py-0.5 bg-success-soft text-success text-[10px] font-bold rounded-sm border border-success-border tracking-wider shadow-sm">
                  ENFORCED
                </span>
              </div>
              <div className="flex items-center justify-between py-6">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-heading">
                    Session Duration
                  </h4>
                  <p className="text-xs text-muted">
                    Automatically logout inactive users after a set period.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    className="w-16 bg-surface-2 border border-border-soft rounded-md px-2 py-1 text-sm text-center text-heading focus:outline-none focus:border-primary shadow-sm"
                    type="number"
                    defaultValue="12"
                  />
                  <span className="text-[10px] font-bold text-muted uppercase tracking-widest">
                    Hours
                  </span>
                </div>
              </div>
              <div className="pt-6 border-t border-border-soft">
                <button className="w-full py-3 bg-surface-2 hover:bg-surface-3 border border-border-soft rounded-md flex items-center justify-center gap-2 text-xs font-bold transition-colors text-muted hover:text-heading shadow-sm group">
                  <History
                    className="text-muted group-hover:-rotate-45 transition-transform"
                    size={14}
                  />
                  VIEW AUDIT LOGS
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Danger Zone */}
        <section className="pt-8">
          <div className="p-6 border border-danger/30 bg-danger-soft rounded-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
            <div>
              <h4 className="text-sm font-bold text-danger">Danger Zone</h4>
              <p className="text-xs text-danger/80 mt-1">
                Permanently delete all incident history and organization data.
              </p>
            </div>
            <button className="px-6 py-2 border border-danger/50 text-danger hover:bg-danger hover:text-white transition-all text-xs font-bold rounded-md shadow-sm whitespace-nowrap">
              PURGE ALL DATA
            </button>
          </div>
        </section>
      </div>
    </motion.div>
  );
};
