import { Button, Input } from "@nextui-org/react";
import { useMutation } from "@tanstack/react-query";
import { useSearchParams } from 'react-router-dom';
import { pb } from "../pb";
import React from "react";

export function SignInPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const emailInputRef = React.useRef<HTMLInputElement>(null)
  const passwordInputRef = React.useRef<HTMLInputElement>(null)

  const signInMutation = useMutation({
    mutationKey: ['signin'],
    mutationFn: async (variables: {
      email: string, password: string
    }) => {
      return await pb.admins.authWithPassword(variables.email, variables.password)
    },
    onSuccess(result) {
      location.href = searchParams.get("redirect") || "/"
    },
  })

  return (
    <div className="flex flex-col gap-3 w-[512px] mx-auto mt-24">
      <div>
        <h2 className="font-black">Sign In to Dropic</h2>
      </div>
      <div>
        <form onSubmit={e => {
          e.preventDefault()
          if (!emailInputRef.current || !passwordInputRef.current) {
            return
          }
          signInMutation.mutate({
            email: emailInputRef.current.value,
            password: passwordInputRef.current.value,
          })
        }}>
          <div className="flex flex-col gap-3">
            <div>
              <Input ref={emailInputRef} name="email" label="Email" type="email" />
            </div>
            <div>
              <Input ref={passwordInputRef} name="password" type="password" label="Password" placeholder="" />
            </div>
            <div>
              <Button isLoading={signInMutation.isPending} type="submit" color="primary">Sign In</Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}