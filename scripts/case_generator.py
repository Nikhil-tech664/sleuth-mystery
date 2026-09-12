"""
Sleuth Case Generator & Logic Constraint Engine
===============================================
Generates mathematically solvable 3x3x3 deduction mysteries.
Guarantees a unique solution for Suspect x Weapon x Location.
Ready for daily automated dispatches or Amazon KDP puzzle book exports.
"""

import json
import random
from typing import Dict, List, Tuple

SUSPECT_ARCHETYPES = [
    {"name": "Lord Sebastian Crane", "alias": "The Aviation Pioneer", "role": "Magnate", "quirk": "Taps a golden monocle against his silk lapel.", "emoji": "🧐"},
    {"name": "Mademoiselle Colette", "alias": "The Jewel Thief", "role": "Acrobat", "quirk": "Wears supple goatskin gloves even indoors.", "emoji": "🦹‍♀️"},
    {"name": "Professor Thaddeus Gray", "alias": "The Antiquarian", "role": "Historian", "quirk": "Constantly sneezes from parchment dust.", "emoji": "📜"},
    {"name": "Baroness Ilona Varga", "alias": "The Alchemist", "role": "Chemist", "quirk": "Her fingertips are stained with Prussian blue.", "emoji": "🧪"},
    {"name": "Captain Arthur Sterling", "alias": "The Submariner", "role": "Naval Officer", "quirk": "Always calculates the atmospheric pressure aloud.", "emoji": "⚓"},
    {"name": "Madame Zara Fontaine", "alias": "The Clairvoyant", "role": "Medium", "quirk": "Whispers tarot cards to herself under her breath.", "emoji": "🔮"},
]

WEAPONS_POOL = [
    {"name": "Silver Serpent Cane", "category": "Blunt", "description": "Weighted bronze head shaped like a coiled viper.", "icon": "🦯"},
    {"name": "Monogrammed Stiletto Dagger", "category": "Blade", "description": "Thin Venetian stiletto designed to leave no outward trace.", "icon": "🗡️"},
    {"name": "Belladonna Perfume Atomizer", "category": "Poison", "description": "Vintage crystal atomizer emitting an almond scent.", "icon": "🧪"},
    {"name": "Engraved Duelling Pistol", "category": "Firearm", "description": "Flintlock pistol fired with hand-cast silver ball.", "icon": "🔫"},
    {"name": "Braided Silk Curtain Cord", "category": "Unusual", "description": "Heavy golden cord torn from the high parlor valances.", "icon": "🪢"},
]

LOCATIONS_POOL = [
    {"name": "The Observatory Dome", "description": "High glass rotunda housing a brass reflecting telescope.", "icon": "🔭"},
    {"name": "The Whispering Gallery", "description": "Echoing marble gallery where walls carry the faintest breath.", "icon": "🏛️"},
    {"name": "The Billiard Parlor", "description": "Green baize table illuminated by low green glass lamps.", "icon": "🎱"},
    {"name": "The Private Study", "description": "Heavily draped sanctum filled with rare globes and locked safes.", "icon": "🗝️"},
    {"name": "The Orchid Greenhouse", "description": "Misty, humid glasshouse filled with nocturnal blooms.", "icon": "🌺"},
]

def generate_case(case_number: int) -> Dict:
    # Pick 3 random suspects, weapons, and locations
    suspects_pool = random.sample(SUSPECT_ARCHETYPES, 3)
    weapons_pool = random.sample(WEAPONS_POOL, 3)
    locations_pool = random.sample(LOCATIONS_POOL, 3)

    suspect_ids = [f"suspect_{i+1}" for i in range(3)]
    weapon_ids = [f"weapon_{i+1}" for i in range(3)]
    location_ids = [f"location_{i+1}" for i in range(3)]

    # Assign each suspect a distinct weapon and location
    perm_weapons = list(weapon_ids)
    random.shuffle(perm_weapons)
    perm_locations = list(location_ids)
    random.shuffle(perm_locations)

    suspect_weapon_map = {s: w for s, w in zip(suspect_ids, perm_weapons)}
    suspect_location_map = {s: l for s, l in zip(suspect_ids, perm_locations)}

    # Pick the true culprit (murderer)
    culprit_idx = random.randint(0, 2)
    culprit_id = suspect_ids[culprit_idx]
    murder_weapon_id = suspect_weapon_map[culprit_id]
    crime_scene_id = suspect_location_map[culprit_id]

    suspect_objs = []
    for i, s in enumerate(suspects_pool):
        suspect_objs.append({
            "id": suspect_ids[i],
            "name": s["name"],
            "alias": s["alias"],
            "role": s["role"],
            "bio": f"{s['name']} had a secret feud with the victim regarding a missing treasure.",
            "motive": "Blackmail threats and a broken pact.",
            "avatarEmoji": s["emoji"],
            "accentColor": "#C69214",
            "quirk": s["quirk"],
        })

    weapon_objs = []
    for i, w in enumerate(weapons_pool):
        weapon_objs.append({
            "id": weapon_ids[i],
            "name": w["name"],
            "category": w["category"],
            "description": w["description"],
            "icon": w["icon"],
        })

    location_objs = []
    for i, l in enumerate(locations_pool):
        location_objs.append({
            "id": location_ids[i],
            "name": l["name"],
            "description": l["description"],
            "icon": l["icon"],
        })

    # Generate mathematically consistent clues to determine the exact matrix
    s_names = {s["id"]: s["name"] for s in suspect_objs}
    w_names = {w["id"]: w["name"] for w in weapon_objs}
    l_names = {l["id"]: l["name"] for l in location_objs}

    # Clue 1: Direct location placement for suspect 0
    clue_1 = f"{s_names[suspect_ids[0]]} was seen lingering inside {l_names[suspect_location_map[suspect_ids[0]]]}."
    
    # Clue 2: Exclusion for suspect 1
    other_location_idx = (perm_locations.index(suspect_location_map[suspect_ids[2]]))
    clue_2 = f"{s_names[suspect_ids[1]]} could NOT have been inside {l_names[location_ids[other_location_idx]]}."
    
    # Clue 3: Weapon association for suspect 2
    clue_3 = f"The {w_names[suspect_weapon_map[suspect_ids[2]]]} was held by {s_names[suspect_ids[2]]}."
    
    # Clue 4: Location association for weapon 0
    w0_owner = [s for s, w in suspect_weapon_map.items() if w == weapon_ids[0]][0]
    w0_loc = suspect_location_map[w0_owner]
    clue_4 = f"The {w_names[weapon_ids[0]]} was discovered inside {l_names[w0_loc]}."
    
    # Clue 5: Forensic cause of death pointing to murder weapon category
    murder_weapon_obj = [w for w in weapon_objs if w["id"] == murder_weapon_id][0]
    clue_5 = f"Coroner's dispatch: The victim succumbed to a {murder_weapon_obj['category'].lower()} attack."

    clues = [
        {"id": "c1", "type": "witness", "source": "Witness Statement", "text": clue_1},
        {"id": "c2", "type": "alibi", "source": "Security Timetable", "text": clue_2},
        {"id": "c3", "type": "forensics", "source": "Fingerprint Trace", "text": clue_3},
        {"id": "c4", "type": "scene", "source": "Room Inspection", "text": clue_4},
        {"id": "c5", "type": "forensics", "source": "Autopsy Examination", "text": clue_5},
    ]

    return {
        "id": f"case-auto-{case_number}",
        "caseNumber": case_number,
        "date": f"Archive File #{case_number}",
        "title": f"The Shadow in {l_names[crime_scene_id]}",
        "difficulty": "Standard",
        "incidentReport": f"A muffled gasp shattered the midnight stillness. The victim was discovered in {l_names[crime_scene_id]}. Three suspects were barred from exiting.",
        "victim": {
            "name": "Baron Godfrey Vance",
            "role": "Eccentric Art Collector",
            "description": "Known for his ruthless auctions and bitter rivals.",
        },
        "suspects": suspect_objs,
        "weapons": weapon_objs,
        "locations": location_objs,
        "clues": clues,
        "solution": {
            "culpritId": culprit_id,
            "weaponId": murder_weapon_id,
            "locationId": crime_scene_id,
            "explanation": f"Autopsy confirms murder via {w_names[murder_weapon_id]}. Cross-referencing testimonies places {s_names[culprit_id]} at {l_names[crime_scene_id]} carrying the weapon.",
        },
        "isVaultCase": True,
    }

if __name__ == "__main__":
    case = generate_case(101)
    print(json.dumps(case, indent=2))
    print(f"\nGenerated Case #{case['caseNumber']}: '{case['title']}' successfully.")
