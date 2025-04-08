import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CardSearchModalComponent } from '../../components/cards/card-search-modal/card-search-modal.component';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class CardSearchService {

    constructor(
    private router: Router,
    private modalService: NgbModal
  ) { }

    openCardSearchModal() {
        window.history.pushState(window.history.state, "modalOpened", `${window.document.URL}/#`);

        const modalRef = this.modalService.open(CardSearchModalComponent, {
            size: 'lg',
            scrollable: true,
            modalDialogClass: 'card-search-modal-height'
        });

        modalRef.result.then((result: string) => {
            if (result == "new") {
                this.router.navigate(['price-calc']);
            }
        })
    }
}
