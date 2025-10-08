import { useMutation } from "@tanstack/react-query";
import { loginRequest } from "../api/auth.api.js";

export function useAuthLogin() {
    return useMutation({ mutationFn: loginRequest });
}
