
import { NextResponse } from 'next/server';

const WHOP_API_KEY = process.env.WHOP_API_KEY;

async function fetchWhopUsers() {
  const res = await fetch('https://api.whop.com/api/v2/users', {
    headers: {
      Authorization: `Bearer ${WHOP_API_KEY}`,
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) throw new Error('Failed to fetch users');
  const data = await res.json();
  return data.data || [];
}

async function fetchWhopTransactions() {
  const res = await fetch('https://api.whop.com/api/v2/transactions', {
    headers: {
      Authorization: `Bearer ${WHOP_API_KEY}`,
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) throw new Error('Failed to fetch transactions');
  const data = await res.json();
  return data.data || [];
}

export async function GET() {
  const transactions = await fetchWhopTransactions();
  const users = await fetchWhopUsers();

  // Calculate 24hr leaderboard
  const now = Date.now();
  const last24h = now - 24 * 60 * 60 * 1000;
  const recentTxs = transactions.filter((tx: any) => new Date(tx.created_at).getTime() >= last24h);

  // Sum earnings per user
  const earningsMap: Record<string, number> = {};
  for (const tx of recentTxs) {
    if (!tx.user_id) continue;
    earningsMap[tx.user_id] = (earningsMap[tx.user_id] || 0) + Number(tx.amount);
  }

  // Build leaderboard
  const leaderboard = Object.entries(earningsMap)
    .map(([userId, amount]) => {
      const user = users.find((u: any) => u.id === userId);
      return { userId, name: user?.name || 'Unknown', amount };
    })
    .sort((a, b) => b.amount - a.amount);

  // Admins' 24hr earnings (assuming admins are flagged in user data)
  const admins = users.filter((u: any) => u.role === 'admin');
  const adminEarnings = admins.map((admin: any) => ({
    userId: admin.id,
    name: admin.name,
    amount: earningsMap[admin.id] || 0,
  }));

  // All-time transaction count
  const allTimeTxCount = transactions.length;

  // Payment sources breakdown
  const sourceMap: Record<string, number> = {};
  for (const tx of transactions) {
    const src = tx.source || 'unknown';
    sourceMap[src] = (sourceMap[src] || 0) + 1;
  }
  const sources = Object.entries(sourceMap).map(([source, count]) => ({ source, count }));

  return NextResponse.json({
    leaderboard,
    adminEarnings,
    allTimeTxCount,
    sources,
  });
}
