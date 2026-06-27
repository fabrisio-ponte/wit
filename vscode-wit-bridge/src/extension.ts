import * as vscode from 'vscode';

function getCliPath(): string {
  const cfg = vscode.workspace.getConfiguration('wit');
  return cfg.get<string>('cliPath', './wit');
}

async function getWorkspaceRoot(): Promise<string | undefined> {
  const current = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
  if (current) {
    return current;
  }

  const picked = await vscode.window.showOpenDialog({
    canSelectFiles: false,
    canSelectFolders: true,
    canSelectMany: false,
    openLabel: 'Use this workspace folder'
  });

  return picked?.[0]?.fsPath;
}

function quoteArg(value: string): string {
  return `'${value.replace(/'/g, `'"'"'`)}'`;
}

function runInTerminal(command: string): void {
  const terminal = vscode.window.createTerminal({ name: 'wit' });
  terminal.show(true);
  terminal.sendText(command, true);
}

export function activate(context: vscode.ExtensionContext): void {
  const startSession = vscode.commands.registerCommand('wit.startSession', async () => {
    const root = await getWorkspaceRoot();
    if (!root) {
      void vscode.window.showErrorMessage('No workspace selected.');
      return;
    }

    const slug = await vscode.window.showInputBox({
      prompt: 'Session slug',
      placeHolder: 'auth-flow'
    });

    if (!slug) {
      return;
    }

    const tagsInput = await vscode.window.showInputBox({
      prompt: 'Tags (space-separated, optional)',
      placeHolder: 'backend jwt'
    });

    const tags = tagsInput?.trim() ? ` ${tagsInput.trim()}` : '';
    const cli = getCliPath();
    const cmd = `cd ${quoteArg(root)} && ${cli} new ${quoteArg(slug)}${tags}`;
    runInTerminal(cmd);
  });

  const recordEvent = vscode.commands.registerCommand('wit.recordEvent', async () => {
    const root = await getWorkspaceRoot();
    if (!root) {
      void vscode.window.showErrorMessage('No workspace selected.');
      return;
    }

    const event = await vscode.window.showQuickPick([
      'file.change',
      'test.pass',
      'test.fail',
      'build.pass',
      'build.fail',
      'note'
    ], {
      placeHolder: 'Select event type'
    });

    if (!event) {
      return;
    }

    const value = await vscode.window.showInputBox({
      prompt: 'Event value (optional)',
      placeHolder: 'src/app.ts or short note'
    });

    const cli = getCliPath();
    const cmd = value?.trim()
      ? `cd ${quoteArg(root)} && ${cli} event ${quoteArg(event)} ${quoteArg(value.trim())}`
      : `cd ${quoteArg(root)} && ${cli} event ${quoteArg(event)}`;

    runInTerminal(cmd);
  });

  const openCommit = vscode.commands.registerCommand('wit.openCommit', async () => {
    const root = await getWorkspaceRoot();
    if (!root) {
      void vscode.window.showErrorMessage('No workspace selected.');
      return;
    }

    const cli = getCliPath();
    runInTerminal(`cd ${quoteArg(root)} && ${cli} commit`);
  });

  const showStatus = vscode.commands.registerCommand('wit.showStatus', async () => {
    const root = await getWorkspaceRoot();
    if (!root) {
      void vscode.window.showErrorMessage('No workspace selected.');
      return;
    }

    const cli = getCliPath();
    runInTerminal(`cd ${quoteArg(root)} && ${cli} status`);
  });

  context.subscriptions.push(startSession, recordEvent, openCommit, showStatus);
}

export function deactivate(): void {
  // no-op
}
