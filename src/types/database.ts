/** Hand-written shapes for on-device storage — sync with `src/services/demo/store.ts`. */
export type Database = {
  public: {
    Tables: {
      pets: {
        Row: {
          id: string;
          owner_id: string;
          name: string;
          species: PetSpecies;
          description: string;
          gender: PetGender;
          /** `YYYY-MM-DD`. */
          birth_date: string;
          /** Stored as a decimal string, e.g. `"4.50"`. */
          weight_kg: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          name: string;
          species: PetSpecies;
          description: string;
          gender?: PetGender;
          birth_date: string;
          weight_kg?: number | null;
          avatar_url?: string | null;
        };
        Update: {
          name?: string;
          species?: PetSpecies;
          description?: string;
          gender?: PetGender;
          birth_date?: string;
          weight_kg?: number | null;
          avatar_url?: string | null;
        };
        Relationships: [];
      };
      pet_weights: {
        Row: {
          id: string;
          pet_id: string;
          /** Stored as a decimal string, e.g. `"4.50"`. */
          weight_kg: string;
          /** `YYYY-MM-DD`. */
          recorded_at: string;
          note: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          pet_id: string;
          weight_kg: number;
          recorded_at: string;
          note?: string | null;
        };
        Update: {
          weight_kg?: number;
          recorded_at?: string;
          note?: string | null;
        };
        Relationships: [];
      };
      pet_health_records: {
        Row: {
          id: string;
          pet_id: string;
          title: string;
          /** `YYYY-MM-DD`. */
          visited_at: string;
          description: string;
          clinic_name: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          pet_id: string;
          title: string;
          visited_at: string;
          description: string;
          clinic_name?: string | null;
        };
        Update: {
          title?: string;
          visited_at?: string;
          description?: string;
          clinic_name?: string | null;
        };
        Relationships: [];
      };
      pet_vaccinations: {
        Row: {
          id: string;
          pet_id: string;
          name: string;
          administered_at: string;
          next_due_at: string | null;
          clinic_name: string | null;
          note: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          pet_id: string;
          name: string;
          administered_at: string;
          next_due_at?: string | null;
          clinic_name?: string | null;
          note?: string | null;
        };
        Update: {
          name?: string;
          administered_at?: string;
          next_due_at?: string | null;
          clinic_name?: string | null;
          note?: string | null;
        };
        Relationships: [];
      };
      pet_medications: {
        Row: {
          id: string;
          pet_id: string;
          name: string;
          dosage: string;
          frequency: string;
          started_at: string;
          ended_at: string | null;
          note: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          pet_id: string;
          name: string;
          dosage: string;
          frequency: string;
          started_at: string;
          ended_at?: string | null;
          note?: string | null;
        };
        Update: {
          name?: string;
          dosage?: string;
          frequency?: string;
          started_at?: string;
          ended_at?: string | null;
          note?: string | null;
        };
        Relationships: [];
      };
      reminders: {
        Row: {
          id: string;
          owner_id: string;
          pet_id: string;
          type: ReminderType;
          title: string;
          notes: string | null;
          remind_at: string;
          schedule_mode: ReminderScheduleMode;
          recurrence: ReminderRecurrence | null;
          /** `YYYY-MM-DD`. */
          range_start: string;
          /** `YYYY-MM-DD`, set when `schedule_mode = recurring`. */
          range_end: string | null;
          completed_at: string | null;
          /** Legacy single notification id; prefer `notification_ids`. */
          notification_id: string | null;
          /** JSON array of scheduled local notification identifiers. */
          notification_ids: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          pet_id: string;
          type?: ReminderType;
          title: string;
          notes?: string | null;
          remind_at: string;
          schedule_mode?: ReminderScheduleMode;
          recurrence?: ReminderRecurrence | null;
          range_start: string;
          range_end?: string | null;
          completed_at?: string | null;
          notification_id?: string | null;
          notification_ids?: string | null;
        };
        Update: {
          pet_id?: string;
          type?: ReminderType;
          title?: string;
          notes?: string | null;
          remind_at?: string;
          schedule_mode?: ReminderScheduleMode;
          recurrence?: ReminderRecurrence | null;
          range_start?: string;
          range_end?: string | null;
          completed_at?: string | null;
          notification_id?: string | null;
          notification_ids?: string | null;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      pet_species: PetSpecies;
      pet_gender: PetGender;
      reminder_type: ReminderType;
      reminder_schedule_mode: ReminderScheduleMode;
      reminder_recurrence: ReminderRecurrence;
    };
    CompositeTypes: Record<string, never>;
  };
};

export type PetSpecies = "cat" | "dog" | "bird" | "rabbit" | "turtle" | "hamster" | "other";
export type PetGender = "female" | "male" | "unknown";
export type ReminderType = "vaccination" | "medication" | "vet" | "grooming" | "other";
export type ReminderScheduleMode = "once" | "recurring";
export type ReminderRecurrence = "daily" | "weekly" | "monthly";

export type Pet = Database["public"]["Tables"]["pets"]["Row"];
export type PetWeight = Database["public"]["Tables"]["pet_weights"]["Row"];
export type PetHealthRecord = Database["public"]["Tables"]["pet_health_records"]["Row"];
export type PetVaccination = Database["public"]["Tables"]["pet_vaccinations"]["Row"];
export type PetMedication = Database["public"]["Tables"]["pet_medications"]["Row"];
export type Reminder = Database["public"]["Tables"]["reminders"]["Row"];
