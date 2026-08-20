import "@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "@supabase/server";

type CampaignRequest = { campaignId?: string; note?: string; withdraw?: boolean; attachmentIds?: string[] };
const failure = (code: string, message: string, status = 400) => Response.json({ error: { code, message } }, { status });

export default {
  fetch: withSupabase({ auth: "user" }, async (req, ctx) => {
    const body = (await req.json()) as CampaignRequest;
    if (!body.campaignId?.trim()) {
      return failure("invalid_campaign", "A campaign id is required.");
    }
    const { data: campaign } = await ctx.supabase.from("catalogue_campaigns").select("id").eq("id", body.campaignId).eq("published", true).maybeSingle();
    if (!campaign) return failure("campaign_unavailable", "This campaign is no longer accepting applications.", 409);
    if (body.withdraw) {
      const { error } = await ctx.supabase.from("campaign_applications").update({ status: "withdrawn", updated_at: new Date().toISOString() }).eq("campaign_id", body.campaignId);
      if (error) return failure("withdraw_failed", error.message);
      const { data: attachments } = await ctx.supabase.from("campaign_attachments").select("storage_path").eq("campaign_id", body.campaignId);
      if (attachments?.length) await ctx.supabase.storage.from("campaign-media").remove(attachments.map(item => item.storage_path));
      await ctx.supabase.from("campaign_attachments").delete().eq("campaign_id", body.campaignId);
      return Response.json({ data: { status: "withdrawn" } });
    }
    const attachmentIds = [...new Set(body.attachmentIds ?? [])];
    if (attachmentIds.length > 5) return failure("too_many_attachments", "A campaign application can include up to five attachments.", 422);
    if (attachmentIds.length) {
      const { data: attachments, error: attachmentError } = await ctx.supabase.from("campaign_attachments").select("id,campaign_id,status").in("id", attachmentIds);
      if (attachmentError || attachments?.length !== attachmentIds.length || attachments.some(item => item.campaign_id !== body.campaignId || item.status !== "pending")) {
        return failure("invalid_attachments", "One or more attachments do not belong to this application.", 422);
      }
    }
    const { error } = await ctx.supabase.from("campaign_applications").upsert({
      user_id: ctx.userClaims!.id,
      campaign_id: body.campaignId,
      status: "submitted",
      note: body.note?.trim() || null,
    }, { onConflict: "user_id,campaign_id" });
    if (error) return failure("submission_failed", error.message);
    if (attachmentIds.length) await ctx.supabase.from("campaign_attachments").update({ status: "submitted" }).in("id", attachmentIds);
    return Response.json({ data: { status: "submitted", attachmentIds } });
  }),
};
