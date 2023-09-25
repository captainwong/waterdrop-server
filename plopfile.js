const path = require('path');

module.exports = (plop) => {
  plop.setGenerator('module', {
    description: 'Create a new module with service, resolver, and DTOs',
    prompts: [
      // yarn plop
      {
        type: 'input',
        name: 'name',
        message: '请输入模型的名字',
      },
    ],
    actions: [
      {
        type: 'add',
        path: path.join(
          __dirname,
          'src/modules/{{kebabCase name}}/{{kebabCase name}}.module.ts',
        ),
        templateFile: path.join(
          __dirname,
          'plopTemplates/module/module.module.hbs',
        ),
      },
      {
        type: 'add',
        path: path.join(
          __dirname,
          'src/modules/{{kebabCase name}}/{{kebabCase name}}.service.ts',
        ),
        templateFile: path.join(
          __dirname,
          'plopTemplates/module/module.service.hbs',
        ),
      },
      {
        type: 'add',
        path: path.join(
          __dirname,
          'src/modules/{{kebabCase name}}/{{kebabCase name}}.resolver.ts',
        ),
        templateFile: path.join(
          __dirname,
          'plopTemplates/module/module.resolver.hbs',
        ),
      },
      {
        type: 'add',
        path: path.join(
          __dirname,
          'src/modules/{{kebabCase name}}/dto/{{kebabCase name}}-input.dto.ts',
        ),
        templateFile: path.join(
          __dirname,
          'plopTemplates/module/dto/module-input.dto.hbs',
        ),
      },
      {
        type: 'add',
        path: path.join(
          __dirname,
          'src/modules/{{kebabCase name}}/dto/{{kebabCase name}}-type.dto.ts',
        ),
        templateFile: path.join(
          __dirname,
          'plopTemplates/module/dto/module-type.dto.hbs',
        ),
      },
      {
        type: 'add',
        path: path.join(
          __dirname,
          'src/modules/{{kebabCase name}}/dto/{{kebabCase name}}-result.ts',
        ),
        templateFile: path.join(
          __dirname,
          'plopTemplates/module/dto/module-result.hbs',
        ),
      },
      {
        type: 'add',
        path: path.join(
          __dirname,
          'src/modules/{{kebabCase name}}/entities/{{kebabCase name}}.entity.ts',
        ),
        templateFile: path.join(
          __dirname,
          'plopTemplates/module/entities/module.entity.hbs',
        ),
      },
      {
        type: 'modify',
        path: './src/app.module.ts',
        pattern: /import { Module } from '@nestjs\/common';/g,
        template:
          "import { Module } from '@nestjs/common';\nimport { {{pascalCase name}}Module } from './modules/{{kebabCase name}}/{{kebabCase name}}.module';",
      },
      {
        type: 'modify',
        path: './src/app.module.ts',
        pattern: /imports: \[([\s\S]*?)\](?=\s*,\s*controllers)/g,
        template: 'imports: [$1  {{pascalCase name}}Module,\n  ]',
      },
      {
        type: 'append',
        path: './src/common/const/code.ts',
        templateFile: path.join(__dirname, 'plopTemplates/module/code.hbs'),
      },
    ],
  });
};
