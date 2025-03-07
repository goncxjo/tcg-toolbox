import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CardSearchModalComponent } from '../../components/cards/card-search-modal/card-search-modal.component';
import { Router } from '@angular/router';
import { ToolService } from './tool.service';

@Injectable({
    providedIn: 'root'
})
export class CardSearchService {

    constructor(
    private router: Router,
    private modalService: NgbModal,
    private toolService: ToolService
  ) { }

    openCardSearchModal() {
        const modalRef = this.modalService.open(CardSearchModalComponent, {
            size: 'lg',
            scrollable: true,
            modalDialogClass: 'card-search-modal-height'
        });

        modalRef.result.then((result: string) => {
            if (result == "new") {
                this.router.navigate([this.toolService.getSelectedToolPath(),'card-lists', 'new']);
            }
        })
    }
}
