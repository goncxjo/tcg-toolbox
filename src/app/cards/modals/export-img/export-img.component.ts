import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Card, Dolar } from 'src/app/backend';
import * as download from 'downloadjs';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-export-img',
  templateUrl: './export-img.component.html',
  styleUrls: ['./export-img.component.scss']
})
export class ExportImgComponent implements OnInit, AfterViewInit {

  @ViewChild('content') content!: ElementRef;

  form = this.buildForm();

  cards: Card[] = [];
  dolar!: Dolar;
  actualDate: Date = new Date();

  precioTotal: number = 0;
  precioTotalUSD: number = 0;

  selectedCurrency = 'ARS';
  mostrarPrecios: boolean = true;
  
  colExport: number = 3;
  cardHeight: string = `calc(88px * ${this.colExport})`;
  cardWidth: string = `calc(64px * ${this.colExport})`;
  
  descargandoFoto: boolean = false;
  capturarFoto: boolean = false;

  constructor(
    private modalService: NgbActiveModal,
    private formBuilder: FormBuilder,
    private renderer: Renderer2,
  ) { }
  
  ngOnInit(): void {
    this.cards.forEach(card => {
      if (!card.image_base64) {
        this.getBase64ImageFromUrl(card.image_url)
        .then(result => {
          card.image_base64 = result as Blob
        })
        .catch(err => console.error(err)); 
      }
    }); 
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.form.get('currency')?.setValue(this.selectedCurrency);
      this.form.get('showCurrency')?.setValue(this.mostrarPrecios);
    }, 0);
  }

  get formFields() {
    return this.form.controls;
  }

  private buildForm(): FormGroup {
    return this.formBuilder.group({
      currency: [''],
      showCurrency: ['']
    });
  }


  dismiss(reason?: string) {
    this.modalService.dismiss(reason)
  }

  close(response: string): void {
    this.descargandoFoto = false;
    this.capturarFoto = false;
    this.modalService.close(response)
  }

  getPrecio(c: Card) {
    var price = c.price.currency_value;
    if (this.selectedCurrency == 'ARS') {
      return price;
    }
    return this.getPrecioUSD(price);
  }

  getPrecioUSD(price: number) {
    return Math.round(price / this.dolar.venta * 100) / 100;
  }

  zoom(i: number){
    this.colExport += i;
    this.cardHeight = `calc(88px * ${this.colExport})`;
    this.cardWidth = `calc(64px * ${this.colExport})`;
  }

  onCurrencyChange(event: string) {
    this.selectedCurrency = event;
  }

  onShowCurrencyChange(event: boolean) {
    this.mostrarPrecios = event;
  }

  async download() {
    this.descargandoFoto = true;
    setTimeout(() => {
      this.handleExport();
      this.downloadImg();
      this.close('download');        
    }, 100);
  }

  async screenshot() {
    this.capturarFoto = true;
    setTimeout(() => {
      this.handleExport();
      this.copyImgToClipboard();
      this.close('screenshot');
    }, 100);
  }

  handleExport() {
    const elements2Hide: Array<Element> = this.content.nativeElement.querySelectorAll(`.screenshot-hide`);
    elements2Hide.forEach(element => {
      this.renderer.setStyle(element, 'display', 'none');
    });

    const elements2Show: Array<Element> = this.content.nativeElement.querySelectorAll(`.screenshot-show`);
    elements2Show.forEach(element => {
      this.renderer.removeClass(element, 'd-none');
    });
  } 

  private async downloadImg() {
    html2canvas(this.content.nativeElement).then((canvas) => {
      const imageData = canvas.toDataURL("image/png");
      download(imageData, `digi-calcu_${new Date().toISOString()}.png`);
    });
  }

  private async copyImgToClipboard() {
    html2canvas(this.content.nativeElement).then((canvas) => {
      canvas.toBlob((blob) => {
        const dataType = "image/png";
        if (blob) {
          const data = [new ClipboardItem({ [dataType]: blob })];
          navigator.clipboard.write(data);
        }  
      });
    });
  }

  share(type: string, data: string) {
    switch (type) {
      case 'wsp':
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(data)}`, '_blank');
        break;
      default:
        break
    }
  }

  async getBase64ImageFromUrl(imageUrl: string) {
    var url = imageUrl.replace('https://product-images.tcgplayer.com', 'tcgplayer-images');
    var res = await fetch(url);
    var blob = await res.blob();
  
    return new Promise((resolve, reject) => {
      var reader  = new FileReader();
      reader.addEventListener("load", function () {
          resolve(reader.result);
      }, false);
  
      reader.onerror = () => {
        return reject(this);
      };
      reader.readAsDataURL(blob);
    })
  }
}
