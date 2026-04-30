import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { registerOrganization } from "@/src/features/auth/apis/auth.api";
import { setAuthToken } from "@/src/lib/api";
import { useAuthStore } from "@/src/features/auth/store/auth-store";
import type { AuthResponse, RegisterPayload } from "@/src/features/auth/types";

export function useRegister() {
  const setToken = useAuthStore((state) => state.setToken);
  const setUser = useAuthStore((state) => state.setUser);
  const router = useRouter();

  return useMutation<AuthResponse, Error, RegisterPayload>({
    mutationFn: (payload: RegisterPayload) => registerOrganization(payload),
    onSuccess(data) {
      const token = data.accessToken;
      const user = data.user!;

      setToken(token);
      setAuthToken(token);
      setUser(user);
      router.push("/");
    },
  });
}
