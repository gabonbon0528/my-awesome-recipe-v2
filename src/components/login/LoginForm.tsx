"use client";
import { FormState, login } from "@/actions/auth";
import { signOut } from "@/auth";
import { Input, Field, Button, VStack } from "@chakra-ui/react";
import { useActionState } from "react";

export default function LoginForm() {
  const [state, action, pending] = useActionState(login, {
    errors: {},
  });

  return (
    <form action={action}>
      <VStack gap={4}>
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
              {Array.isArray(state.errors.password)
                ? state.errors.password.map((error) => (
                    <div key={error}>- {error}</div>
                  ))
                : state.errors.password}
            </Field.ErrorText>
          )}
        </Field.Root>
        {state?.errors?.message && <p>{state.errors.message}</p>}

        <Button disabled={pending} type="submit">
          Login
        </Button>
      </VStack>
    </form>
  );
}
