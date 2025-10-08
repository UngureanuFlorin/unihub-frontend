import { useMutation } from "@tanstack/react-query";
import { registerRequest } from "../api/auth.api.js";

export function useAuthRegister() {
    return useMutation({ mutationFn: registerRequest });
}
