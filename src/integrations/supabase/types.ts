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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      assets: {
        Row: {
          created_at: string
          id: string
          name: string
          notes: string | null
          purchase_date: string
          purchase_value: number
          salvage_value: number
          useful_life_months: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          notes?: string | null
          purchase_date?: string
          purchase_value: number
          salvage_value?: number
          useful_life_months?: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          notes?: string | null
          purchase_date?: string
          purchase_value?: number
          salvage_value?: number
          useful_life_months?: number
          user_id?: string
        }
        Relationships: []
      }
      expenses: {
        Row: {
          amount: number
          category: Database["public"]["Enums"]["expense_category"]
          created_at: string
          description: string
          expense_date: string
          flock_id: string | null
          id: string
          quantity: number | null
          unit: string | null
          unit_price: number | null
          user_id: string
        }
        Insert: {
          amount: number
          category: Database["public"]["Enums"]["expense_category"]
          created_at?: string
          description: string
          expense_date?: string
          flock_id?: string | null
          id?: string
          quantity?: number | null
          unit?: string | null
          unit_price?: number | null
          user_id: string
        }
        Update: {
          amount?: number
          category?: Database["public"]["Enums"]["expense_category"]
          created_at?: string
          description?: string
          expense_date?: string
          flock_id?: string | null
          id?: string
          quantity?: number | null
          unit?: string | null
          unit_price?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "expenses_flock_id_fkey"
            columns: ["flock_id"]
            isOneToOne: false
            referencedRelation: "flocks"
            referencedColumns: ["id"]
          },
        ]
      }
      flocks: {
        Row: {
          code: string
          created_at: string
          current_count: number
          end_date: string | null
          id: string
          initial_count: number
          name: string
          notes: string | null
          start_date: string
          status: Database["public"]["Enums"]["flock_status"]
          type: Database["public"]["Enums"]["flock_type"]
          updated_at: string
          user_id: string
        }
        Insert: {
          code: string
          created_at?: string
          current_count?: number
          end_date?: string | null
          id?: string
          initial_count?: number
          name: string
          notes?: string | null
          start_date?: string
          status?: Database["public"]["Enums"]["flock_status"]
          type: Database["public"]["Enums"]["flock_type"]
          updated_at?: string
          user_id: string
        }
        Update: {
          code?: string
          created_at?: string
          current_count?: number
          end_date?: string | null
          id?: string
          initial_count?: number
          name?: string
          notes?: string | null
          start_date?: string
          status?: Database["public"]["Enums"]["flock_status"]
          type?: Database["public"]["Enums"]["flock_type"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      mortalities: {
        Row: {
          cause: string | null
          count: number
          created_at: string
          event_date: string
          flock_id: string
          id: string
          user_id: string
        }
        Insert: {
          cause?: string | null
          count: number
          created_at?: string
          event_date?: string
          flock_id: string
          id?: string
          user_id: string
        }
        Update: {
          cause?: string | null
          count?: number
          created_at?: string
          event_date?: string
          flock_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mortalities_flock_id_fkey"
            columns: ["flock_id"]
            isOneToOne: false
            referencedRelation: "flocks"
            referencedColumns: ["id"]
          },
        ]
      }
      productions: {
        Row: {
          created_at: string
          flock_id: string | null
          id: string
          notes: string | null
          production_date: string
          quantity: number
          type: Database["public"]["Enums"]["production_type"]
          unit: string
          user_id: string
        }
        Insert: {
          created_at?: string
          flock_id?: string | null
          id?: string
          notes?: string | null
          production_date?: string
          quantity: number
          type: Database["public"]["Enums"]["production_type"]
          unit?: string
          user_id: string
        }
        Update: {
          created_at?: string
          flock_id?: string | null
          id?: string
          notes?: string | null
          production_date?: string
          quantity?: number
          type?: Database["public"]["Enums"]["production_type"]
          unit?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "productions_flock_id_fkey"
            columns: ["flock_id"]
            isOneToOne: false
            referencedRelation: "flocks"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          farm_name: string | null
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          farm_name?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          farm_name?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      sales: {
        Row: {
          buyer: string | null
          created_at: string
          flock_id: string | null
          id: string
          notes: string | null
          quantity: number
          sale_date: string
          total: number
          type: Database["public"]["Enums"]["sale_type"]
          unit: string
          unit_price: number
          user_id: string
        }
        Insert: {
          buyer?: string | null
          created_at?: string
          flock_id?: string | null
          id?: string
          notes?: string | null
          quantity: number
          sale_date?: string
          total: number
          type: Database["public"]["Enums"]["sale_type"]
          unit: string
          unit_price: number
          user_id: string
        }
        Update: {
          buyer?: string | null
          created_at?: string
          flock_id?: string | null
          id?: string
          notes?: string | null
          quantity?: number
          sale_date?: string
          total?: number
          type?: Database["public"]["Enums"]["sale_type"]
          unit?: string
          unit_price?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sales_flock_id_fkey"
            columns: ["flock_id"]
            isOneToOne: false
            referencedRelation: "flocks"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      expense_category:
        | "pakan"
        | "obat"
        | "vitamin"
        | "alat"
        | "kandang"
        | "tenaga_kerja"
        | "modal_awal"
        | "listrik_air"
        | "transport"
        | "lain"
      flock_status: "aktif" | "selesai" | "dijual"
      flock_type: "indukan" | "pembesaran" | "doc" | "petelur"
      production_type: "telur" | "doc" | "daging"
      sale_type:
        | "telur"
        | "doc"
        | "indukan"
        | "ayam_afkir"
        | "daging"
        | "pupuk_kandang"
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
  public: {
    Enums: {
      expense_category: [
        "pakan",
        "obat",
        "vitamin",
        "alat",
        "kandang",
        "tenaga_kerja",
        "modal_awal",
        "listrik_air",
        "transport",
        "lain",
      ],
      flock_status: ["aktif", "selesai", "dijual"],
      flock_type: ["indukan", "pembesaran", "doc", "petelur"],
      production_type: ["telur", "doc", "daging"],
      sale_type: [
        "telur",
        "doc",
        "indukan",
        "ayam_afkir",
        "daging",
        "pupuk_kandang",
      ],
    },
  },
} as const
