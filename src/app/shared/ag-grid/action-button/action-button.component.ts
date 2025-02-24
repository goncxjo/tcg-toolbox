import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEye, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';

import type { ICellRendererAngularComp } from 'ag-grid-angular';
import type { ICellRendererParams } from 'ag-grid-community';

@Component({
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [FontAwesomeModule],
    templateUrl: './action-button.component.html',
    styleUrl: './action-button.component.scss',
})
export class ActionButtonComponent implements ICellRendererAngularComp {
    params!: any;
    viewBtn: any;
    editBtn: any;
    deleteBtn: any;
    viewIcon = faEye;
    editIcon = faPen;
    deleteIcon = faTrash;
    
    agInit(params: ICellRendererParams): void {
        this.params = params;
        this.viewBtn = this.params.viewBtn || null;
        this.editBtn = this.params.editBtn || null;
        this.deleteBtn = this.params.deleteBtn || null;
    }

    refresh(params: ICellRendererParams) {
        return true;
    }
    
    onView($event: any) {
        if (this.params.onView instanceof Function) {
          const params = {
            event: $event,
            rowData: this.params.node.data
          }
          this.params.onView(params);
        }
      }

    onEdit($event: any) {
        if (this.params.onEdit instanceof Function) {
          const params = {
            event: $event,
            rowData: this.params.node.data
          }
          this.params.onEdit(params);
        }
      }

    onDelete($event: any) {
        if (this.params.onDelete instanceof Function) {
          const params = {
            event: $event,
            rowData: this.params.node.data
          }
          this.params.onDelete(params);
        }
      }
}