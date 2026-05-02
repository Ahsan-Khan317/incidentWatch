"use client";
import React, { useState } from "react";
import {
  Copy,
  RefreshCw,
  Trash2,
  Shield,
  Eye,
  EyeOff,
  Plus,
  Clock,
  Infinity as InfinityIcon,
  Power,
} from "lucide-react";
import { useApiKeys } from "../hooks/useApiKeys";
import { CreateApiKeyModal } from "./CreateApiKeyModal";
import { formatDistanceToNow, isAfter } from "date-fns";

export const ApiKeyManager: React.FC = () => {
  const {
    apiKeys,
    isLoading,
    error,
    createApiKey,
    regenerateApiKey,
    deleteApiKey,
    toggleApiKeyStatus,
  } = useApiKeys();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [visibleKeys, setVisibleKeys] = useState<Record<string, boolean>>({});

  const toggleKeyVisibility = (id: string) => {
    setVisibleKeys((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("API Key copied to clipboard");
  };

  const getExpiryDisplay = (expiresAt?: string) => {
    if (!expiresAt) {
      return (
        <div className="flex items-center gap-1.5 text-muted">
          <InfinityIcon size={12} className="text-muted/50" />
          <span className="text-[10px] font-bold uppercase tracking-widest">
            Infinite
          </span>
        </div>
      );
    }

    const expiryDate = new Date(expiresAt);
    const expired = !isAfter(expiryDate, new Date());

    return (
      <div
        className={`flex items-center gap-1.5 ${expired ? "text-danger" : "text-muted"}`}
      >
        <Clock
          size={12}
          className={expired ? "text-danger" : "text-muted/50"}
        />
        <span className="text-[10px] font-bold uppercase tracking-widest">
          {expired
            ? "Expired"
            : formatDistanceToNow(expiryDate, { addSuffix: true })}
        </span>
      </div>
    );
  };

  if (error) {
    return (
      <div className="p-4 bg-danger-soft border border-danger/20 rounded-none text-danger text-sm">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-heading">API Access Keys</h4>
          <p className="text-xs text-muted">
            Manage keys used to authenticate with the IncidentWatch Webhook API.
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-3 py-1.5 bg-primary text-on-primary text-[11px] font-bold rounded-none hover:bg-primary-hover transition-all uppercase tracking-wider shadow-sm"
        >
          <Plus size={14} />
          Create Key
        </button>
      </div>

      <div className="bg-surface-2 border border-border-soft rounded-none overflow-hidden shadow-sm">
        {isLoading && apiKeys.length === 0 ? (
          <div className="p-12 text-center text-muted text-xs animate-pulse">
            Loading API keys...
          </div>
        ) : apiKeys.length === 0 ? (
          <div className="p-12 text-center text-muted text-xs italic">
            No API keys generated yet.
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-3 border-b border-border-soft">
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.15em] text-muted">
                  Name
                </th>
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.15em] text-muted">
                  Key
                </th>
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.15em] text-muted">
                  Expiration
                </th>
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.15em] text-muted text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-soft">
              {apiKeys.map((key) => {
                const isKeyExpired = key.expiresAt
                  ? !isAfter(new Date(key.expiresAt), new Date())
                  : false;
                const isEffectivelyActive = key.isActive && !isKeyExpired;

                return (
                  <tr
                    key={key._id}
                    className="hover:bg-surface-1 transition-colors group"
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-2 h-2 rounded-nonell ${isEffectivelyActive ? "bg-success shadow-[0_0_8px_rgba(34,197,94,0.4)]" : "bg-muted-soft"}`}
                        />
                        <span className="text-sm font-bold text-heading">
                          {key.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <code className="text-[11px] bg-surface-3 px-2 py-1 rounded-nonerder border-border-soft font-mono text-muted max-w-[180px] truncate">
                          {visibleKeys[key._id]
                            ? key.key
                            : "••••••••••••••••••••••••••••••••"}
                        </code>
                        <button
                          onClick={() => toggleKeyVisibility(key._id)}
                          className="p-1.5 text-muted hover:text-primary transition-colors rounded-none hover:bg-surface-2"
                        >
                          {visibleKeys[key._id] ? (
                            <EyeOff size={14} />
                          ) : (
                            <Eye size={14} />
                          )}
                        </button>
                        <button
                          onClick={() => copyToClipboard(key.key)}
                          className="p-1.5 text-muted hover:text-primary transition-colors rounded-none hover:bg-surface-2"
                        >
                          <Copy size={14} />
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      {getExpiryDisplay(key.expiresAt)}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => toggleApiKeyStatus(key._id)}
                          className={`p-1.5 transition-colors rounded-none ${
                            key.isActive
                              ? "text-success hover:bg-success-soft"
                              : "text-muted hover:text-success hover:bg-success-soft"
                          }`}
                          title={key.isActive ? "Disable Key" : "Enable Key"}
                        >
                          <Power size={14} />
                        </button>
                        <button
                          onClick={() => {
                            if (
                              confirm(
                                "Are you sure you want to regenerate this key? The old one will stop working immediately.",
                              )
                            ) {
                              regenerateApiKey(key._id);
                            }
                          }}
                          className="p-1.5 text-muted hover:text-primary transition-colors rounded-none hover:bg-surface-2"
                          title="Regenerate Key"
                        >
                          <RefreshCw size={14} />
                        </button>
                        <button
                          onClick={() => {
                            if (
                              confirm(
                                "Are you sure you want to delete this API key?",
                              )
                            ) {
                              deleteApiKey(key._id);
                            }
                          }}
                          className="p-1.5 text-muted hover:text-danger transition-colors rounded-none hover:bg-danger-soft"
                          title="Delete Key"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <CreateApiKeyModal
        show={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onAdd={async (data) => {
          await createApiKey(data);
          setShowCreateModal(false);
        }}
      />
    </div>
  );
};
