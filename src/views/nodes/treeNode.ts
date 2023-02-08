import path = require('path');
import { commands, ThemeColor, ThemeIcon, TreeItem, TreeItemCollapsibleState, Uri } from 'vscode';

export const enum TreeNodeIcon {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    Error = 'error',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    Warning = 'warning',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    Success = 'success',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    Unknown = 'unknown',
}

/**
 * Defines tree view item base class used by all OCM tree views.
 */
export class TreeNode extends TreeItem {
    /**
     * resource.
     */
    resource?: any;

    /**
     * Reference to the parent node (if exists).
     */
    parent: TreeNode | undefined;

    /**
     * Reference to all the child nodes.
     */
    children: TreeNode[] = [];

    /**
     * Creates new tree node.
     * @param label Tree node label
     */
    constructor(label: string, description?: string, resource?: any,componentDescriptor?: string,objType?:string) {
        super(label, TreeItemCollapsibleState.None);
    }

    /**
     * Collapses tree node and hides its children.
     */
    makeCollapsible() {
        this.collapsibleState = TreeItemCollapsibleState.Collapsed;
    }

    /**
     * Expands a tree node and shows its children.
     */
    expand() {
        this.collapsibleState = TreeItemCollapsibleState.Expanded;
    }

    /**
     * Sets tree view item icon.
     *
     * When passing a string - pick an item from a
     * relative file path `resouces/icons/(dark|light)/${icon}.svg`
     * @param icon Theme icon, uri or light/dark svg icon path.
     */
    setIcon(icon: string | ThemeIcon | Uri | TreeNodeIcon) {
        if (icon === TreeNodeIcon.Error) {
            this.iconPath = new ThemeIcon('error', new ThemeColor('editorError.foreground'));
        } else if (icon === TreeNodeIcon.Warning) {
            this.iconPath = new ThemeIcon('warning', new ThemeColor('editorWarning.foreground'));
        } else if (icon === TreeNodeIcon.Success) {
            this.iconPath = new ThemeIcon('pass', new ThemeColor('terminal.ansiGreen'));
        } else if (icon === TreeNodeIcon.Unknown) {
            this.iconPath = new ThemeIcon('circle-large-outline');
        } else if (typeof icon === 'string') {
            this.iconPath = {
                light: path.join(`resources/icons/light/${icon}.svg`),
                dark: path.join(`resources/icons/dark/${icon}.svg`),
            };
        } else {
            this.iconPath = icon;
        }
    }

    /**
     * Add new tree view item to the children collection.
     * @param child Child tree view item to add.
     * @returns Updated tree view item with added child.
     */
    addChild(child: TreeNode) {
        this.children.push(child);
        child.parent = this;
        if (this.children.length) {
            // update collapse/expand state
            if (this.collapsibleState !== TreeItemCollapsibleState.Expanded) {
                this.makeCollapsible();
            }
        }
        return this;
    }

    // @ts-ignore
    get command(): Command | undefined {
        return {
            command: "ocm-tools.open",
            arguments: [],
            title: 'View Resource',
        };
    }
}
