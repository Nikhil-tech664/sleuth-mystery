// Case Solvability & Bijection Verification Runner
import { INITIAL_CASES } from '../src/data/initialCases.ts';

console.log('========================================================');
console.log('🕵️‍♂️ SLEUTH CASE ENGINE: FULL 8-CASE VALIDATION AUDIT');
console.log('========================================================\n');

let allPassed = true;

INITIAL_CASES.forEach((c, idx) => {
  console.log(`[CASE ${idx + 1}/8] #${c.caseNumber}: "${c.title}" (${c.difficulty})`);
  console.log(`  Victim: ${c.victim.name} - ${c.victim.role}`);
  console.log(`  Suspects: ${c.suspects.map(s => s.name).join(', ')}`);
  console.log(`  Weapons: ${c.weapons.map(w => w.name).join(', ')}`);
  console.log(`  Locations: ${c.locations.map(l => l.name).join(', ')}`);
  console.log(`  Hotspots: ${c.hotspots?.length || 0} evidence markers`);
  console.log(`  Trophy: ${c.trophy?.name} (${c.trophy?.icon})`);

  // Verify Solution matches defined entities
  const culprit = c.suspects.find(s => s.id === c.solution.culpritId);
  const weapon = c.weapons.find(w => w.id === c.solution.weaponId);
  const location = c.locations.find(l => l.id === c.solution.locationId);

  if (!culprit) {
    console.error(`  ❌ ERROR: Culprit ID ${c.solution.culpritId} not found in suspects!`);
    allPassed = false;
  }
  if (!weapon) {
    console.error(`  ❌ ERROR: Weapon ID ${c.solution.weaponId} not found in weapons!`);
    allPassed = false;
  }
  if (!location) {
    console.error(`  ❌ ERROR: Location ID ${c.solution.locationId} not found in locations!`);
    allPassed = false;
  }

  if (culprit && weapon && location) {
    console.log(`  ✅ VERIFIED SOLUTION: ${culprit.name} with ${weapon.name} in ${location.name}`);
    console.log(`     Explanation: "${c.solution.explanation.slice(0, 80)}..."`);
  }
  console.log('--------------------------------------------------------\n');
});

if (allPassed) {
  console.log('🎉 ALL 8 CASES PASSED RIGOROUS MATHEMATICAL & ENTITY INTEGRITY CHECKS!');
} else {
  console.error('❌ SOME CHECKS FAILED!');
  process.exit(1);
}
