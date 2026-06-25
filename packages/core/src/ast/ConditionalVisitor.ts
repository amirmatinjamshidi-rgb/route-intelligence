import type { Condition, SourceLocation } from '@route-intelligence/shared';
import type { ConditionalBlock } from '@route-intelligence/shared';
import { Node, type SourceFile } from 'ts-morph';

function toLoc(node: Node, filePath: string): SourceLocation {
  return {
    filePath,
    line: node.getStartLineNumber(),
    column: 1,
  };
}

function inferConditionKind(expression: string): Condition['kind'] {
  const lower = expression.toLowerCase();
  if (lower.includes('auth') || lower.includes('session')) return 'auth';
  if (lower.includes('role')) return 'role';
  if (lower.includes('permission')) return 'permission';
  if (lower.includes('feature') || lower.includes('flag')) return 'feature-flag';
  if (lower.includes('subscription') || lower.includes('plan')) return 'subscription';
  if (lower.includes('cookie')) return 'cookie';
  if (lower.includes('header')) return 'header';
  if (lower.includes('locale')) return 'locale';
  if (lower.includes('process.env')) return 'env';
  if (lower.includes('searchparams')) return 'search-param';
  return 'unknown';
}

function expressionToConditions(expression: string, negated = false): Condition[] {
  return [
    {
      kind: inferConditionKind(expression),
      expression,
      negated,
      confidence: 'inferred',
    },
  ];
}

export function extractConditionalBlocks(
  sourceFile: SourceFile,
  filePath: string,
): ConditionalBlock[] {
  const blocks: ConditionalBlock[] = [];

  sourceFile.forEachDescendant((node) => {
    if (Node.isIfStatement(node)) {
      const expr = node.getExpression().getText();
      blocks.push({
        expression: expr,
        conditions: expressionToConditions(expr),
        loc: toLoc(node, filePath),
      });
    }

    if (Node.isSwitchStatement(node)) {
      const expr = node.getExpression().getText();
      blocks.push({
        expression: expr,
        conditions: expressionToConditions(expr),
        loc: toLoc(node, filePath),
      });
    }

    if (Node.isConditionalExpression(node)) {
      const expr = node.getCondition().getText();
      blocks.push({
        expression: expr,
        conditions: expressionToConditions(expr),
        loc: toLoc(node, filePath),
      });
    }
  });

  return blocks;
}

export function mergeConditions(...groups: Condition[][]): Condition[] {
  const seen = new Set<string>();
  const merged: Condition[] = [];

  for (const group of groups) {
    for (const cond of group) {
      const key = `${cond.kind}:${cond.expression}:${cond.negated}`;
      if (!seen.has(key)) {
        seen.add(key);
        merged.push(cond);
      }
    }
  }

  return merged;
}
