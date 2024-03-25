import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { getSupabaseClient } from "@/util/supabase";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { register } from "@/util/zodtypes";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";

const supabase = getSupabaseClient();

const CreateAccount = () => {
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agree, setAgree] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (values: z.infer<typeof register>) => {
    console.log(values);

    await supabase?.auth
      .signUp({
        email: values.email,
        password: values.password,
      })
      .then((res) => {
        if (res.error) {
          console.log(res.error);
          form.setError("root", {
            message: res.error.message,
          });
          throw new Error(res.error.message);
        } else if (res.data) {
          navigate("/login");
        }
      })
      .catch((e) => {
        toast({
          title: "❌ Error",
          description: e.message,
        });
      });
  };

  const form = useForm<z.infer<typeof register>>({
    resolver: zodResolver(register),
    defaultValues: {
      email: "",
      confirmEmail: "",
      password: "",
      confirmPassword: "",
      confirmed: true,
    },
    values: {
      email: email,
      confirmEmail: confirmEmail,
      password: password,
      confirmPassword: confirmPassword,
      confirmed: agree,
    },
  });

  return (
    <div className="w-full h-screen flex">
      <div className="p-16 w-full md:w-1/2 h-full bg-gray-800 md:block hidden">
        <span className="text-white text-5xl font-extrabold leading-10 font-inter">
          FIU STARS GPT
        </span>
      </div>
      <div className="w-full md:w-1/2 h-full flex flex-col justify-center items-center">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="w-2/3">
            <h1>Create Account</h1>
            <div className="py-2" />
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
            <FormField
              control={form.control}
              name="confirmEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Confirm Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Password" {...field} type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Confirm Password"
                      {...field}
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="p-4" />
            <FormField
              name="confirmed"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Confirm that you agree to the terms and conditions.
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />
            <div className="p-4" />
            <div className="flex space-x-4">
              <Button
                onClick={() => {
                  navigate("/login");
                }}
                variant="outline"
                className="w-full"
                type="submit"
              >
                Back
              </Button>
              <Button type="submit" className="w-full">
                Submit
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreateAccount;
