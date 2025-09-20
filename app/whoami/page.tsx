"use client";
import { useEffect, useState } from "react";

export default function WhoAmI() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/_debug/auth-status")
      .then((res) => res.json())
      .then(setData);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Who Am I</h1>
      <pre className="bg-gray-100 p-4 rounded mt-4">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}
