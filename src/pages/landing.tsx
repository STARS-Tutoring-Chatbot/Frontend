import { Button } from "@/components/ui/button";
import Chip from "@/components/ui/chip";
import { Input } from "@/components/ui/input";
import React, { ChangeEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Landing() {
  const [searchClass, setSearchClass] = useState("");
  const [chips, setChips] = useState<Chip[]>([]);

  const navigate = useNavigate();

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchClass(event.target.value);
  };

  const handleGetStartedPress = () => {
    navigate("/login");
  };

  // Fetching data for chips. This will be replaced with a data fetch
  useEffect(() => {
    // TODO: replace with API call
    setChips([
      {
        title: "CAP 4104 - Human-Computer Interaction",
        data: "",
        isSelected: false,
      },
      {
        title: "CDA 3102 - Computer Design/Architecture",
        data: "",
        isSelected: false,
      },
      {
        title: "COP 3200 - Introduction to Programming",
        data: "Data 1",
        isSelected: false,
      },
      {
        title: "CAP 3456 - Advanced Programming Concepts",
        data: "Data 2",
        isSelected: false,
      },
      {
        title: "COP 3890 - Computer Organization and Assembly Language",
        data: "Data 3",
        isSelected: false,
      },
      {
        title: "CAP 4120 - User Interface Design",
        data: "Data 4",
        isSelected: false,
      },
      {
        title: "COP 4315 - Operating Systems",
        data: "Data 5",
        isSelected: false,
      },
      {
        title: "CAP 4983 - Senior Project in Computer Science",
        data: "Data 6",
        isSelected: false,
      },
      {
        title: "COP 4764 - Database Systems",
        data: "Data 7",
        isSelected: false,
      },
      {
        title: "CAP 4990 - Software Engineering",
        data: "Data 8",
        isSelected: false,
      },
    ]);
  }, []);

  // controlling UI for chips
  useEffect(() => {
    var isSelectedFlags = [];
    for (let index = 0; index < chips.length; index++) {
      const element = chips[index].title;
      if (element.toLowerCase().includes(searchClass.toLowerCase())) {
        isSelectedFlags.push(index);
      }
    }

    if (searchClass.length > 3) {
      isSelectedFlags.forEach((i) => {
        chips[i].isSelected = true;
      });
    } else {
      chips.forEach((chip) => {
        chip.isSelected = false;
      });
    }
  }, [searchClass]);

  return (
    <div className="w-screen py-48 bg-white flex-col justify-center items-center gap-16 inline-flex">
      <div className=" h-60 flex-col justify-start items-center gap-8 inline-flex">
        <div className="px-4 py-1 bg-gray-100 rounded-lg justify-start items-center gap-2.5 inline-flex">
          <div className="text-gray-500 text-xs font-medium  leading-tight">
            🎉
          </div>
          <div className="text-gray-500 text-xs font-medium  leading-tight">
            Version 1.0
          </div>
        </div>
        <div className="self-stretch h-28 flex-col justify-start items-center gap-4 flex">
          <div className="self-stretch text-center text-gray-800 text-6xl font-extrabold  leading-none">
            FIU STARS GPT
          </div>
          <div className="w-96 text-gray-500 text-sm font-normal  leading-normal">
            STAR’s in-house GPT trained with student’s data guaranteed to assist
            you based on Professor Wells’ requirements.
          </div>
          <div className="self-stretch justify-center items-start gap-4 inline-flex">
            <Button onClick={handleGetStartedPress}>Get Started!</Button>
          </div>
        </div>
      </div>

      <div className="flex-col justify-start items-center gap-4 inline-flex">
        <div className="self-stretch text-center text-slate-800 text-5xl font-extrabold leading-10">
          STARS Tutoring
        </div>
        <div className="text-center text-gray-500 text-base font-normal leading-normal">
          “Students in Technology, Academia, Research and Service”
        </div>
        <div className="w-96 text-gray-500 text-sm font-normal leading-normal">
          Need help in a class? STARS provides free peer tutoring in many of the
          required courses for Computer Science, Information Technology, and
          Computer Engineering. Check to see if your courses are offered!
        </div>
        <div className="w-96 h-10 justify-center items-start gap-4 inline-flex">
          <Button>STARS Tutoring Schedule</Button>
          <Button variant="outline">Register for Tutor Groups</Button>
        </div>

        <div className="w-96 text-center text-slate-800 text-2xl font-semibold  leading-loose">
          Classes We Offer
          <Input
            placeholder="Search for classes (comma separated for multiple)"
            className="font-normal text-slate-400"
            onChange={handleInputChange}
          />
        </div>

        <div className="w-1/2 justify-center items-start gap-2.5 inline-block text-center">
          {chips.map((chip, index) => (
            <Chip
              key={index}
              data={chip.data}
              title={chip.title}
              isSelected={chip.isSelected}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Landing;
