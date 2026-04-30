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
      const { accessToken, ...userData } = data;
      // Construct user object from flattened fields
      const user = {
        id: userData.id!,
        name: userData.name!,
        email: userData.email!,
        role: userData.role,
      };

      setToken(accessToken);
      setAuthToken(accessToken);
      setUser(user);
      queryClient.setQueryData(["auth", "me"], user);
      router.push("/");
    },
  });
}
