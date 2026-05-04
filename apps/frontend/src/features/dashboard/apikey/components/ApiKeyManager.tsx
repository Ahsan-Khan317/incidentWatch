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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h4 className="text-[10px] font-black text-heading uppercase tracking-[0.2em]">
            API Access Keys
          </h4>
          <p className="text-[10px] text-muted font-bold uppercase tracking-widest opacity-60">
            Keys for system-to-system instrumentation.
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-black text-[10px] font-black rounded-none hover:bg-primary/90 transition-all uppercase tracking-[0.2em] shadow-lg shadow-primary/20"
        >
          <Plus size={14} />
          Create Key
        </button>
      </div>

      <div className="bg-surface-2 border border-border/50 rounded-none overflow-x-auto shadow-sm">
        {isLoading && apiKeys.length === 0 ? (
          <div className="p-12 text-center text-muted text-[10px] uppercase font-bold tracking-[0.2em] animate-pulse">
            Connecting to Vault...
          </div>
        ) : apiKeys.length === 0 ? (
          <div className="p-12 text-center text-muted text-[10px] uppercase font-bold tracking-[0.2em] italic opacity-40">
            No keys in rotation.
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-3/50 border-b border-border/50">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted">
                  Identifier
                </th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted hidden md:table-cell">
                  Secret Key
                </th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted hidden sm:table-cell">
                  TTL / Expiration
                </th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted text-right">
                  Control
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
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-2 h-2 rounded-none ${isEffectivelyActive ? "bg-success shadow-[0_0_8px_rgba(34,197,94,0.4)]" : "bg-muted/30"}`}
                        />
                        <span className="text-[11px] font-black text-heading uppercase tracking-tight">
                          {key.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5 hidden md:table-cell">
                      <div className="flex items-center gap-2">
                        <code className="text-[10px] bg-surface-3 px-2 py-1 border border-border/50 font-mono text-muted max-w-[180px] truncate">
                          {visibleKeys[key._id]
                            ? key.key
                            : "••••••••••••••••••••••••••••••••"}
                        </code>
                        <button
                          onClick={() => toggleKeyVisibility(key._id)}
                          className="p-1.5 text-muted hover:text-primary transition-colors rounded-none hover:bg-surface-1 border border-transparent hover:border-border/50"
                        >
                          {visibleKeys[key._id] ? (
                            <EyeOff size={12} />
                          ) : (
                            <Eye size={12} />
                          )}
                        </button>
                        <button
                          onClick={() => copyToClipboard(key.key)}
                          className="p-1.5 text-muted hover:text-primary transition-colors rounded-none hover:bg-surface-1 border border-transparent hover:border-border/50"
                        >
                          <Copy size={12} />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-5 hidden sm:table-cell">
                      {getExpiryDisplay(key.expiresAt)}
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-1 md:opacity-0 group-hover:opacity-100 transition-opacity">
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
