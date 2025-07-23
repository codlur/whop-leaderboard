import React from "react";

async function getLeaderboardData() {
  const res = await fetch("/api/leaderboard");
  if (!res.ok) throw new Error("Failed to fetch leaderboard data");
  return res.json();
}

export default async function LeaderboardPage() {
  const data = await getLeaderboardData();

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">24hr Leaderboard</h1>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Top Earners (24hr)</h2>
        <ul className="bg-white rounded shadow divide-y">
          {data.leaderboard.map((entry: any) => (
            <li key={entry.userId} className="p-4 flex justify-between">
              <span>{entry.name}</span>
              <span className="font-mono">${entry.amount.toFixed(2)}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Admins' 24hr Earnings</h2>
        <ul className="bg-white rounded shadow divide-y">
          {data.adminEarnings.map((admin: any) => (
            <li key={admin.userId} className="p-4 flex justify-between">
              <span>{admin.name}</span>
              <span className="font-mono">${admin.amount.toFixed(2)}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">All-Time Transaction Count</h2>
        <div className="bg-white rounded shadow p-4 text-2xl font-mono">
          {data.allTimeTxCount}
        </div>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-2">Payment Sources</h2>
        <ul className="bg-white rounded shadow divide-y">
          {data.sources.map((src: any) => (
            <li key={src.source} className="p-4 flex justify-between">
              <span>{src.source}</span>
              <span className="font-mono">{src.count}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
