import * as vscode from 'vscode';
import { WorkspaceStorage } from './utils/workspace-storage';
import { ConnectProvider } from '@/features/connect/provider/connect-provider';
import { DatabaseProvider } from '@/features/database/provider/database-provider';
import { SupabaseApi } from '@/features/database/classes/supabase-api';
import { registerCommands } from '@/register';
import { createChatRequestHandler } from './utils/chatRequestHandler';

export function activate(context: vscode.ExtensionContext) {
  const workspaceStorage = new WorkspaceStorage(context);
  const supabase = new SupabaseApi();
  const connectSupabaseProvider = new ConnectProvider();
  const databaseProvider = new DatabaseProvider(context, supabase);

  const connectSupabaseView = vscode.window.createTreeView('connectSupabase', {
    treeDataProvider: connectSupabaseProvider
  });
  const databaseView = vscode.window.createTreeView('database', {
    treeDataProvider: databaseProvider
  });
  registerCommands({
    databaseProvider,
    workspaceStorage,
    supabase
  });

  //it's important to use an inline callback here due to scoping issues.
  //setting the handler to pg.handle would not work as "this" would not
  //be set right.
  const participant = vscode.chat.createChatParticipant('supabase.clippy', createChatRequestHandler(supabase));

  context.subscriptions.push(participant, connectSupabaseView, databaseView);
}
