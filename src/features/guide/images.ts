/**
 * Curated Wikimedia thumbnails — picked for centered, full-subject framing.
 * Loaded on demand; expo-image caches them on device.
 */
const ANIMAL_GUIDE_IMAGE_URLS: Record<string, string> = {
  alpaca:
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0e/Alpaca_in_Higashiyama_Zoo_-_1.jpg/1280px-Alpaca_in_Higashiyama_Zoo_-_1.jpg',
  axolotl:
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/00/Axolotl_ganz.jpg/1280px-Axolotl_ganz.jpg',
  'ball-python': 'https://upload.wikimedia.org/wikipedia/commons/4/4d/Ball_python_lucy.JPG',
  'bearded-dragon':
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/98/Bartagame_%28fcm%29.jpg/1280px-Bartagame_%28fcm%29.jpg',
  bee: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4d/Apis_mellifera_Western_honey_bee.jpg/1280px-Apis_mellifera_Western_honey_bee.jpg',
  betta:
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/10/HM_Orange_M_Sarawut.jpg/1280px-HM_Orange_M_Sarawut.jpg',
  budgie:
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4a/Budgerigar-male-strzelecki-qld.jpg/1280px-Budgerigar-male-strzelecki-qld.jpg',
  canary: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/ce/GelbA.JPG/1280px-GelbA.JPG',
  cat: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4d/Cat_November_2010-1a.jpg/1280px-Cat_November_2010-1a.jpg',
  chicken:
    'https://upload.wikimedia.org/wikipedia/commons/8/84/Male_and_female_chicken_sitting_together.jpg',
  chinchilla:
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/18/Chinchilla_lanigera_%28Wroclaw_zoo%29-2.JPG/1280px-Chinchilla_lanigera_%28Wroclaw_zoo%29-2.JPG',
  cockatiel:
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8a/Cockatiel_3.jpg/1280px-Cockatiel_3.jpg',
  'corn-snake':
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ef/CornSnake.jpg/1280px-CornSnake.jpg',
  'crested-gecko': 'https://upload.wikimedia.org/wikipedia/commons/d/d9/Crested_gecko_-_1.jpg',
  dog: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7a/Huskiesatrest.jpg/1280px-Huskiesatrest.jpg',
  donkey:
    'https://upload.wikimedia.org/wikipedia/commons/1/1a/Donkey_in_Clovelly%2C_North_Devon%2C_England.jpg',
  duck: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/bf/Anas_platyrhynchos_male_female_quadrat.jpg/1280px-Anas_platyrhynchos_male_female_quadrat.jpg',
  ferret:
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/32/Ferret_2008.png/1280px-Ferret_2008.png',
  finch:
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f1/House_finch_%2833688%292.jpg/1280px-House_finch_%2833688%292.jpg',
  fish: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/97/Neonsalmler_Paracheirodon_innesi.jpg/1280px-Neonsalmler_Paracheirodon_innesi.jpg',
  frog: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/39/European_Common_Frog_Rana_temporaria.jpg/1280px-European_Common_Frog_Rana_temporaria.jpg',
  gecko:
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7f/Eublepharis_macularius_2009_G6.jpg/1280px-Eublepharis_macularius_2009_G6.jpg',
  gerbil:
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9c/Meriones_unguiculatus_%28wild%29.jpg/1280px-Meriones_unguiculatus_%28wild%29.jpg',
  goat: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b2/Hausziege_04.jpg/1280px-Hausziege_04.jpg',
  goldfish:
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/65/Gold_fish1.jpg/1280px-Gold_fish1.jpg',
  'green-iguana':
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/21/Iguana_iguana_%28male_resting%29.jpg/1280px-Iguana_iguana_%28male_resting%29.jpg',
  guppy: 'https://upload.wikimedia.org/wikipedia/commons/a/a2/Guppy_pho_0048.jpg',
  hamster:
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6b/Golden_hamster_front_1.jpg/1280px-Golden_hamster_front_1.jpg',
  hedgehog: 'https://upload.wikimedia.org/wikipedia/commons/d/d0/Atelerix_albiventris.jpg',
  'hermit-crab':
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e7/Caribbean_hermit_crab.JPG/1280px-Caribbean_hermit_crab.JPG',
  horse: 'https://upload.wikimedia.org/wikipedia/commons/5/54/Halterstandingshotarabianone.jpg',
  isopod:
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/71/Woodlouse_collage_x4.png/1280px-Woodlouse_collage_x4.png',
  'leopard-gecko':
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7f/Eublepharis_macularius_2009_G6.jpg/1280px-Eublepharis_macularius_2009_G6.jpg',
  'miniature-horse':
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ea/Miniature_Horse2.jpg/1280px-Miniature_Horse2.jpg',
  mouse: 'https://upload.wikimedia.org/wikipedia/commons/a/a4/Fancy_Mouse.jpg',
  parrot:
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/ad/Rainbow_lorikeet_%28Trichoglossus_moluccanus_moluccanus%29_Sydney.jpg/1280px-Rainbow_lorikeet_%28Trichoglossus_moluccanus_moluccanus%29_Sydney.jpg',
  pigeon:
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/35/LA2-NSRW-3-0536_cropped.jpg/1280px-LA2-NSRW-3-0536_cropped.jpg',
  quail:
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/db/Japanese_Quail.jpg/1280px-Japanese_Quail.jpg',
  rabbit:
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1f/Oryctolagus_cuniculus_Rcdo.jpg/1280px-Oryctolagus_cuniculus_Rcdo.jpg',
  rat: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/44/Brown_Rat_%28Rattus_norvegicus%29.jpg/1280px-Brown_Rat_%28Rattus_norvegicus%29.jpg',
  sheep:
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2c/Flock_of_sheep.jpg/1280px-Flock_of_sheep.jpg',
  shrimp: 'https://upload.wikimedia.org/wikipedia/commons/3/3a/Red_Cherry_Shrimp_1.jpg',
  silkworm: 'https://upload.wikimedia.org/wikipedia/commons/4/47/Pairedmoths.jpg',
  snail: 'https://upload.wikimedia.org/wikipedia/commons/4/46/Pomacea_insularum_shell_3.jpg',
  'snail-land': 'https://upload.wikimedia.org/wikipedia/commons/2/23/Snail1web.jpg',
  snake: 'https://upload.wikimedia.org/wikipedia/commons/e/ef/CornSnake.jpg',
  tarantula:
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/94/Brachypelma_vagans_p1.jpg/1280px-Brachypelma_vagans_p1.jpg',
  tortoise:
    'https://upload.wikimedia.org/wikipedia/commons/6/6c/Testudo_hermanni_hermanni_Mallorca_02.jpg',
  turtle:
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2d/Red-eared_Slider_Thailand.JPG/1280px-Red-eared_Slider_Thailand.JPG',
};

export function getAnimalGuideImageUrl(animalId: string): string | undefined {
  return ANIMAL_GUIDE_IMAGE_URLS[animalId];
}
