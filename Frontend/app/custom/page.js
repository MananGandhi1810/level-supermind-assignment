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
    <div className="max-w-screen-xl z-10 mx-auto px-4 py-28 gap-12 text-gray-600 md:px-8">
      <div className="space-y-10 max-w-4xl leading-0  lg:leading-5 mx-auto text-center">
        <h2 className="text-4xl tracking-tighter  bg-clip-text bg-[linear-gradient(180deg,_#FFF_0%,_rgba(255,_255,_255,_0.00)_202.08%)] text-transparent   mx-auto md:text-7xl">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-orange-200">
            Enter Username
          </span>
        </h2>
        <p className="max-w-xl mx-auto text-muted-foreground">
          The way it works is, we have a generalized scraped data from instagram from which you can derive the insights you need. But you may need specialized for your use case. So, you can enter your username and we will scrape the data for you.
        </p>
        <h1 className="text-3xl font-semibold text-center text-blue-600 mb-4"></h1>
        <div className="flex flex-col items-center space-y-4">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
            className="w-1/3 p-3 text-white border border-gray-300/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-transparent"
          />
          <button
            onClick={handleScrape}
            disabled={loading || !username}
            className={` py-3 px-6 text-white rounded-xl ${
              loading
                ? "bg-gradient-to-tr from-zinc-300/5 via-purple-400/10 to-transparent text-muted-foreground border-input border-[1px] hover:bg-transparent/90 transition-colors "
                : "bg-gradient-to-tr from-zinc-300/5 via-purple-400/20 to-transparent    text-white border-input border-[1px] hover:bg-transparent/90 transition-colors"
            }`}
          >
            {loading ? "Scraping..." : "Start Scrape"}
          </button>
          {status && (
            <p
              className={`mt-4 text-lg font-medium ${
                status.includes("error") ? "text-red-500/50" : "text-green-500/50"
              }`}
            >
              {status}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
