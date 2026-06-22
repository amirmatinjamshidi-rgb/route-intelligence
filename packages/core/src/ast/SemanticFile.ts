import { Node, type SourceFile } from 'ts-morph';
import type {
  ComponentDeclaration,
  SemanticExport,
  SemanticFile,
  SemanticImport,
} from '@route-intelligence/shared';
import { isClientComponent, isServerComponent } from './ComponentClassifier.js';
import { extractConditionalBlocks } from './ConditionalVisitor.js';
import {
  extractJsxLinks,
  extractNavigationCalls,
  extractWindowLocationAssignments,
  extractWindowOpenCalls,
} from './NavigationVisitor.js';

function extractImports(sourceFile: SourceFile, filePath: string): SemanticImport[] {
  const imports: SemanticImport[] = [];

  for (const imp of sourceFile.getImportDeclarations()) {
    const moduleSpecifier = imp.getModuleSpecifierValue();
    const namedImports = imp.getNamedImports().map((n) => n.getName());
    const defaultImport = imp.getDefaultImport()?.getText();

    imports.push({
      moduleSpecifier,
      namedImports,
      defaultImport,
      loc: { filePath, line: imp.getStartLineNumber(), column: 1 },
    });
  }

  return imports;
}

function extractExports(sourceFile: SourceFile, filePath: string): SemanticExport[] {
  const exports: SemanticExport[] = [];

  for (const [name, decls] of sourceFile.getExportedDeclarations()) {
    const firstDecl = decls[0];
    if (firstDecl && typeof firstDecl !== 'string' && 'getStartLineNumber' in firstDecl) {
      exports.push({
        name,
        isDefault: false,
        loc: { filePath, line: firstDecl.getStartLineNumber(), column: 1 },
      });
    }
  }

  const defaultExport = sourceFile.getDefaultExportSymbol();
  if (defaultExport) {
    exports.push({
      name: 'default',
      isDefault: true,
      loc: { filePath, line: 1, column: 1 },
    });
  }

  return exports;
}

function extractComponents(sourceFile: SourceFile, filePath: string): ComponentDeclaration[] {
  const components: ComponentDeclaration[] = [];

  for (const fn of sourceFile.getFunctions()) {
    const name = fn.getName();
    if (name && /^[A-Z]/.test(name)) {
      components.push({
        name,
        isDefault: fn.isDefaultExport(),
        loc: { filePath, line: fn.getStartLineNumber(), column: 1 },
      });
    }
  }

  for (const stmt of sourceFile.getVariableStatements()) {
    for (const decl of stmt.getDeclarations()) {
      const name = decl.getName();
      if (/^[A-Z]/.test(name)) {
        const init = decl.getInitializer();
        if (
          init &&
          (Node.isArrowFunction(init) ||
            Node.isFunctionExpression(init) ||
            Node.isCallExpression(init))
        ) {
          components.push({
            name,
            isDefault: stmt.isDefaultExport(),
            loc: { filePath, line: decl.getStartLineNumber(), column: 1 },
          });
        }
      }
    }
  }

  return components;
}

export function createSemanticFile(
  sourceFile: SourceFile,
  filePath: string,
  customNavigationWrappers: string[] = [],
): SemanticFile {
  const navCalls = [
    ...extractNavigationCalls(sourceFile, filePath, customNavigationWrappers),
    ...extractWindowLocationAssignments(sourceFile, filePath),
    ...extractWindowOpenCalls(sourceFile, filePath),
  ];

  const jsxLinks = extractJsxLinks(sourceFile, filePath);
  const conditionalBlocks = extractConditionalBlocks(sourceFile, filePath);
  const imports = extractImports(sourceFile, filePath);
  const exports = extractExports(sourceFile, filePath);
  const components = extractComponents(sourceFile, filePath);
  const client = isClientComponent(sourceFile);
  const server = isServerComponent(sourceFile);

  return {
    path: filePath,
    get isClientComponent() {
      return client;
    },
    get isServerComponent() {
      return server;
    },
    get exports() {
      return exports;
    },
    get imports() {
      return imports;
    },
    get components() {
      return components;
    },
    get navigationCalls() {
      return navCalls;
    },
    get jsxLinks() {
      return jsxLinks;
    },
    get conditionalBlocks() {
      return conditionalBlocks;
    },
    sourceFile,
  };
}
