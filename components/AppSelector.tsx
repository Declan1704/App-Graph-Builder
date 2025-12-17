import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchApps } from "../services/api";
import { useStore } from "../store/useStore";
import { Loader2, ChevronRight, LayoutGrid } from "lucide-react";
import { cn } from "./ui";
const AppSelector: React.FC = () => {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <LayoutGrid className="h-5 w-5" /> Applications
        </h2>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {apps?.map((app) => (
          <button
            key={app.id}
            onClick={() => {
              setSelectedAppId(app.id);
              if (window.innerWidth < 768) {
                toggleMobilePanel(false);
              }
            }}
            className={cn(
              "w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors group",
              selectedAppId === app.id
                ? "bg-primary text-primary-foreground"
                : "hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "h-8 w-8 rounded flex items-center justify-center text-xs font-bold",
                  selectedAppId === app.id
                    ? "bg-primary-foreground text-primary"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {app.icon}
              </div>
              <div>
                <div className="text-sm font-medium">{app.name}</div>
                <div
                  className={cn(
                    "text-xs",
                    selectedAppId === app.id
                      ? "text-primary-foreground/80"
                      : "text-muted-foreground"
                  )}
                >
                  {app.description}
                </div>
              </div>
            </div>
            {selectedAppId === app.id && (
              <ChevronRight className="h-4 w-4 opacity-50" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
export default AppSelector;
