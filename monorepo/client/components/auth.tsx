"use client"
import { FieldGroup, Fieldset, Legend, Field, Label, Description } from "@/client/components/fieldset"
import { Input } from "@/components/input"
import { Text } from "@/components/text"
import { Button } from "@/components/button"
import { SwitchField, Switch } from "@/components/switch"
import { useState } from "react"

export function Auth() {
  const [isCreateAccount, setIsCreateAccount] = useState(false)

  return (
    <Fieldset className="max-w-xl m-4 mx-auto">
      <Legend>Make a New Connection</Legend>
      <Text>Connect to a new server with a new account or existing account</Text>
      <FieldGroup>
        <Field>
          <Label>Server Address</Label>
          <Input type="text" placeholder="chat.somewhere.com" />
        </Field>
        <Field>
          <Label>Username</Label>
          <Input type="text" placeholder="someone" />
        </Field>
        <Field>
          <Label>Password</Label>
          <Input type="password" />
        </Field>
      </FieldGroup>
      <FieldGroup>
        <SwitchField>
          <Label>Create New Account</Label>
          <Description>Create a new account on the server using a given joincode</Description>
          <Switch checked={isCreateAccount} onChange={setIsCreateAccount} name="create_account" />
        </SwitchField>
      </FieldGroup>
      <FieldGroup className={`${isCreateAccount ? "" : "hidden"}`}>
        <Field>
          <Label>Join Code</Label>
          <Input type="text" placeholder="123456" />
        </Field>
      </FieldGroup>
      <Button className="m-8 mx-auto w-full">Submit</Button>
    </Fieldset>
  )
}
