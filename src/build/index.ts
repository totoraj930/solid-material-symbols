import fs from 'fs';
import nodePath from 'path';
import { Icon, templates, TemplateType } from './template';
import { promisify } from 'util';
import { exec } from 'child_process';
import { argv } from 'process';

const execAsync = promisify(exec);

type ExportsField = Record<
  string,
  {
    browser: string;
    node: string;
    default: string;
  }
>;

const isJsonOnly = argv.includes('--json');
async function main() {
  const iconTypes = ['outlined', 'rounded', 'sharp'];
  const iconWeights = ['200', '400', '600'];

  createPackageJson(createExportsField(iconTypes, iconWeights));
  console.log(`📄 package.json has been generated ✅`);

  fs.copyFileSync(nodePath.resolve('./README.md'), nodePath.resolve('./dist/README.md'));
  console.log(`📄 README.md has been copied ✅`);

  fs.copyFileSync(nodePath.resolve('./LICENSE'), nodePath.resolve('./dist/LICENSE'));
  console.log(`📄 LICENSE has been copied ✅`);

  if (isJsonOnly) return;

  await Promise.all([execAsync('yarn build:lib', { cwd: nodePath.resolve() })]);
  console.log(`✨ Lib artifacts has been bundled ✅`);

  for (const iconType of iconTypes) {
    noErrorMkdir(DIST_ROOT, iconType);

    for (const iconWeight of iconWeights) {
      noErrorMkdir(DIST_ROOT, iconType, iconWeight);

      const svgPaths = getSvgFiles(`svg-${iconWeight}/${iconType}`);
      const icons = svgPaths.map(getIconData).flatMap((icon) => (icon === null ? [] : [icon]));

      const distDirName = `${iconType}/${iconWeight}`;
      dist('mjs', icons, distDirName);
      dist('cjs', icons, distDirName);
      dist('types', icons, distDirName);

      const exportRoot = `./${iconType}/${iconWeight}`;

      console.log(`📦 ${exportRoot} package has been generated ✅`);
    }
  }
}

const ICON_MODULE_ROOT = nodePath.resolve('./node_modules/@material-symbols');
const DIST_ROOT = nodePath.resolve('./dist');

function createExportsField(iconTypes: string[], iconWeights: string[]) {
  const exportsField: ExportsField = {
    ['.']: {
      browser: './lib/index.js',
      node: './lib/index.cjs',
      default: './lib/index.cjs',
    },
  };
  for (const iconType of iconTypes) {
    for (const iconWeight of iconWeights) {
      const exportRoot = `./${iconType}/${iconWeight}`;
      exportsField[`${exportRoot}`] = {
        browser: `${exportRoot}/index.js`,
        node: `${exportRoot}/index.cjs`,
        default: `${exportRoot}/index.cjs`,
      };
    }
  }
  return exportsField;
}

function createPackageJson(exportsField: ExportsField) {
  const packageJson = JSON.parse(
    fs.readFileSync(nodePath.resolve('./package.json'), { encoding: 'utf-8' })
  );
  delete packageJson.devDependencies;
  delete packageJson.scripts;
  delete packageJson.type;
  packageJson.exports = { ...exportsField };
  fs.writeFileSync(`${DIST_ROOT}/package.json`, JSON.stringify(packageJson, null, 2));
}

function noErrorMkdir(...paths: string[]) {
  try {
    fs.mkdirSync(nodePath.join(...paths));
    return true;
  } catch {}
  return false;
}

function dist(type: TemplateType, icons: Icon[], dirName: string) {
  const temp = templates[type];
  const text = temp.header + icons.map(temp.template).join('');
  const distPath = nodePath.join(DIST_ROOT, dirName, temp.fileName);
  fs.writeFileSync(distPath, text);
}

function getSvgFiles(dirName: string, files: string[] = []) {
  const dirPath = nodePath.join(ICON_MODULE_ROOT, dirName);
  const paths = fs.readdirSync(dirPath);

  for (let i = 0; i < paths.length; i++) {
    const name = paths[i];
    const absolutePath = nodePath.join(dirPath, name);
    const status = fs.statSync(absolutePath);
    if (status.isDirectory()) {
      console.log(absolutePath, status.isDirectory());
      files = getSvgFiles(nodePath.join(dirName, name), files);
    } else if (name.endsWith('.svg')) {
      files.push(absolutePath);
    }
  }
  return files;
}

const svgInner = /<svg.*>(.+)<\/svg>/;
const svgViewBox = /<svg.*?viewBox="([0-9\s]+?)"/;
function getIconData(svgPath: string): Icon | null {
  const svgText = fs.readFileSync(svgPath, { encoding: 'utf-8' });
  const viewBox = svgText.match(svgViewBox)?.[1];
  const contents = svgText.match(svgInner)?.[1];
  if (!viewBox || !contents) return null;

  const name = snakeToCamel(nodePath.basename(svgPath), 'Ms').replace('.svg', '');
  return {
    name,
    tags: { viewBox },
    contents,
  };
}

function snakeToCamel(text: string, prefix: string = '') {
  return (
    prefix +
    text
      .toLowerCase()
      .replace(/[_-][a-z]/g, (g) => g.replace(/[_-]/, '').toUpperCase())
      .replace(/^[a-z]/, (g) => (prefix.length === 0 ? g : g.toUpperCase()))
  );
}

main();
