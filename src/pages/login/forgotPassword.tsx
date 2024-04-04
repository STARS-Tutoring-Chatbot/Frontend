import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/util/authprovider";
import { getSupabaseClient } from "@/util/supabase";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { forgotPasswordInitializer } from "@/util/zodtypes";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";

function ForgotPassword() {
  const [username, setUsername] = useState("");
  const [passwordReset, setPasswordReset] = useState("");
  const [confirmPasswordReset, setConfirmPasswordReset] = useState("");

  const supabase = getSupabaseClient();

  const navigate = useNavigate();

  const { toast } = useToast();

  const form = useForm<z.infer<typeof forgotPasswordInitializer>>({
    resolver: zodResolver(forgotPasswordInitializer),
    defaultValues: {
      email: "",
    },
    values: {
      email: username,
    },
  });

  const handlePasswordReset = async (
    values: z.infer<typeof forgotPasswordInitializer>
  ) => {
    await supabase?.auth
      .resetPasswordForEmail(values.email, {})
      .then((res) => {
        if (res.error) {
          console.log(res.error);
          form.setError("root", {
            message: res.error.message,
          });
          throw new Error(res.error.message);
        } else if (res.data) {
          toast({
            title: "✅ Success",
            description: `Your password has been send to ${values.email}.`,
          });
        }
      })
      .catch((e) => {
        toast({
          title: "❌ Error",
          description: e.message,
        });
      });
  };

  return (
    <div className="w-full h-screen flex justify-center">
      <div className="w-full md:w-1/2 h-full flex flex-col justify-center items-center">
        <Toaster />
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handlePasswordReset)}
            className="w-2/3"
          >
            <h1>Forgot Password?</h1>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="p-4" />
            <div className="flex space-x-2">
              <Button
                type="button"
                variant={"outline"}
                className="w-1/2"
                onClick={() => {
                  navigate("/login");
                }}
              >
                Back
              </Button>
              <Button type="submit" className="w-full">
                Send Link
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default ForgotPassword;
