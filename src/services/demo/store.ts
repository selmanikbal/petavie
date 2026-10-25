import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';

import { LOCAL_OWNER_ID } from '@/constants/owner';
import type {
  Pet,
  PetHealthRecord,
  PetMedication,
  PetVaccination,
  PetWeight,
  Reminder,
} from '@/types/database';

/**
 * On-device store. Pets, reminders and health records stay in AsyncStorage
 * on this phone — they are not uploaded to a server.
 */
const LEGACY_USERS_KEY = 'demo.users';
const LEGACY_SESSION_KEY = 'demo.session-user-id';
const PETS_KEY = 'demo.pets';
const PET_WEIGHTS_KEY = 'demo.pet-weights';
const HEALTH_RECORDS_KEY = 'demo.health-records';
const VACCINATIONS_KEY = 'demo.vaccinations';
const MEDICATIONS_KEY = 'demo.medications';
const REMINDERS_KEY = 'demo.reminders';
const LEGACY_DEVICE_TOKENS_KEY = 'demo.device-tokens';
const LEGACY_PROFILE_KEY = 'demo.profile';
const VERSION_KEY = 'demo.schema-version';

/** Bump when stored records change shape. v13 drops unused push-token cache. */
const SCHEMA_VERSION = '13';

let schemaCheck: Promise<void> | null = null;

async function readJsonArray<T>(key: string): Promise<T[]> {
  const raw = await AsyncStorage.getItem(key);
  if (!raw) return [];

  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    await AsyncStorage.removeItem(key);
    return [];
  }
}

async function runSchemaCheck(): Promise<void> {
  const stored = await AsyncStorage.getItem(VERSION_KEY);
  if (stored === SCHEMA_VERSION) return;

  await AsyncStorage.multiRemove([
    LEGACY_USERS_KEY,
    LEGACY_SESSION_KEY,
    LEGACY_PROFILE_KEY,
    LEGACY_DEVICE_TOKENS_KEY,
  ]);

  const pets = await readJsonArray<Pet>(PETS_KEY);
  if (pets.some((pet) => pet.owner_id !== LOCAL_OWNER_ID)) {
    await writePets(pets.map((pet) => ({ ...pet, owner_id: LOCAL_OWNER_ID })));
  }

  const reminders = await readJsonArray<Reminder>(REMINDERS_KEY);
  if (reminders.some((row) => row.owner_id !== LOCAL_OWNER_ID)) {
    await writeReminders(reminders.map((row) => ({ ...row, owner_id: LOCAL_OWNER_ID })));
  }

  await AsyncStorage.setItem(VERSION_KEY, SCHEMA_VERSION);
}

function ensureCurrentSchema(): Promise<void> {
  schemaCheck ??= runSchemaCheck();
  return schemaCheck;
}

export function createId(): string {
  return Crypto.randomUUID();
}

/** Reads pet rows from AsyncStorage (`weight_kg` as decimal strings). */
export async function readPets(): Promise<Pet[]> {
  await ensureCurrentSchema();
  return readJsonArray<Pet>(PETS_KEY);
}

export async function writePets(pets: Pet[]): Promise<void> {
  await AsyncStorage.setItem(PETS_KEY, JSON.stringify(pets));
}

export async function readPetWeights(): Promise<PetWeight[]> {
  await ensureCurrentSchema();
  return readJsonArray<PetWeight>(PET_WEIGHTS_KEY);
}

export async function writePetWeights(weights: PetWeight[]): Promise<void> {
  await AsyncStorage.setItem(PET_WEIGHTS_KEY, JSON.stringify(weights));
}

export async function deletePetWeightsForPet(petId: string): Promise<void> {
  const weights = await readPetWeights();
  await writePetWeights(weights.filter((row) => row.pet_id !== petId));
}

export async function readHealthRecords(): Promise<PetHealthRecord[]> {
  await ensureCurrentSchema();
  return readJsonArray<PetHealthRecord>(HEALTH_RECORDS_KEY);
}

export async function writeHealthRecords(records: PetHealthRecord[]): Promise<void> {
  await AsyncStorage.setItem(HEALTH_RECORDS_KEY, JSON.stringify(records));
}

export async function deleteHealthRecordsForPet(petId: string): Promise<void> {
  const records = await readHealthRecords();
  await writeHealthRecords(records.filter((row) => row.pet_id !== petId));
}

export async function readVaccinations(): Promise<PetVaccination[]> {
  await ensureCurrentSchema();
  return readJsonArray<PetVaccination>(VACCINATIONS_KEY);
}

export async function writeVaccinations(vaccinations: PetVaccination[]): Promise<void> {
  await AsyncStorage.setItem(VACCINATIONS_KEY, JSON.stringify(vaccinations));
}

export async function deleteVaccinationsForPet(petId: string): Promise<void> {
  const rows = await readVaccinations();
  await writeVaccinations(rows.filter((row) => row.pet_id !== petId));
}

export async function readMedications(): Promise<PetMedication[]> {
  await ensureCurrentSchema();
  return readJsonArray<PetMedication>(MEDICATIONS_KEY);
}

export async function writeMedications(medications: PetMedication[]): Promise<void> {
  await AsyncStorage.setItem(MEDICATIONS_KEY, JSON.stringify(medications));
}

export async function deleteMedicationsForPet(petId: string): Promise<void> {
  const rows = await readMedications();
  await writeMedications(rows.filter((row) => row.pet_id !== petId));
}

export async function readReminders(): Promise<Reminder[]> {
  await ensureCurrentSchema();
  return readJsonArray<Reminder>(REMINDERS_KEY);
}

export async function writeReminders(reminders: Reminder[]): Promise<void> {
  await AsyncStorage.setItem(REMINDERS_KEY, JSON.stringify(reminders));
}

export async function deleteRemindersForPet(petId: string): Promise<void> {
  const rows = await readReminders();
  await writeReminders(rows.filter((row) => row.pet_id !== petId));
}
