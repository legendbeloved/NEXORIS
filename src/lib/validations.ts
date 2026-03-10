import { z } from "zod";

// Agent 1 Config Schema
export const agent1ConfigSchema = z.object({
    target_cities: z.array(z.string().trim().min(1)).min(1),
    categories: z.array(z.string().trim().min(1)).min(1),
    max_per_run: z.number().int().min(10).max(500),
    min_score: z.number().int().min(0).max(100),
    radius_km: z.number().int().min(1).max(100),
    frequency: z.enum(["6h", "12h", "24h", "manual"]),
    skip_has_website: z.boolean(),
    skip_has_social: z.boolean(),
    require_email: z.boolean(),
});

// Agent 2 Config Schema
export const agent2ConfigSchema = z.object({
    sender_name: z.string().trim().min(2).max(100),
    sender_email: z.string().trim().email(),
    reply_to: z.string().trim().email(),
    ab_ratio: z.number().min(0).max(1),
    send_hour_start: z.number().int().min(0).max(23),
    send_hour_end: z.number().int().min(0).max(23),
    max_daily_emails: z.number().int().min(1).max(200),
    followup_days: z.number().int().min(1).max(30),
    max_followups: z.number().int().min(0).max(10),
    tone: z.enum(["professional", "friendly", "bold"]),
    custom_instructions: z.string().trim().max(1000).optional(),
});

// Agent 3 Config Schema
export const agent3ConfigSchema = z.object({
    services: z.array(z.object({
        name: z.string().trim().min(2).max(100),
        min_price: z.number().min(0),
        max_price: z.number(),
        default_price: z.number(),
        max_discount_pct: z.number().int().min(0).max(50),
    })).min(1),
    max_rounds: z.number().int().min(1).max(20),
    approval_threshold: z.number().min(0),
}).refine(d => d.services.every(s => s.max_price > s.min_price), {
    message: "max_price must be greater than min_price",
}).refine(d => d.services.every(s => s.default_price >= s.min_price && s.default_price <= s.max_price), {
    message: "default_price must be between min_price and max_price",
});

// Payment Link Creation Params
export const createPaymentLinkSchema = z.object({
    prospect_id: z.string().uuid(),
    project_id: z.string().uuid().optional(),
    amount: z.number().min(1.00).max(999999.99),
    currency: z.enum(["USD", "GBP", "EUR", "NGN", "GHS"]),
    description: z.string().trim().min(5).max(500),
    notes: z.string().trim().max(1000).optional(),
});

// Client Portal Message schema
export const clientMessageSchema = z.object({
    message: z.string().trim().min(1).max(2000),
});

// Utility schemas for shared parameter validation
export const uuidParamSchema = z.string().uuid();
