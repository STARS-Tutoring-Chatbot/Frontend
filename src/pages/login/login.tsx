import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/util/authprovider";
import { getSupabaseClient } from "@/util/supabase";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { login } from "@/util/zodtypes";
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

const supabase = getSupabaseClient();

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const auth = useAuth();
  const { toast } = useToast();

  // this either redirects to the messaging page or throws an error state
  const handleLoginPress = async () => {
    const user = await supabase?.auth.signInWithPassword({
      email: username,
      password: password,
    });
    navigate("/chat");
  };

  const form = useForm<z.infer<typeof login>>({
    resolver: zodResolver(login),
    defaultValues: {
      email: "",
      password: "",
    },
    values: {
      email: username,
      password: password,
    },
  });

  // redirects to new route called create account
  const handleCreateAccountPress = () => {
    navigate("/create");
  };

  const handleSubmit = async (values: z.infer<typeof login>) => {
    await supabase?.auth
      .signInWithPassword({
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
          navigate("/chat");
        }
      })
      .catch((e) => {
        toast({
          title: "❌ Error",
          description: e.message,
        });
      });
  };

  useEffect(() => {
    const checkSession = async () => {
      if (auth.session) {
        navigate("/chat");
      }
    };
    checkSession();
  }, []);

  // TODO: continue working on layout and fix the button layouts.
  return (
    <div className="w-full h-screen flex justify-center">
      <div className="w-full md:w-1/2 h-full flex flex-col justify-center items-center">
        <Toaster />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="w-2/3">
            <h1>Login</h1>
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
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Password" type="password" {...field} />
                  </FormControl>
                  <div className="w-full flex justify-end">
                    <Button
                      variant={"link"}
                      type="button"
                      className="p-0"
                      onClick={() => {
                        navigate("/forgot");
                      }}
                    >
                      Forgot Password?
                    </Button>
                  </div>

                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="p-4" />

            <div className="flex space-x-4">
              <Button type="submit" className="w-full">
                Login
              </Button>
              <Button
                onClick={() => {
                  handleCreateAccountPress();
                }}
                className="w-full"
                variant="outline"
              >
                Sign Up
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default Login;
