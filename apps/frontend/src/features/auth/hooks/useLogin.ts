import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { loginOrganization } from "@/src/features/auth/apis/auth.api";
import { setAuthToken } from "@/src/lib/api";
import { useAuthStore } from "@/src/features/auth/store/auth-store";
import type { AuthResponse, LoginPayload } from "@/src/features/auth/types";

export function useLogin() {
  const setToken = useAuthStore((state) => state.setToken);
  const setUser = useAuthStore((state) => state.setUser);
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation<AuthResponse, Error, LoginPayload>({
    mutationFn: (payload: LoginPayload) => loginOrganization(payload),
    onSuccess(data) {
      setToken(data.token);
      setAuthToken(data.token);
      setUser(data.user);
      queryClient.setQueryData(["auth", "me"], data.user);
      router.push("/");
    },
  });
}
