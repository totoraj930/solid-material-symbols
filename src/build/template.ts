export type Icon = {
  name: string;
  tags: { viewBox: string };
  contents: string;
};

export type TemplateType = 'cjs' | 'mjs' | 'types';

type Template<T extends TemplateType> = {
  type: T;
  template: (icon: Icon) => string;
  header: string;
  fileName: string;
};

type TemplateMap = {
  [K in TemplateType]: Template<K>;
};
export const templates: TemplateMap = {
  cjs: {
    type: 'cjs',
    template: cjsTemplate,
    header: `var IconTemplate = require('../../lib/index.cjs').IconTemplate;\n`,
    fileName: 'index.cjs',
  },
  mjs: {
    type: 'mjs',
    template: moduleTemplate,
    header: `import { IconTemplate } from '../../lib/index.js';\n`,
    fileName: 'index.js',
  },
  types: {
    type: 'types',
    template: typesTemplate,
    header: `import type { IconTypes } from '../../lib/index';\n`,
    fileName: 'index.d.ts',
  },
};

function cjsTemplate(icon: Icon) {
  return [
    `module.exports.${icon.name}=function ${icon.name}(props){`,
    `return IconTemplate({a:${JSON.stringify(icon.tags)},c:'${icon.contents}'}, props)`,
    `}\n`,
  ].join('');
}

function moduleTemplate(icon: Icon) {
  return [
    `export function ${icon.name}(props){`,
    `return IconTemplate({a:${JSON.stringify(icon.tags)},c:'${icon.contents}'}, props)`,
    `}\n`,
  ].join('');
}

function typesTemplate(icon: Icon) {
  return `\nexport declare const ${icon.name}: IconTypes;`;
}
