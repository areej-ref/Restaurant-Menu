import {Component, OnInit} from '@angular/core';
import {ConfigService} from '../../services/config.service';
import {ApplicationStateService} from '../../services/application-state.service';
import {ConfirmationService} from 'primeng/api';
import {MenuItem, TreeNode} from 'primeng/api';
import {TreeDragDropService} from 'primeng/api';
import {MessageService} from 'primeng/api';


@Component({
  templateUrl: './home.component.html',
  providers: [TreeDragDropService, MessageService, ConfirmationService],
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  constructor(
    public applicationStateService: ApplicationStateService,
    private configService: ConfigService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService) {
  }

  nodes: TreeNode[] = [];
  level: number = 3
  isEdit: boolean = false;
  isAddNew: boolean = false;
  isAddChild: boolean = false;
  isDelete: boolean = false
  displayForm: boolean = false;
  selectedNode: TreeNode = {};
  items: MenuItem[] = [
    {label: 'Add', icon: 'pi pi-pencil', command: () => this.AddNewChild()},
    {label: 'Edit', icon: 'pi pi-pencil', command: () => this.viewNode()},
    {label: 'delete', icon: 'pi pi-close', command: () => this.deleteNode()}
  ];

  ngOnInit() {
    this.nodes = this.configService.get('nodes')
  }

  deleteNode() {
    let result = false
    this.confirmationService.confirm({
      message: 'Do you want to delete this node?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.isDelete = true
        this.isAddChild = false
        this.isAddNew = false
        this.isEdit = false
        for (let i = 0; i < this.nodes.length; i++) {
          if (this.nodes[i].key === this.selectedNode.key) this.nodes.splice(i, 1)
          else if (this.nodes[i].children) this.setChildNode(<any>this.nodes[i].children, {key: this.selectedNode.key}).then(res => {
            result = res
          })
          if (result) break;
        }
        this.configService.save('nodes', this.nodes)
        this.messageService.add({severity: 'info', summary: 'Confirmed', detail: 'Record deleted'});
      },
      reject: () => {
        this.messageService.add({severity: 'info', summary: 'Rejected', detail: 'You have rejected'});
      }
    });
  }

  saveNode(data: any) {
    let result = false
    let newNode: TreeNode = {}
    if (this.isEdit && data.name) {
      for (let i = 0; i < this.nodes.length; i++) {
        if (this.nodes[i].key === this.selectedNode.key) {
          this.nodes[i].label = data.name
          if (this.nodes[i].data) this.nodes[i].data = data.url
        }
        else if (this.nodes[i].children) this.setChildNode(<any>this.nodes[i].children, data).then(res => {
          result = res
        })
        if (result) break;
      }
    } else {
      newNode.label = data.name
      if (data.isParent) {
        newNode.expandedIcon = "pi pi-folder-open"
        newNode.collapsedIcon = "pi pi-folder"
        newNode.children = []
      } else {
        newNode.icon = "pi pi-heart"
        newNode.data = data.url
        newNode.type = "url"
      }
    }
    if (this.isAddChild && newNode.label) {
      for (let i = 0; i < this.nodes.length; i++) {
        if (this.nodes[i].key === this.selectedNode.key) {
          if (this.nodes[i].children) { // @ts-ignore
            newNode.key = (this.nodes[i].key + '-' + (this.nodes[i].children.length - 1).toString())
            // @ts-ignore
            this.nodes[i].children.push(newNode)
          }
        } else if (this.nodes[i].children) this.setChildNode(<any>this.nodes[i].children, newNode).then(res => {
          result = res
        })
        if (result) break;
      }
    } else if (this.isAddNew && newNode.label) {
      newNode.key = (this.nodes.length - 1).toString()
      this.nodes.push(newNode)
      result = true
    } else result = false

    if (result) {
      this.configService.save('nodes', this.nodes)
      this.messageService.add({severity: 'info', summary: 'Successfully', detail: 'Saved successfully'});
      this.selectedNode = {}
    }
  }

  private async setChildNode(nodes: Array<any>, data: any) {
    let result = false
    for (let i = 0; i < nodes.length; i++) {console.log(nodes[i].key , this.selectedNode.key)
      if (nodes[i].key === this.selectedNode.key) {
        if (this.isEdit) {
          nodes[i].label = data.name
          if (nodes[i].data) nodes[i].data = data.url
        }
        else if (this.isDelete) nodes.splice(i, 1)
        else if (this.isAddNew || this.isAddChild) {
          if (nodes[i].children && data) {
            data.key = (nodes[i].key + '-' + (nodes[i].children.length - 1).toString())
            nodes[i].children.push(data)
          }
        }
        result = true
        break;
      } else if (nodes[i].children) {
        let res = await this.setChildNode(nodes[i].children, data)
        if (res) break;
      }
    }
    return result;
  }

  expandNode(data: any) {
    data.node.expanded = !!data.node.key && (data.node.key.match(/-/g) || []).length + 1 < this.level;
  }

  expandAll() {
    this.nodes.forEach(node => {
      this.expandRecursive(node, true);
    });
  }

  collapseAll() {
    this.nodes.forEach(node => {
      this.expandRecursive(node, false);
    });
  }

  private expandRecursive(node: TreeNode, isExpand: boolean) {
    if (!!node.key && (node.key.match(/-/g) || []).length + 1 < this.level) {
      node.expanded = isExpand;
      if (node.children) {
        node.children.forEach(childNode => {
          this.expandRecursive(childNode, isExpand);
        });
      }
    }
  }

  setLevel(level: number) {
    this.level = level
  }

  closeDialog() {
    this.displayForm = false
    this.isEdit = false
  }

  viewNode() {
    this.isEdit = true
    this.isAddNew = false
    this.isDelete = false
    this.isAddChild = false
    this.displayForm = true
  }

  AddNewNode() {
    this.isAddNew = true
    this.isEdit = false
    this.isDelete = false
    this.isAddChild = false
    this.displayForm = true
  }

  AddNewChild() {
    this.isAddChild = true
    this.isAddNew = false
    this.isEdit = false
    this.isDelete = false
    this.displayForm = true
  }
}
