"use client";
import React, { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { Users, Plus, X, Search, Check, Shield } from "lucide-react";
import { membersApi } from "../../members/api/members.api";

export const ServiceMembersForm: React.FC = () => {
  const { watch, setValue } = useFormContext();
  const selectedMemberIds = watch("members") || [];

  const [allMembers, setAllMembers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await membersApi.getMembers();
        if (response.success) {
          setAllMembers(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch members", error);
      }
    };
    fetchMembers();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMember = (memberId: string) => {
    const currentIds = [...selectedMemberIds];
    const index = currentIds.indexOf(memberId);
    if (index === -1) {
      currentIds.push(memberId);
    } else {
      currentIds.splice(index, 1);
    }
    setValue("members", currentIds, { shouldDirty: true });
  };

  const filteredMembers = allMembers.filter((member) => {
    const name = member.name || "";
    const email = member.email || "";
    return (
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const selectedMembers = allMembers.filter((m) =>
    selectedMemberIds.includes(m.userId),
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 rounded-none text-blue-500 border border-blue-500/20">
            <Users size={18} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-tight">
              Service Team
            </h4>
            <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider">
              Only these members will be considered for auto-assignment
            </p>
          </div>
        </div>

        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-surface-2 border border-border hover:bg-surface-3 transition-all text-[10px] font-bold uppercase tracking-widest text-primary"
          >
            <Plus size={14} />
            Add Member
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-72 bg-surface-2 border border-border shadow-2xl z-[100] animate-in fade-in zoom-in-95 duration-200">
              <div className="p-3 border-b border-border">
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                    size={12}
                  />
                  <input
                    autoFocus
                    placeholder="Search members..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-surface-3 border border-border px-8 py-2 text-xs focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
              <div className="max-h-60 overflow-y-auto custom-scrollbar">
                {filteredMembers.length === 0 ? (
                  <div className="p-4 text-center text-[10px] text-muted uppercase tracking-widest">
                    No members found
                  </div>
                ) : (
                  filteredMembers.map((member) => (
                    <button
                      key={member._id}
                      type="button"
                      onClick={() => toggleMember(member.userId)}
                      className="w-full flex items-center justify-between px-4 py-3 hover:bg-surface-3 transition-all border-b border-border/50 last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-7 w-7 flex items-center justify-center text-[10px] font-bold ${member.avatarColor || "bg-blue-500/10 text-blue-500"}`}
                        >
                          {(member.name || "U")[0]}
                        </div>
                        <div className="text-left">
                          <p className="text-[11px] font-bold text-white truncate w-40">
                            {member.name}
                          </p>
                          <p className="text-[9px] text-muted truncate w-40 uppercase tracking-tighter">
                            {member.role}
                          </p>
                        </div>
                      </div>
                      {selectedMemberIds.includes(member.userId) && (
                        <Check size={14} className="text-primary" />
                      )}
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {selectedMembers.length === 0 ? (
          <div className="col-span-full py-12 border border-dashed border-border flex flex-col items-center justify-center gap-3 opacity-50">
            <Users className="text-muted" size={24} />
            <p className="text-[10px] text-muted uppercase tracking-[0.2em]">
              No members assigned to this service
            </p>
          </div>
        ) : (
          selectedMembers.map((member) => (
            <div
              key={member._id}
              className="group relative bg-surface-2 border border-border p-4 hover:border-primary/50 transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`h-10 w-10 flex items-center justify-center text-xs font-bold ${member.avatarColor || "bg-blue-500/10 text-blue-500"}`}
                >
                  {(member.name || "U")[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="text-[11px] font-bold text-white truncate">
                    {member.name}
                  </h5>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[9px] text-muted uppercase tracking-tighter flex items-center gap-1">
                      <Shield size={10} />
                      {member.role}
                    </span>
                    {member.oncall && (
                      <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => toggleMember(member.userId)}
                  className="p-1.5 text-muted hover:text-danger hover:bg-danger/10 transition-all opacity-0 group-hover:opacity-100"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {selectedMemberIds.length > 0 && (
        <div className="p-3 bg-primary/5 border border-primary/20 flex items-center gap-3">
          <Check className="text-primary" size={14} />
          <p className="text-[10px] text-zinc-400 font-medium uppercase tracking-wider">
            Auto-assignment will be restricted to these{" "}
            {selectedMemberIds.length} team members.
          </p>
        </div>
      )}
    </div>
  );
};
