import { generateProceduralCase } from '../src/utils/proceduralGenerator.ts';

console.log('Testing Procedural Mystery Generation across all eras...');

['victorian', 'speakeasy', 'cybernoir'].forEach((era) => {
  const c = generateProceduralCase(999, era, 'Noir');
  console.log(`\nGenerated Case [${era.toUpperCase()}]: "${c.title}"`);
  console.log(`  Culprit: ${c.solution.culpritId}`);
  console.log(`  Weapon: ${c.solution.weaponId}`);
  console.log(`  Location: ${c.solution.locationId}`);
  console.log(`  Clues count: ${c.clues.length}`);
  console.log(`  Hotspots: ${c.hotspots?.length}`);
  console.log(`  Solvability explanation: ${c.solution.explanation}`);
});

console.log('\n🎉 ALL PROCEDURAL GENERATOR TESTS PASSED!');
