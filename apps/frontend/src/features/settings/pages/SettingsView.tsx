"use client";

import React from "react";
import Container from "@/src/components/dashboard/common/Container";
import SectionHeading from "@/src/components/dashboard/common/SectionHeading";
import { Save } from "lucide-react";
import SettingsSection from "../components/SettingsSection";
import { ApiKeyManager } from "../../dashboard/apikey/components/ApiKeyManager";
import IntegrationGrid from "../components/IntegrationGrid";
import SecurityConfig from "../components/SecurityConfig";

export const SettingsView: React.FC = () => {
  return (
    <Container className="pb-20">
      <SectionHeading
        title="System Settings"
        description="Manage your workspace identity, notification preferences, and infrastructure security."
      >
        <button className="bg-primary text-black flex items-center gap-2 px-4 py-2 rounded shadow-primary hover:scale-105 transition-all font-bold text-xs uppercase">
          <Save size={16} />
          <span>Save Changes</span>
        </button>
      </SectionHeading>

      <div className="space-y-12">
        {/* Organization Section */}
        <SettingsSection
          title="Organization"
          description="Configure your workspace metadata and primary operational region."
        >
          <div className="rounded border border-border bg-surface-1 p-6 shadow-sm space-y-6">
            <div className="flex flex-col gap-2">
              <label className="text-[0.625rem] font-bold uppercase tracking-widest text-muted">
                Workspace Name
              </label>
              <input
                type="text"
                defaultValue="IncidentWatch Global"
                className="rounded border border-border bg-transparent px-4 py-2.5 text-sm text-heading outline-none focus:border-primary transition-colors"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[0.625rem] font-bold uppercase tracking-widest text-muted">
                Operational Region
              </label>
              <select className="rounded border border-border bg-surface-2 px-4 py-2.5 text-sm text-heading outline-none focus:border-primary transition-colors cursor-pointer appearance-none">
                <option>US-East (Northern Virginia)</option>
                <option>EU-Central (Frankfurt)</option>
                <option>AP-South (Singapore)</option>
              </select>
            </div>
          </div>
        </SettingsSection>

        <hr className="border-border/50" />

        {/* Notifications Section */}
        <SettingsSection
          title="Notifications"
          description="Configure delivery channels for critical incidents and system events."
        >
          <div className="rounded border border-border bg-surface-1 shadow-sm divide-y divide-border">
            {[
              {
                label: "Email Alerts",
                sub: "Send high-priority reports to admin addresses.",
                active: true,
              },
              {
                label: "Slack Integration",
                sub: "Push real-time logs to #ops-monitoring.",
                active: true,
              },
              {
                label: "Desktop Push",
                sub: "Visual browser notifications for status shifts.",
                active: false,
              },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between p-6"
              >
                <div>
                  <h4 className="text-sm font-bold text-heading">
                    {item.label}
                  </h4>
                  <p className="text-xs text-muted">{item.sub}</p>
                </div>
                <div
                  className={`relative h-5 w-10 cursor-pointer rounded-full transition-all duration-300 ${item.active ? "bg-primary" : "bg-surface-3 border border-border"}`}
                >
                  <div
                    className={`absolute top-1 h-3 w-3 rounded-full bg-white transition-all ${item.active ? "left-6" : "left-1 bg-muted"}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </SettingsSection>

        <hr className="border-border/50" />

        {/* Integrations Section */}
        <SettingsSection
          title="Integrations"
          description="Connect with external observability platforms and data sinks."
        >
          <IntegrationGrid />
        </SettingsSection>

        <hr className="border-border/50" />

        {/* API Section */}
        <SettingsSection
          title="API Keys"
          description="Programmatic access tokens for custom instrumentation and automation."
        >
          <div className="rounded border border-border bg-surface-1 p-6 shadow-sm">
            <ApiKeyManager />
          </div>
        </SettingsSection>

        <hr className="border-border/50" />

        {/* Security Section */}
        <SettingsSection
          title="Security"
          description="Enforce authentication policies and audit log visibility."
        >
          <SecurityConfig />
        </SettingsSection>

        {/* Danger Zone */}
        <div className="rounded border border-rose-500/30 bg-rose-500/5 p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-danger">Danger Zone</h4>
            <p className="text-xs text-danger/70">
              Permanently delete all workspace data and historical incidents.
            </p>
          </div>
          <button className="rounded border border-danger-border px-6 py-2 text-xs font-bold text-danger transition-all hover:bg-danger hover:text-white">
            PURGE ALL DATA
          </button>
        </div>
      </div>
    </Container>
  );
};
