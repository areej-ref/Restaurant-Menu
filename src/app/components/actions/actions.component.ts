import { Component, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss']
})
export class ActionsComponent {
  constructor() { }

  level: number = 3

  @Output() expand = new EventEmitter<string>();
  @Output() collapse = new EventEmitter<string>();
  @Output() showDialog = new EventEmitter<string>();
  @Output() levelChanged = new EventEmitter<number>();

  expandAll() {
    this.expand.emit();
  }
  collapseAll() {
    this.collapse.emit();
  }
  openDialog() {
    this.showDialog.emit();
  }
  setLevel(val: number) {
    this.level = val
    this.levelChanged.emit(val);
  }
}
