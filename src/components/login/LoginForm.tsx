"use client";
import { login } from "@/actions/auth";
import { Input, Field, Button } from "@chakra-ui/react";
import { useActionState } from "react";

export default function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined);

  console.log("💗💗💗 state", state);

  return (
    <form action={action}>
      <Field.Root invalid={!!state?.errors?.email}>
        <Field.Label>Email</Field.Label>
        <Input name="email" placeholder="Enter your email" />
        {state?.errors?.email && (
          <Field.ErrorText>{state.errors.email}</Field.ErrorText>
        )}
      </Field.Root>
      <Field.Root invalid={!!state?.errors?.password}>
        <Field.Label>Password</Field.Label>
        <Input name="password" placeholder="Enter your password" />
        {state?.errors?.password && (
          <Field.ErrorText>
            {state.errors.password.map((error) => (
              <div key={error}>- {error}</div>
            ))}
          </Field.ErrorText>
        )}
      </Field.Root>

      <Button disabled={pending} type="submit">
        Login
      </Button>
    </form>
  );
}
