"use client";
import React, { useState, useMemo } from "react";
import Container from "@/src/components/dashboard/common/Container";
import SectionHeading from "@/src/components/dashboard/common/SectionHeading";
import DashboardButton from "@/src/components/ui/DashboardButton";
import { Plus, Download } from "lucide-react";
import {
  useServices,
  useCreateService,
  useUpdateService,
  useDeleteService,
} from "../hooks/useServices";
import { Service } from "../types";
import { ServiceTable } from "@/src/features/service/components/ServiceTable";
import { CreateServiceModal } from "@/src/features/service/components/CreateServiceModal";
import { useServiceStore } from "../../dashboard/store/service-store";
import { useViewStore } from "../../dashboard/store/view-store";
import { ConfirmationModal } from "@/src/components/common/ConfirmationModal";

export default function ServicePage() {
  const [successMessage, setSuccessMessage] = useState("");
  const [isCreatePanelOpen, setIsCreatePanelOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);

  const servicesQuery = useServices();
  const { services: storeServices } = useServiceStore();
  const { selectedId, clearSelectedId } = useViewStore();
  const createMutation = useCreateService();
  const updateMutation = useUpdateService();
  const deleteMutation = useDeleteService();

  const services = useMemo(() => storeServices || [], [storeServices]);

  // Handle direct edit from other views (like ServiceDetailView)
  React.useEffect(() => {
    if (selectedId && services.length > 0) {
      const serviceToEdit = services.find((s) => s._id === selectedId);
      if (serviceToEdit) {
        setSelectedService(serviceToEdit);
        setIsCreatePanelOpen(false);
        // We don't clear the selectedId yet so that if the user reloads, it stays.
        // But we should probably clear it when the modal closes.
      }
    }
  }, [selectedId, services]);

  const handleCreated = (message: string) => {
    setSuccessMessage(message);
    setIsCreatePanelOpen(false);
  };

  const handleUpdate = (data: any) => {
    if (selectedService) {
      updateMutation.mutate(
        { id: selectedService._id, data },
        {
          onSuccess: () => {
            setSuccessMessage("Service updated successfully");
            setSelectedService(null);
            clearSelectedId();
          },
        },
      );
    }
  };

  const handleDelete = (service: Service) => {
    setServiceToDelete(service);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (serviceToDelete) {
      deleteMutation.mutate(serviceToDelete._id, {
        onSuccess: () => {
          setSuccessMessage("Service deleted successfully");
          setIsDeleteModalOpen(false);
          setServiceToDelete(null);
        },
      });
    }
  };

  return (
    <Container>
      <SectionHeading
        title="Services"
        description="Add and manage service base URLs. Define endpoints as path-only routes, not full URLs."
      >
        <DashboardButton variant="secondary">
          <Download size={14} />
          Export list
        </DashboardButton>

        <DashboardButton
          variant="primary"
          onClick={() => {
            setSuccessMessage("");
            setIsCreatePanelOpen((prev) => !prev);
            setSelectedService(null);
          }}
        >
          <Plus size={14} />
          {isCreatePanelOpen ? "Close form" : "New service"}
        </DashboardButton>
      </SectionHeading>

      {/* Create / Edit Service Panel (Inline) */}
      {isCreatePanelOpen && (
        <CreateServiceModal
          show={isCreatePanelOpen}
          onClose={() => setIsCreatePanelOpen(false)}
          onCreated={handleCreated}
          isLoading={createMutation.isPending}
          onSubmit={(data) =>
            createMutation.mutate(data, {
              onSuccess: () => handleCreated("Service created successfully"),
            })
          }
        />
      )}

      {selectedService && (
        <div className="mb-6 animate-in fade-in slide-in-from-top-4 duration-300">
          <CreateServiceModal
            show={!!selectedService}
            onClose={() => {
              setSelectedService(null);
              clearSelectedId();
            }}
            onCreated={() => {
              setSuccessMessage("Service updated successfully");
              setSelectedService(null);
              clearSelectedId();
            }}
            initialData={selectedService}
            isLoading={updateMutation.isPending}
            onSubmit={handleUpdate}
          />
        </div>
      )}

      {successMessage && (
        <div className="mb-6 border border-primary/40 bg-primary/10 px-3 py-2 text-sm text-primary animate-in fade-in duration-300">
          {successMessage}
        </div>
      )}

      <ServiceTable
        services={services}
        isLoading={servicesQuery.isLoading}
        isError={servicesQuery.isError}
        error={servicesQuery.error}
        onEdit={(service) => {
          setSelectedService(service);
          setIsCreatePanelOpen(false);
        }}
        onDelete={handleDelete}
      />

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Decommission Service"
        description={`Are you sure you want to decommission "${serviceToDelete?.name}"? This will stop all monitoring and auto-routing for this infrastructure. This action cannot be undone.`}
        confirmText="Decommission"
        isLoading={deleteMutation.isPending}
      />
    </Container>
  );
}
