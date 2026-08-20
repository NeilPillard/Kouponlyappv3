export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.15"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      accepted_gifts: {
        Row: {
          accepted_at: string
          gift_id: string
          user_id: string
        }
        Insert: {
          accepted_at?: string
          gift_id: string
          user_id: string
        }
        Update: {
          accepted_at?: string
          gift_id?: string
          user_id?: string
        }
        Relationships: []
      }
      campaign_applications: {
        Row: {
          campaign_id: string
          created_at: string
          note: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          campaign_id: string
          created_at?: string
          note?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          campaign_id?: string
          created_at?: string
          note?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      campaign_attachments: {
        Row: {
          byte_size: number
          campaign_id: string
          created_at: string
          id: string
          media_type: string
          mime_type: string
          status: string
          storage_path: string
          user_id: string
        }
        Insert: {
          byte_size: number
          campaign_id: string
          created_at?: string
          id?: string
          media_type: string
          mime_type: string
          status?: string
          storage_path: string
          user_id: string
        }
        Update: {
          byte_size?: number
          campaign_id?: string
          created_at?: string
          id?: string
          media_type?: string
          mime_type?: string
          status?: string
          storage_path?: string
          user_id?: string
        }
        Relationships: []
      }
      catalogue_campaigns: {
        Row: {
          id: string
          payload: Json
          published: boolean
          sort_order: number
          updated_at: string
        }
        Insert: {
          id: string
          payload: Json
          published?: boolean
          sort_order?: number
          updated_at?: string
        }
        Update: {
          id?: string
          payload?: Json
          published?: boolean
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      catalogue_categories: {
        Row: {
          id: string
          payload: Json
          published: boolean
          sort_order: number
          updated_at: string
        }
        Insert: {
          id: string
          payload: Json
          published?: boolean
          sort_order?: number
          updated_at?: string
        }
        Update: {
          id?: string
          payload?: Json
          published?: boolean
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      catalogue_deals: {
        Row: {
          id: string
          payload: Json
          published: boolean
          sort_order: number
          updated_at: string
        }
        Insert: {
          id: string
          payload: Json
          published?: boolean
          sort_order?: number
          updated_at?: string
        }
        Update: {
          id?: string
          payload?: Json
          published?: boolean
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      catalogue_hero_slides: {
        Row: {
          id: string
          payload: Json
          published: boolean
          sort_order: number
          updated_at: string
        }
        Insert: {
          id: string
          payload: Json
          published?: boolean
          sort_order?: number
          updated_at?: string
        }
        Update: {
          id?: string
          payload?: Json
          published?: boolean
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      catalogue_offers: {
        Row: {
          id: string
          payload: Json
          published: boolean
          sort_order: number
          updated_at: string
        }
        Insert: {
          id: string
          payload: Json
          published?: boolean
          sort_order?: number
          updated_at?: string
        }
        Update: {
          id?: string
          payload?: Json
          published?: boolean
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      catalogue_partners: {
        Row: {
          id: string
          payload: Json
          published: boolean
          sort_order: number
          updated_at: string
        }
        Insert: {
          id: string
          payload: Json
          published?: boolean
          sort_order?: number
          updated_at?: string
        }
        Update: {
          id?: string
          payload?: Json
          published?: boolean
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      catalogue_rewards: {
        Row: {
          id: string
          payload: Json
          published: boolean
          sort_order: number
          updated_at: string
        }
        Insert: {
          id: string
          payload: Json
          published?: boolean
          sort_order?: number
          updated_at?: string
        }
        Update: {
          id?: string
          payload?: Json
          published?: boolean
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      feedback: {
        Row: {
          created_at: string
          id: number
          message: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          message: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          message?: string
          user_id?: string | null
        }
        Relationships: []
      }
      mutation_receipts: {
        Row: {
          created_at: string
          mutation_id: string
          operation: string
          result: Json
          user_id: string
        }
        Insert: {
          created_at?: string
          mutation_id: string
          operation: string
          result?: Json
          user_id: string
        }
        Update: {
          created_at?: string
          mutation_id?: string
          operation?: string
          result?: Json
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          body: string
          created_at: string
          data: Json
          id: string
          kind: string
          read_at: string | null
          title: string
          user_id: string
        }
        Insert: {
          body: string
          created_at?: string
          data?: Json
          id?: string
          kind: string
          read_at?: string | null
          title: string
          user_id: string
        }
        Update: {
          body?: string
          created_at?: string
          data?: Json
          id?: string
          kind?: string
          read_at?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      offer_usage: {
        Row: {
          offer_id: string
          updated_at: string
          use_count: number
          user_id: string
        }
        Insert: {
          offer_id: string
          updated_at?: string
          use_count?: number
          user_id: string
        }
        Update: {
          offer_id?: string
          updated_at?: string
          use_count?: number
          user_id?: string
        }
        Relationships: []
      }
      partner_redemption_pins: {
        Row: {
          enabled: boolean
          partner_id: string
          pin_hash: string
          updated_at: string
        }
        Insert: {
          enabled?: boolean
          partner_id: string
          pin_hash: string
          updated_at?: string
        }
        Update: {
          enabled?: boolean
          partner_id?: string
          pin_hash?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_path: string | null
          city: string
          created_at: string
          email: string
          full_name: string
          mobile: string
          points: number
          revision: number
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_path?: string | null
          city?: string
          created_at?: string
          email?: string
          full_name?: string
          mobile?: string
          points?: number
          revision?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_path?: string | null
          city?: string
          created_at?: string
          email?: string
          full_name?: string
          mobile?: string
          points?: number
          revision?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      redeemed_rewards: {
        Row: {
          redeemed_at: string
          reward_id: string
          user_id: string
        }
        Insert: {
          redeemed_at?: string
          reward_id: string
          user_id: string
        }
        Update: {
          redeemed_at?: string
          reward_id?: string
          user_id?: string
        }
        Relationships: []
      }
      redemptions: {
        Row: {
          code: string | null
          completed_at: string | null
          consumed_at: string | null
          expires_at: string | null
          mode: string
          redemption_id: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          code?: string | null
          completed_at?: string | null
          consumed_at?: string | null
          expires_at?: string | null
          mode: string
          redemption_id: string
          status: string
          updated_at?: string
          user_id: string
        }
        Update: {
          code?: string | null
          completed_at?: string | null
          consumed_at?: string | null
          expires_at?: string | null
          mode?: string
          redemption_id?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      saved_deals: {
        Row: {
          created_at: string
          deal_id: number
          user_id: string
        }
        Insert: {
          created_at?: string
          deal_id: number
          user_id: string
        }
        Update: {
          created_at?: string
          deal_id?: number
          user_id?: string
        }
        Relationships: []
      }
      saved_offers: {
        Row: {
          created_at: string
          offer_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          offer_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          offer_id?: string
          user_id?: string
        }
        Relationships: []
      }
      sent_gifts: {
        Row: {
          id: number
          offer: string
          recipient: string
          sent_at: string
          user_id: string | null
        }
        Insert: {
          id?: number
          offer: string
          recipient: string
          sent_at?: string
          user_id?: string | null
        }
        Update: {
          id?: number
          offer?: string
          recipient?: string
          sent_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      used_deals: {
        Row: {
          deal_id: number
          used_at: string
          user_id: string
        }
        Insert: {
          deal_id: number
          used_at?: string
          user_id: string
        }
        Update: {
          deal_id?: number
          used_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_interests: {
        Row: {
          created_at: string
          interest_id: string
          note: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          interest_id: string
          note?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          interest_id?: string
          note?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          creator_updates: boolean
          language: string
          location: string
          offer_alerts: boolean
          revision: number
          updated_at: string
          user_id: string
        }
        Insert: {
          creator_updates?: boolean
          language?: string
          location?: string
          offer_alerts?: boolean
          revision?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          creator_updates?: boolean
          language?: string
          location?: string
          offer_alerts?: boolean
          revision?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      redeem_reward_atomic: {
        Args: { p_idempotency_key: string; p_reward_id: string }
        Returns: Json
      }
      validate_redemption_atomic: {
        Args: {
          p_idempotency_key: string
          p_mode: string
          p_pin: string
          p_redemption_id: string
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const

