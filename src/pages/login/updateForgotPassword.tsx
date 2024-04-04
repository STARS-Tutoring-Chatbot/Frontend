import { forgotPasswordUpdate } from "@/util/zodtypes";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { getSupabaseClient } from "@/util/supabase";

import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Toaster } from "@/components/ui/toaster";
import { Input } from "@/components/ui/input";

function UpdateForgotPassword() {
  const [passwordReset, setPasswordReset] = useState("");
  const [confirmPasswordReset, setConfirmPasswordReset] = useState("");

  const supabase = getSupabaseClient();

  const form = useForm<z.infer<typeof forgotPasswordUpdate>>({
    resolver: zodResolver(forgotPasswordUpdate),
    defaultValues: {
      confirmPasswordReset: "",
      passwordReset: "",
    },
    values: {
      confirmPasswordReset: confirmPasswordReset,
      passwordReset: passwordReset,
    },
  });

  const handleOnSubmit = async (data: z.infer<typeof forgotPasswordUpdate>) => {
    await supabase?.auth.updateUser({
      password: data.passwordReset,
    });
  };

  return (
    <div className="w-full h-screen flex justify-center">
      <div className="w-full md:w-1/2 h-full flex flex-col justify-center items-center">
        <Toaster />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleOnSubmit)} className="w-2/3">
            <h1>Reset Your Password</h1>
            <FormField
              control={form.control}
              name="passwordReset"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="New Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPasswordReset"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Confirm New Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="p-4"></div>
            <Button type="submit" className="w-full">
              Confirm Password Reset
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default UpdateForgotPassword;
