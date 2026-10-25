import type { PetInput } from '@/features/pets/schemas';
import type { PetBackend } from '@/features/pets/types';
import { cancelReminderNotifications } from '@/features/reminders/notifications/local-scheduler';
import {
  deleteLocalPetAvatar,
  saveLocalPetAvatar,
} from '@/features/pets/photos/local-storage';
import {
  createId,
  deleteHealthRecordsForPet,
  deleteMedicationsForPet,
  deletePetWeightsForPet,
  deleteRemindersForPet,
  deleteVaccinationsForPet,
  readPets,
  readReminders,
  writePets,
} from '@/services/demo/store';
import type { Pet } from '@/types/database';
import { toISODate } from '@/utils/date';
import { AppError } from '@/utils/errors';

function toFields(input: PetInput) {
  return {
    name: input.name,
    species: input.species,
    description: input.description,
    gender: input.gender,
    birth_date: toISODate(input.birthDate),
    weight_kg: input.weightKg === null ? null : input.weightKg.toFixed(2),
  };
}

/** On-device pet storage — ownership filtered in code (`services/demo/store`). */
export const localPetBackend: PetBackend = {
  async list(ownerId) {
    const pets = await readPets();
    return pets
      .filter((pet) => pet.owner_id === ownerId)
      .sort((a, b) => b.created_at.localeCompare(a.created_at));
  },

  async get(petId) {
    const pets = await readPets();
    return pets.find((pet) => pet.id === petId) ?? null;
  },

  async create(ownerId, input) {
    const pets = await readPets();
    const now = new Date().toISOString();

    const pet: Pet = {
      id: createId(),
      owner_id: ownerId,
      ...toFields(input),
      avatar_url: null,
      created_at: now,
      updated_at: now,
    };

    await writePets([...pets, pet]);
    return pet;
  },

  async update(petId, input) {
    const pets = await readPets();
    const existing = pets.find((pet) => pet.id === petId);
    if (!existing) throw new AppError('Bu dostunu bulamadık.');

    const updated: Pet = {
      ...existing,
      ...toFields(input),
      updated_at: new Date().toISOString(),
    };

    await writePets(pets.map((pet) => (pet.id === petId ? updated : pet)));
    return updated;
  },

  async updateAvatar(petId, ownerId, localImageUri) {
    const pets = await readPets();
    const existing = pets.find((pet) => pet.id === petId);
    if (!existing || existing.owner_id !== ownerId) {
      throw new AppError('Bu dostunu bulamadık.');
    }

    if (existing.avatar_url) {
      await deleteLocalPetAvatar(existing.avatar_url);
    }

    const avatarUrl = await saveLocalPetAvatar(petId, localImageUri);
    const updated: Pet = {
      ...existing,
      avatar_url: avatarUrl,
      updated_at: new Date().toISOString(),
    };

    await writePets(pets.map((pet) => (pet.id === petId ? updated : pet)));
    return updated;
  },

  async remove(petId) {
    const pets = await readPets();
    const existing = pets.find((pet) => pet.id === petId);
    if (existing?.avatar_url) {
      await deleteLocalPetAvatar(existing.avatar_url);
    }
    await deletePetWeightsForPet(petId);
    await deleteHealthRecordsForPet(petId);
    await deleteVaccinationsForPet(petId);
    await deleteMedicationsForPet(petId);
    const reminders = await readReminders();
    for (const reminder of reminders.filter((row) => row.pet_id === petId)) {
      await cancelReminderNotifications(reminder);
    }
    await deleteRemindersForPet(petId);
    await writePets(pets.filter((pet) => pet.id !== petId));
  },
};
