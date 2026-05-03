import { registerOrganization } from "@/src/features/auth/apis/auth.api";
import type { AuthResponse, RegisterPayload } from "@/src/features/auth/types";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export function useRegister() {
  const router = useRouter();

  return useMutation<AuthResponse, Error, RegisterPayload>({
    mutationFn: (payload: RegisterPayload) => registerOrganization(payload),
    onSuccess(data) {
      router.push("/login");
    },
  });
}
