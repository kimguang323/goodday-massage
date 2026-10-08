import fs from 'node:fs'
import assert from 'node:assert/strict'
const areas = JSON.parse(fs.readFileSync('src/data/neighborhoods.json', 'utf8'))
assert.equal(Object.keys(areas).length, 174)
for (const [key, area] of Object.entries(areas)) {
  const html = fs.readFileSync(`.next/server/app/cities/${key}.html`, 'utf8')
  assert.ok(html.includes('id="neighborhood-guide"'), key)
  assert.equal((html.match(/<h1[ >]/g) ?? []).length, 1, key)
  for (const group of area.groups) {
    assert.equal(new Set(group.names).size, group.names.length, key)
    for (const name of group.names) assert.ok(html.includes(name), `${key}: ${name}`)
  }
}
assert.equal(areas['서울/강남구'].groups[0].names.length, 22)
assert.ok(areas['전남/나주'].groups.some(g => g.names.includes('빛가람동')))
assert.ok(areas['인천/강화군'].groups.some(g => g.names.includes('강화읍')))
console.log('Passed: 174 generated pages contain their local administrative areas, one H1, and the neighborhood section.')
