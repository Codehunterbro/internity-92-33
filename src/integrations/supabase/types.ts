export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      checkout_settings: {
        Row: {
          available_after: string | null
          created_at: string
          feature_name: string
          id: string
          is_enabled: boolean
          updated_at: string
        }
        Insert: {
          available_after?: string | null
          created_at?: string
          feature_name: string
          id?: string
          is_enabled?: boolean
          updated_at?: string
        }
        Update: {
          available_after?: string | null
          created_at?: string
          feature_name?: string
          id?: string
          is_enabled?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      courses: {
        Row: {
          category: string | null
          course_curriculum: Json | null
          course_features: string[] | null
          created_at: string | null
          currency: string | null
          curriculum_summary: string | null
          description: string
          duration: string | null
          id: string
          image: string | null
          instructor: string
          instructor_bio: string | null
          instructor_role: string | null
          learning_objectives: string[] | null
          long_description: string | null
          metadata: Json | null
          price: number
          price_inr: number | null
          rating: number | null
          requirements: string[] | null
          reviews_count: number | null
          short_description: string | null
          students: number | null
          tags: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          course_curriculum?: Json | null
          course_features?: string[] | null
          created_at?: string | null
          currency?: string | null
          curriculum_summary?: string | null
          description: string
          duration?: string | null
          id?: string
          image?: string | null
          instructor: string
          instructor_bio?: string | null
          instructor_role?: string | null
          learning_objectives?: string[] | null
          long_description?: string | null
          metadata?: Json | null
          price: number
          price_inr?: number | null
          rating?: number | null
          requirements?: string[] | null
          reviews_count?: number | null
          short_description?: string | null
          students?: number | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          course_curriculum?: Json | null
          course_features?: string[] | null
          created_at?: string | null
          currency?: string | null
          curriculum_summary?: string | null
          description?: string
          duration?: string | null
          id?: string
          image?: string | null
          instructor?: string
          instructor_bio?: string | null
          instructor_role?: string | null
          learning_objectives?: string[] | null
          long_description?: string | null
          metadata?: Json | null
          price?: number
          price_inr?: number | null
          rating?: number | null
          requirements?: string[] | null
          reviews_count?: number | null
          short_description?: string | null
          students?: number | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      earnings: {
        Row: {
          amount: number
          course_id: string
          currency: string | null
          id: string
          metadata: Json | null
          payment_method: string | null
          payment_status: string | null
          purchased_at: string | null
          receipt_url: string | null
          refund_date: string | null
          refund_status: string | null
          transaction_id: string | null
          user_id: string
        }
        Insert: {
          amount?: number
          course_id: string
          currency?: string | null
          id?: string
          metadata?: Json | null
          payment_method?: string | null
          payment_status?: string | null
          purchased_at?: string | null
          receipt_url?: string | null
          refund_date?: string | null
          refund_status?: string | null
          transaction_id?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          course_id?: string
          currency?: string | null
          id?: string
          metadata?: Json | null
          payment_method?: string | null
          payment_status?: string | null
          purchased_at?: string | null
          receipt_url?: string | null
          refund_date?: string | null
          refund_status?: string | null
          transaction_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "earnings_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_progress: {
        Row: {
          completed_at: string | null
          course_id: string
          created_at: string | null
          id: string
          lesson_id: string
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          course_id: string
          created_at?: string | null
          id?: string
          lesson_id: string
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          course_id?: string
          created_at?: string | null
          id?: string
          lesson_id?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lesson_progress_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lesson_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      lessons: {
        Row: {
          content: string | null
          created_at: string | null
          duration: string | null
          id: string
          is_locked: boolean | null
          module_id: string
          order_index: number
          subtitle: string | null
          title: string
          type: string
          updated_at: string | null
          video_id: string | null
          video_type: string | null
          week_id: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          duration?: string | null
          id?: string
          is_locked?: boolean | null
          module_id: string
          order_index: number
          subtitle?: string | null
          title: string
          type: string
          updated_at?: string | null
          video_id?: string | null
          video_type?: string | null
          week_id?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          duration?: string | null
          id?: string
          is_locked?: boolean | null
          module_id?: string
          order_index?: number
          subtitle?: string | null
          title?: string
          type?: string
          updated_at?: string | null
          video_id?: string | null
          video_type?: string | null
          week_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lessons_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      major_project_documents: {
        Row: {
          attachment_url: string | null
          created_at: string | null
          description: string | null
          id: string
          is_locked: boolean | null
          module_id: string
          title: string
          video_url: string | null
        }
        Insert: {
          attachment_url?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_locked?: boolean | null
          module_id: string
          title: string
          video_url?: string | null
        }
        Update: {
          attachment_url?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_locked?: boolean | null
          module_id?: string
          title?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "major_project_documents_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      major_projects: {
        Row: {
          attachment_url: string | null
          created_at: string | null
          deadline: string
          feedback: string | null
          id: string
          instructions: string | null
          is_locked: boolean
          module_id: string
          score: string | null
          status: string | null
          submission_date: string | null
          user_id: string
          video_url: string | null
          week_id: string | null
        }
        Insert: {
          attachment_url?: string | null
          created_at?: string | null
          deadline: string
          feedback?: string | null
          id?: string
          instructions?: string | null
          is_locked?: boolean
          module_id: string
          score?: string | null
          status?: string | null
          submission_date?: string | null
          user_id: string
          video_url?: string | null
          week_id?: string | null
        }
        Update: {
          attachment_url?: string | null
          created_at?: string | null
          deadline?: string
          feedback?: string | null
          id?: string
          instructions?: string | null
          is_locked?: boolean
          module_id?: string
          score?: string | null
          status?: string | null
          submission_date?: string | null
          user_id?: string
          video_url?: string | null
          week_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "major_projects_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      minor_project_documents: {
        Row: {
          attachment_url: string | null
          created_at: string | null
          description: string | null
          id: string
          is_locked: boolean | null
          module_id: string
          title: string
          video_url: string | null
          week_id: string | null
        }
        Insert: {
          attachment_url?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_locked?: boolean | null
          module_id: string
          title: string
          video_url?: string | null
          week_id?: string | null
        }
        Update: {
          attachment_url?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_locked?: boolean | null
          module_id?: string
          title?: string
          video_url?: string | null
          week_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "minor_project_documents_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      minor_projects: {
        Row: {
          attachment_url: string | null
          created_at: string | null
          deadline: string
          description: string | null
          feedback: string | null
          id: string
          instructions: string | null
          is_locked: boolean
          module_id: string | null
          score: string | null
          status: Database["public"]["Enums"]["assignment_status"] | null
          submission_date: string | null
          title: string
          user_id: string
          video_url: string | null
          week_id: string | null
        }
        Insert: {
          attachment_url?: string | null
          created_at?: string | null
          deadline: string
          description?: string | null
          feedback?: string | null
          id?: string
          instructions?: string | null
          is_locked?: boolean
          module_id?: string | null
          score?: string | null
          status?: Database["public"]["Enums"]["assignment_status"] | null
          submission_date?: string | null
          title: string
          user_id: string
          video_url?: string | null
          week_id?: string | null
        }
        Update: {
          attachment_url?: string | null
          created_at?: string | null
          deadline?: string
          description?: string | null
          feedback?: string | null
          id?: string
          instructions?: string | null
          is_locked?: boolean
          module_id?: string | null
          score?: string | null
          status?: Database["public"]["Enums"]["assignment_status"] | null
          submission_date?: string | null
          title?: string
          user_id?: string
          video_url?: string | null
          week_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "minor_projects_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      modules: {
        Row: {
          course_id: string
          created_at: string | null
          description: string | null
          id: string
          order_index: number
          title: string
          updated_at: string | null
          week_1: string | null
          week_2: string | null
          week_3: string | null
          week_4: string | null
          weeks_id: Json | null
        }
        Insert: {
          course_id: string
          created_at?: string | null
          description?: string | null
          id?: string
          order_index: number
          title: string
          updated_at?: string | null
          week_1?: string | null
          week_2?: string | null
          week_3?: string | null
          week_4?: string | null
          weeks_id?: Json | null
        }
        Update: {
          course_id?: string
          created_at?: string | null
          description?: string | null
          id?: string
          order_index?: number
          title?: string
          updated_at?: string | null
          week_1?: string | null
          week_2?: string | null
          week_3?: string | null
          week_4?: string | null
          weeks_id?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "modules_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          attendance_absent: number | null
          attendance_present: number | null
          created_at: string
          full_name: string | null
          grade: string | null
          id: string
          profile_picture: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          attendance_absent?: number | null
          attendance_present?: number | null
          created_at?: string
          full_name?: string | null
          grade?: string | null
          id: string
          profile_picture?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          attendance_absent?: number | null
          attendance_present?: number | null
          created_at?: string
          full_name?: string | null
          grade?: string | null
          id?: string
          profile_picture?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
      purchased_courses: {
        Row: {
          course_id: string
          duration: string | null
          id: string
          image: string | null
          lessonscompleted: number | null
          purchased_at: string | null
          title: string
          totallessons: number | null
          user_id: string
        }
        Insert: {
          course_id: string
          duration?: string | null
          id?: string
          image?: string | null
          lessonscompleted?: number | null
          purchased_at?: string | null
          title: string
          totallessons?: number | null
          user_id: string
        }
        Update: {
          course_id?: string
          duration?: string | null
          id?: string
          image?: string | null
          lessonscompleted?: number | null
          purchased_at?: string | null
          title?: string
          totallessons?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "purchased_courses_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_questions: {
        Row: {
          correct_answer: number
          created_at: string | null
          explanation: string | null
          id: string
          is_quiz_locked: boolean
          lesson_id: string
          options: Json
          order_index: number
          question: string
        }
        Insert: {
          correct_answer: number
          created_at?: string | null
          explanation?: string | null
          id?: string
          is_quiz_locked?: boolean
          lesson_id: string
          options: Json
          order_index: number
          question: string
        }
        Update: {
          correct_answer?: number
          created_at?: string | null
          explanation?: string | null
          id?: string
          is_quiz_locked?: boolean
          lesson_id?: string
          options?: Json
          order_index?: number
          question?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_questions_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      resources: {
        Row: {
          created_at: string | null
          id: string
          lesson_id: string
          name: string
          size: string | null
          type: string
          url: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          lesson_id: string
          name: string
          size?: string | null
          type: string
          url?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          lesson_id?: string
          name?: string
          size?: string | null
          type?: string
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "resources_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      student_achievements: {
        Row: {
          completion_date: string | null
          id: string
          study_timeframe: string | null
          title: string
          user_id: string
        }
        Insert: {
          completion_date?: string | null
          id?: string
          study_timeframe?: string | null
          title: string
          user_id: string
        }
        Update: {
          completion_date?: string | null
          id?: string
          study_timeframe?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      student_registrations: {
        Row: {
          ai_thoughts: string
          branch: string
          college_name: string
          created_at: string
          full_name: string
          has_backlogs: boolean
          id: string
          last_semester_score: number
          payment_amount: number
          payment_date: string | null
          payment_id: string | null
          payment_status: string
          semester: Database["public"]["Enums"]["semester_type"]
          updated_at: string
          user_id: string
        }
        Insert: {
          ai_thoughts: string
          branch: string
          college_name: string
          created_at?: string
          full_name: string
          has_backlogs?: boolean
          id?: string
          last_semester_score: number
          payment_amount?: number
          payment_date?: string | null
          payment_id?: string | null
          payment_status?: string
          semester: Database["public"]["Enums"]["semester_type"]
          updated_at?: string
          user_id: string
        }
        Update: {
          ai_thoughts?: string
          branch?: string
          college_name?: string
          created_at?: string
          full_name?: string
          has_backlogs?: boolean
          id?: string
          last_semester_score?: number
          payment_amount?: number
          payment_date?: string | null
          payment_id?: string | null
          payment_status?: string
          semester?: Database["public"]["Enums"]["semester_type"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      student_transactions: {
        Row: {
          amount: number
          course_id: string
          created_at: string | null
          id: string
          receipt_url: string | null
          transaction_id: string
          user_id: string
        }
        Insert: {
          amount: number
          course_id: string
          created_at?: string | null
          id?: string
          receipt_url?: string | null
          transaction_id: string
          user_id: string
        }
        Update: {
          amount?: number
          course_id?: string
          created_at?: string | null
          id?: string
          receipt_url?: string | null
          transaction_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_transactions_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_column_exists: {
        Args: { table_name: string; column_name: string }
        Returns: boolean
      }
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      assignment_status: "submitted" | "not_submitted" | "graded"
      semester_type: "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8"
      user_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      assignment_status: ["submitted", "not_submitted", "graded"],
      semester_type: ["1", "2", "3", "4", "5", "6", "7", "8"],
      user_role: ["admin", "user"],
    },
  },
} as const
