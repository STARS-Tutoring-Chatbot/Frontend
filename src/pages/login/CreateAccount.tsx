import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { getSupabaseClient } from "@/util/supabase";

const supabase = getSupabaseClient();

const CreateAccount = () => {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agree, setAgree] = useState(false);
  const navigate = useNavigate();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);
  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value);
  const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => setLastName(e.target.value);
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);
  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value);
  const handleAgreeChange = (e: React.ChangeEvent<HTMLInputElement>) => setAgree(e.target.checked);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      // Handle password mismatch
      console.error('Passwords do not match');
      return;
    }
    if (agree) {
      // Create account logic
      try {
        const { user, error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        console.log('User created:', user);
        navigate('/login'); // Redirect to login page after account creation
      } catch (error) {
        console.error('Error creating user:', error);
      }
    } else {
      // Handle disagreement
      console.error('You must agree to the terms and conditions');
    }
  };

  return (
    <div className="w-full h-screen flex">
      <div className="p-16 w-full md:w-1/2 h-full bg-gray-800 md:block hidden">
        <span className="text-white text-5xl font-extrabold leading-10 font-inter">
          FIU STARS GPT
        </span>
      </div>
      <div className="w-full md:w-1/2 h-full flex flex-col justify-center items-center">
        <form className="w-96" onSubmit={handleSubmit}>
          <Input placeholder="Email" value={email} onChange={handleEmailChange} />
          <Input placeholder="First Name" value={firstName} onChange={handleFirstNameChange} />
          <Input placeholder="Last Name" value={lastName} onChange={handleLastNameChange} />
          <Input placeholder="Password" type="password" value={password} onChange={handlePasswordChange} />
          <Input placeholder="Confirm Password" type="password" value={confirmPassword} onChange={handleConfirmPasswordChange} />
          <div className="flex items-center">
            <input type="checkbox" checked={agree} onChange={handleAgreeChange} />
            <span className="ml-2">Confirm Account Creation</span>
          </div>
          <Button type="submit">Create Account</Button>
        </form>
      </div>
    </div>
  );
};

export default CreateAccount;
