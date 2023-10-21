import { execaCommand } from 'execa'
import { readFile, readdir, rm, writeFile } from 'node:fs/promises'
import path, { basename, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')

const REPO = 'https://github.com/hashicorp/syntax'
const COMMIT = 'd3a15216cf0b08351cbc4fc7bc5beb5b8304b161'

const getTestName = (baseName) => {
  return (
    'hashicorp-syntax-' +
    baseName
      .toLowerCase()
      .trim()
      .replaceAll(' ', '-')
      .replaceAll('/', '-')
      .replaceAll(',', '')
      .replaceAll('_', '-')
  )
}

const getAllTests = async (folder) => {
  const allTests = []
  const testPath = join(folder, 'tests', 'snapshot', 'terraform')
  const dirents = await readdir(testPath)
  for (const dirent of dirents) {
    if (!dirent.endsWith('.tf')) {
      continue
    }
    const absolutePath = join(testPath, dirent)
    const testContent = await readFile(absolutePath, 'utf8')
    const testName = getTestName(dirent)
    allTests.push({
      testName,
      testContent,
    })
  }
  return allTests
}

const writeTestFiles = async (allTests) => {
  for (const test of allTests) {
    await writeFile(`${root}/test/cases/${test.testName}`, test.testContent)
  }
}

const main = async () => {
  process.chdir(root)
  await rm(`${root}/.tmp`, { recursive: true, force: true })
  await execaCommand(`git clone ${REPO} .tmp/hashicorp-syntax`, {
    stdio: 'inherit',
  })
  process.chdir(`${root}/.tmp/hashicorp-syntax`)
  await execaCommand(`git checkout ${COMMIT}`)
  process.chdir(root)
  const allTests = await getAllTests(`${root}/.tmp/hashicorp-syntax`)
  await writeTestFiles(allTests)
}

main()
