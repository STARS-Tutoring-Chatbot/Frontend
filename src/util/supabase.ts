import { createClient } from "@supabase/supabase-js";

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      chips: {
        Row: {
          course_id: string | null;
          course_name: string | null;
          created_at: string;
          uid: number;
        };
        Insert: {
          course_id?: string | null;
          course_name?: string | null;
          created_at?: string;
          uid?: number;
        };
        Update: {
          course_id?: string | null;
          course_name?: string | null;
          created_at?: string;
          uid?: number;
        };
        Relationships: [];
      };
      conversations: {
        Row: {
          created_at: string;
          description: string | null;
          id: string;
          owner_id: string;
          title: string | null;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          id?: string;
          owner_id: string;
          title?: string | null;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          id?: string;
          owner_id?: string;
          title?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "conversations_owner_id_fkey";
            columns: ["owner_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      Messages: {
        Row: {
          content: string | null;
          conversation_id: string | null;
          created_at: string;
          id: string;
          role: string | null;
        };
        Insert: {
          content?: string | null;
          conversation_id?: string | null;
          created_at?: string;
          id?: string;
          role?: string | null;
        };
        Update: {
          content?: string | null;
          conversation_id?: string | null;
          created_at?: string;
          id?: string;
          role?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "Messages_conversation_id_fkey";
            columns: ["conversation_id"];
            isOneToOne: false;
            referencedRelation: "conversations";
            referencedColumns: ["id"];
          }
        ];
      };
      notes: {
        Row: {
          blocks: Json | null;
          conversation_id: string | null;
          created: string;
          updated_at: string | null;
        };
        Insert: {
          blocks?: Json | null;
          conversation_id?: string | null;
          created?: string;
          id?: string;
          updated_at?: string | null;
        };
        Update: {
          blocks?: Json | null;
          conversation_id?: string | null;
          created?: string;
          id?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "public_notes_conversation_id_fkey";
            columns: ["conversation_id"];
            isOneToOne: false;
            referencedRelation: "conversations";
            referencedColumns: ["id"];
          }
        ];
      };
      "OpenAI-Responses": {
        Row: {
          chat_completion_id: string | null;
          completion_tokens: number | null;
          created: string | null;
          id: string;
          message: string | null;
          model: string | null;
          prompt_tokens: number | null;
          system_fingerprint: string | null;
          total_tokens: number | null;
        };
        Insert: {
          chat_completion_id?: string | null;
          completion_tokens?: number | null;
          created?: string | null;
          id?: string;
          message?: string | null;
          model?: string | null;
          prompt_tokens?: number | null;
          system_fingerprint?: string | null;
          total_tokens?: number | null;
        };
        Update: {
          chat_completion_id?: string | null;
          completion_tokens?: number | null;
          created?: string | null;
          id?: string;
          message?: string | null;
          model?: string | null;
          prompt_tokens?: number | null;
          system_fingerprint?: string | null;
          total_tokens?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "OpenAI-Responses_message_fkey";
            columns: ["message"];
            isOneToOne: false;
            referencedRelation: "Messages";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never;

export function getSupabaseClient() {
  const supabase = createClient<Database>(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_KEY
  );
  return supabase;
}

export function getCurrentDate() {
  return new Date(Date.now() + 1000 * 60 * -new Date().getTimezoneOffset())
    .toISOString()
    .replace("T", " ")
    .replace("Z", "")
    .toString();
}
