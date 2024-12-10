import { useState } from "react";

export function TestComp() {
  const [v, setV] = useState("aaa");
  return <div>AAAAA {v}</div>;
}
