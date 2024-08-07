import { TreeItem } from '@/features/database/elements';
import { DatabaseElement, TreeElement, View } from '@/features/database/types/index';
import * as vscode from 'vscode';

export class ViewsManager {
  private views: View[];
  private context: vscode.ExtensionContext;

  constructor(views: View[], context: vscode.ExtensionContext) {
    this.views = views;
    this.context = context;
  }

  getItems(): TreeElement[] {
    return this.views.flatMap((view) => {
      if (view.schema === 'public') {
        const item = new TreeItem({
          label: view.name,
          id: String(view.id),
          context: this.context,
          contextValue: DatabaseElement.VIEWS_CHILDREN,
          iconPath: new vscode.ThemeIcon('table'),
          isChildren: true
        }) as TreeElement;

        if (view.columns.length > 0) {
          item.children = this.getViewColumns(view.columns);
        }
        return item;
      }
      return [];
    }) as TreeElement[];
  }

  getViewColumns(columns: View['columns']) {
    return columns.map(
      (column) =>
        new TreeItem({
          label: `${column.name} ${column.data_type}`,
          id: column.id,
          context: this.context,
          iconPath: new vscode.ThemeIcon('symbol-field'),
          isChildren: true
        }) as TreeElement
    );
  }
}
