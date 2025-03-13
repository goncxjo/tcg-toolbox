import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CardSearchModalComponent } from '../../components/cards/card-search-modal/card-search-modal.component';
import { Router } from '@angular/router';
import { ToolService } from './tool.service';
import { SidebarService } from './sidebar.service';

@Injectable({
    providedIn: 'root'
})
export class CardSearchService {

    constructor(
    private router: Router,
    private modalService: NgbModal,
    private toolService: ToolService,
    private sidebarService: SidebarService
  ) { }

    openCardSearchModal() {
        const modalRef = this.modalService.open(CardSearchModalComponent, {
            size: 'lg',
            scrollable: true,
            modalDialogClass: 'card-search-modal-height'
        });

        modalRef.result.then((result: string) => {
            this.sidebarService.expand();
            if (result == "new") {
                this.router.navigate([this.toolService.getSelectedToolPath(),'card-lists', 'new']);
            }
        })
    }
}
