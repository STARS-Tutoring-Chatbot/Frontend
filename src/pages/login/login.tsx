import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLoginPress = () => {};
  const handleResetPasswordPress = () => {};
  const handleLoginSSOPress = () => {};
  const handleCreateAccountPress = () => {};

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
          <Input placeholder="Email" />
          <Input placeholder="Password" type="password" />
          <div>
            <Button>Log In</Button>
            <Button variant="ghost">Reset Password</Button>
          </div>
        </div>

        <div>
          <Button>Log In Through SSO</Button>
          <Button variant="secondary">Create Account</Button>
        </div>
      </div>
    </div>
  );
}

export default Login;
