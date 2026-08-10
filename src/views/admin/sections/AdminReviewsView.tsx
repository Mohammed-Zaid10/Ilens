import React, { useState } from "react";
import { useAdmin } from "../../../context/AdminContext";
import { Star, CheckCircle, EyeOff, MessageSquare, ThumbsUp } from "lucide-react";

export const AdminReviewsView: React.FC = () => {
  const { reviews, updateReviewStatus, addReviewReply } = useAdmin();
  const [replyText, setReplyText] = useState<Record<string, string>>({});

  return (
    <div className="space-y-6">
      <div className="bg-neutral-900/90 border border-neutral-800 p-5 rounded-3xl space-y-1">
        <h2 className="text-lg font-black text-white flex items-center gap-2">
          <Star className="w-5 h-5 text-amber-400" /> Customer Product Reviews & Moderation
        </h2>
        <p className="text-xs text-neutral-400">Moderate customer feedback on virtual try-on, frame fit, and optical quality</p>
      </div>

      <div className="space-y-4">
        {reviews.map((rev) => (
          <div key={rev.id} className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < rev.rating ? "fill-amber-400" : "text-neutral-700"}`} />
                  ))}
                </div>
                <span className="font-extrabold text-white text-sm">{rev.title}</span>
              </div>

              <span
                className={`px-2.5 py-1 text-[10px] font-bold rounded-full border ${
                  rev.status === "Approved"
                    ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                    : "bg-amber-500/20 text-amber-400 border-amber-500/30"
                }`}
              >
                {rev.status}
              </span>
            </div>

            <p className="text-xs text-neutral-300">{rev.comment}</p>

            <div className="flex items-center justify-between text-[11px] text-neutral-400 font-mono">
              <span>By {rev.customerName} for <strong className="text-amber-400">{rev.productName}</strong></span>
              <span>{rev.date}</span>
            </div>

            {rev.reply && (
              <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-2xl text-xs space-y-1">
                <p className="font-bold text-amber-400 flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5" /> ILens Official Concierge Response:
                </p>
                <p className="text-neutral-300">{rev.reply}</p>
              </div>
            )}

            <div className="pt-2 border-t border-neutral-800 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                {rev.status !== "Approved" && (
                  <button
                    onClick={() => updateReviewStatus(rev.id, "Approved")}
                    className="px-3 py-1 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 text-xs font-bold rounded-lg"
                  >
                    Approve
                  </button>
                )}
                {rev.status !== "Hidden" && (
                  <button
                    onClick={() => updateReviewStatus(rev.id, "Hidden")}
                    className="px-3 py-1 bg-neutral-800 text-neutral-400 hover:text-white text-xs font-bold rounded-lg"
                  >
                    Hide
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={replyText[rev.id] || ""}
                  onChange={(e) => setReplyText({ ...replyText, [rev.id]: e.target.value })}
                  placeholder="Official reply..."
                  className="px-3 py-1 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-white"
                />
                <button
                  onClick={() => {
                    if (replyText[rev.id]) {
                      addReviewReply(rev.id, replyText[rev.id]);
                      setReplyText({ ...replyText, [rev.id]: "" });
                    }
                  }}
                  className="px-3 py-1 bg-amber-500 text-neutral-950 text-xs font-bold rounded-lg"
                >
                  Reply
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
