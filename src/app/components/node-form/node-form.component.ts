import {Component, Input, EventEmitter, Output} from '@angular/core';
import {TreeNode} from "primeng/api";

@Component({
  selector: 'app-node-form',
  templateUrl: './node-form.component.html',
  styleUrls: ['./node-form.component.scss']
})
export class NodeFormComponent {
  constructor() { }

  name: string | undefined = '';
  url: string | undefined = '';
  isParent: boolean | undefined = false

  @Input() isEdit: boolean = false;
  @Input() isNew: boolean = false;
  @Input() display: boolean = false;
  @Input() set node(value: TreeNode) {
    this.name = value.label
    this.isParent = !!(value.children)
    this.url = value.data
  }

  @Output() close = new EventEmitter<string>();
  @Output() input = new EventEmitter<any>();

  closeDialog() {
    this.display = false;
    this.close.emit();
  }

  save() {
    if (this.isNew) this.isParent = true
    this.input.emit({name: this.name, url: this.url, isParent: this.isParent})
  }
}
