import { Button } from "@/components/ui/button";
import { Chip, ChipObject } from "@/components/ui/chip";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/util/authprovider";
import { Tables, getSupabaseClient } from "@/util/supabase";
import React, { ChangeEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useQuery } from "@tanstack/react-query";
import { ModeToggle } from "@/components/ui/darkmodeToggle";

const supabase = getSupabaseClient();

function Landing() {
  const [searchClass, setSearchClass] = useState("");
  const [chips, setChips] = useState<Tables<"chips">[]>([]);
  const auth = useAuth();

  const navigate = useNavigate();

  const { data, error } = useQuery({
    queryKey: ["chips"],
    queryFn: async () => {
      const res = await supabase?.from("chips").select("*");
      if (res?.error) {
        throw res.error;
      }
      console.log(res?.data);
      return res?.data;
    },
  });

  // Fetching data for chips. This will be replaced with a data fetch
  useEffect(() => {
    setChips(data ?? []);
  }, [data, error]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchClass(event.target.value);
  };

  const handleGetStartedPress = () => {
    if (auth.user) {
      navigate("/login");
    } else {
      navigate("/chat");
    }
  };

  return (
    <div className="flex flex-col w-full h-screen items-center">
      <div className="flex w-full top-0 pt-4 px-4 justify-between">
        <div></div>
        <ModeToggle variant="outline"></ModeToggle>
      </div>
      <div className="md:w-1/3 pt-20 px-4 md:pt-48 md:px-0 space-y-10">
        <div className="flex flex-col items-center space-y-2">
          <h1 className="text-5xl md:text-6xl font-extrabold py-2 text-center">
            FIU STARS GPT
          </h1>
          <p className="text-center">
            STARS' in-house GPT trained with student’s data designed to maximixe
            your learning experience by providing you with an LLM trained
            specifically for your Computer Science coursework
          </p>
          <Button onClick={handleGetStartedPress}>Get Started!</Button>
        </div>

        <div className="flex flex-col space-y-2">
          <Button
            className="text-3xl font-extrabold leading-10 py-2 text-center"
            variant={"link"}
          >
            STARS Tutoring
          </Button>

          <p className="text-center">
            “Students in Technology, Academia, Research and Service”
          </p>
          <p className="text-center">
            Need help in a class? STARS provides free peer tutoring in many of
            the required courses for Computer Science, Information Technology,
            and Computer Engineering. Check to see if your courses are offered!
          </p>
          <div className="flex flex-row space-x-4">
            <Button
              className="w-full"
              onClick={() => {
                // goto link outside of the app
                window.open(
                  "https://stars.cs.fiu.edu/wp-content/uploads/sites/29/2024/02/STARS-Tutor-Schedule-Spring-2024_0228.pdf"
                );
              }}
            >
              STARS Tutoring Schedule
            </Button>
            <Button
              className="w-full"
              variant="outline"
              onClick={() => {
                window.open(
                  "https://forms.office.com/pages/responsepage.aspx?id=qOV5rOTgS0OikiyJtcKDZsczU_SpiDNMnHfU_M_aFfFUNElHQldaSEkzTzdCSFBQVFAyRDZFMEJKSC4u"
                );
              }}
            >
              Register for Tutor Groups
            </Button>
          </div>

          {/* <div className="w-96 text-center  text-2xl font-semibold  leading-loose">
          Classes We Offer
          <Input
            placeholder="Search for classes (comma separated for multiple)"
            className="font-normal "
            onChange={handleInputChange}
          />
        </div>

        <div className="w-1/2 justify-center items-start gap-2.5 inline-block text-center">
          {chips.map((chip, index) => (
            <Chip
              key={index}
              data={chip.course_id ?? ""}
              title={chip.course_name ?? ""}
              isSelected={false}
            />
          ))}
        </div> */}
        </div>
      </div>
    </div>
  );
}

export default Landing;
