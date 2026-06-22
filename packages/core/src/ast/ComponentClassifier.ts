import type { SourceFile } from 'ts-morph';

export function isClientComponent(sourceFile: SourceFile): boolean {
  const statements = sourceFile.getStatements();
  for (const stmt of statements.slice(0, 5)) {
    const text = stmt.getText().trim();
    if (text === "'use client'" || text === '"use client"') return true;
    if (!text.startsWith("'use ") && !text.startsWith('"use ')) break;
  }
  return false;
}

export function isServerComponent(sourceFile: SourceFile): boolean {
  return !isClientComponent(sourceFile);
}

export function hasUseServerDirective(sourceFile: SourceFile): boolean {
  const statements = sourceFile.getStatements();
  for (const stmt of statements.slice(0, 5)) {
    const text = stmt.getText().trim();
    if (text === "'use server'" || text === '"use server"') return true;
  }
  return false;
}
