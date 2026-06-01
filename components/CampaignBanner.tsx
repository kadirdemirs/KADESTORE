"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { X, Sparkles, ArrowUpRight } from "lucide-react";

interface Campaign {
  id: string;
  title: string;
  description: string;
  bannerColor: string;
  textColor: string;
  ctaLabel: string;
  ctaUrl: string;
}

const DISMISSED_KEY_PREFIX = "kadestore.campaignDismissed:";

export default function CampaignBanner() {
  const [campaign, setCampaign] = useState<Campaign | null>(null);

  useEffect(() => {
    fetch("/api/campaigns/active")
      .then((r) => r.json())
      .then((d) => {
        if (d.campaign) {
          const dismissed = localStorage.getItem(DISMISSED_KEY_PREFIX + d.campaign.id);
          if (!dismissed) setCampaign(d.campaign);
        }
      })
      .catch(() => {});
  }, []);

  if (!campaign) return null;

  function dismiss() {
    localStorage.setItem(DISMISSED_KEY_PREFIX + campaign!.id, "1");
    setCampaign(null);
  }

  return (
    <div
      style={{ background: campaign.bannerColor, color: campaign.textColor }}
      className="relative px-4 py-2.5 text-sm font-medium flex items-center justify-center gap-3 flex-wrap"
    >
      <Sparkles size={14} />
      <span><strong>{campaign.title}</strong> · {campaign.description}</span>
      <Link
        href={campaign.ctaUrl}
        className="inline-flex items-center gap-1 underline font-bold whitespace-nowrap"
      >
        {campaign.ctaLabel} <ArrowUpRight size={12} />
      </Link>
      <button
        onClick={dismiss}
        aria-label="Banner'ı kapat"
        className="ml-2 opacity-60 hover:opacity-100 transition"
      >
        <X size={14} />
      </button>
    </div>
  );
}
