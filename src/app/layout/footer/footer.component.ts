import { Component, Inject, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  // actualYear: number = (new Date()).getFullYear();
  environmentName: string = '';
  
  constructor(
    @Inject('ENVIRONMENT_NAME') environmentName: string,
  ) {
    this.environmentName = environmentName;
  }

  ngOnInit(): void {
  }

  getFooterText() {
    return `Desarrollado por: @goncxjo`
  }

}
