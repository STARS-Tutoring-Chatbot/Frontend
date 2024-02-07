import React, { ChangeEventHandler, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Session } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/util/authprovider";
import { getSupabaseClient } from "@/util/supabase";

const supabase = getSupabaseClient();

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [session, setSession] = useState<Session | null | undefined>(null);
  const navigate = useNavigate();
  const auth = useAuth();

  const handleUsernameFieldChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setUsername(e.target.value);
  };

  const handlePasswordFieldChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPassword(e.target.value);
  };

  // this either redirects to the messaging page or throws an error state
  const handleLoginPress = async () => {
    const user = await supabase.auth.signInWithPassword({
      email: username,
      password: password,
    });
    console.log("USER");
    console.log(user);
    navigate("/chat");
  };

  // Pops up a modal to reset password
  const handleResetPasswordPress = () => {};

  // TBD
  const handleLoginSSOPress = () => {};

  // redirects to new route called create account
  const handleCreateAccountPress = () => {};

  // Do not use
  const handleLogOutPress = async () => {
    await supabase.auth.signOut();
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
    <div className="w-full h-screen flex">
      <div className="p-16 w-full md:w-1/2 h-full bg-gray-800 md:block hidden">
        <span className="text-white text-5xl font-extrabold leading-10 font-inter">
          FIU{" "}
        </span>
        <span className="text-white text-5xl font-light leading-10 font-inter">
          STARS GPT
        </span>
      </div>
      <div className="w-full md:w-1/2 h-full justify-center items-center">
        <div>
          <div className="w-96 text-gray-800 text-xl font-semibold ">
            Login with Email
          </div>
          <Input placeholder="Email" onChange={handleUsernameFieldChange} />
          <Input
            placeholder="Password"
            onChange={handlePasswordFieldChange}
            type="password"
          />
          <div>
            <Button onClick={handleLoginPress}>Log In</Button>
            <Button onClick={handleResetPasswordPress} variant="ghost">
              Reset Password
            </Button>
          </div>
        </div>

        <div>
          <Button onClick={handleLoginSSOPress}>Log In Through SSO</Button>
          <Button onClick={handleCreateAccountPress} variant="secondary">
            Create Account
          </Button>
          <Button onClick={handleLogOutPress} variant="destructive">
            Log Out. This should be taken out in production
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Login;
