"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [username, setUsername] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const savedUsername = sessionStorage.getItem("username");
    if (savedUsername) {
      setUsername(savedUsername);
    }
  }, []);

  const handleScrape = async () => {
    setLoading(true);
    setStatus("Starting scrape...");

    const scrapeResponse = await fetch("/api/scrape", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    });

    if (!scrapeResponse.ok) {
      setStatus("Error starting scrape");
      setLoading(false);
      return;
    }

    const intervalId = setInterval(async () => {
      const statusResponse = await fetch("/api/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });

      const { success, data } = await statusResponse.json();

      setStatus(data.status);
      console.log(data);

      if (success) {
        clearInterval(intervalId);
        setLoading(false);
        sessionStorage.setItem("username", username);
        router.push("/insights");
      }
    }, 30000);
  };

  return (
    <div className=" flex flex-col mt-4 justify-center items-center">
      <h1 className="text-3xl font-semibold text-center text-blue-600 mb-4">
        Enter Username
      </h1>
      <div className="flex flex-col items-center space-y-4">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter username"
          className="w-2/3 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent"
        />
        <button
          onClick={handleScrape}
          disabled={loading || !username}
          className={` py-3 px-6 text-white rounded-xl ${
            loading
              ? "bg-gray-400"
              : "bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
          }`}
        >
          {loading ? "Scraping..." : "Start Scrape"}
        </button>
        {status && (
          <p
            className={`mt-4 text-lg font-medium ${
              status.includes("error") ? "text-red-500" : "text-green-500"
            }`}
          >
            {status}
          </p>
        )}
      </div>
    </div>
  );
}
