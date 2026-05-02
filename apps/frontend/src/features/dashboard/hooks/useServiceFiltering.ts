import { useState, useMemo } from "react";
import { useServiceStore } from "../store/service-store";

export default function useServiceFiltering() {
  const { selectedServiceId: globalServiceId } = useServiceStore();
  const [localServiceId, setLocalServiceId] = useState("all");

  const activeServiceFilter = useMemo(() => {
    // If global is not "all", it overrides local
    if (globalServiceId && globalServiceId !== "all") {
      return globalServiceId;
    }
    return localServiceId;
  }, [globalServiceId, localServiceId]);

  return {
    localServiceId,
    setLocalFilter: setLocalServiceId,
    activeServiceFilter,
  };
}
