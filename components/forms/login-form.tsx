"use client";

import { useActionState } from "react";
import { loginAction, type ActionState } from "@/lib/actions";
import { Button, Card, CardContent, CardHeader, CardTitle, Field, Input } from "@/components/ui";

const initialState: ActionState = {};

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, initialState);

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={action} className="space-y-4">
          <Field label="Email" error={state.errors?.email?.[0]}>
            <Input name="email" defaultValue="admin@dealer.com" />
          </Field>
          <Field label="Password" error={state.errors?.password?.[0]}>
            <Input type="password" name="password" defaultValue="password" />
          </Field>
          {state.message ? <div className="text-sm text-rose-600">{state.message}</div> : null}
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Signing in..." : "Continue"}
          </Button>
          <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
            <div>Administrator: admin@dealer.com / password</div>
            <div>Sales Executive: sales@dealer.com / password</div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
