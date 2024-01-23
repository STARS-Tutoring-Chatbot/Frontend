import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

function App() {
  const [count, setCount] = useState(0);
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <>
      <div>
        <h1>STARS AI Tutoring</h1>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde dolor et
          commodi labore ipsum obcaecati! Explicabo, deleniti quaerat nisi
          magnam quo eum adipisci officiis itaque earum, voluptas dolor
          praesentium eligendi?
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde dolor et
          commodi labore ipsum obcaecati! Explicabo, deleniti quaerat nisi
          magnam quo eum adipisci officiis itaque earum, voluptas dolor
          praesentium eligendi?
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde dolor et
          commodi labore ipsum obcaecati! Explicabo, deleniti quaerat nisi
          magnam quo eum adipisci officiis itaque earum, voluptas dolor
          praesentium eligendi?
        </p>
      </div>
    </>
  );
}

export default App;
