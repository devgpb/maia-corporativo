import { Component, Input } from '@angular/core';
import { toCanvas } from 'qrcode';
import * as html2pdf from 'html2pdf.js';

@Component({
  selector: 'app-qr-code-modal',
  templateUrl: './qr-code-modal.component.html',
  styleUrls: ['./qr-code-modal.component.scss']
})
export class QrCodeModalComponent {
  @Input() link: string = '';
  @Input() label: string = '';

  qrCodeUrl: string = '';
  ngOnChanges() {
    if (this.link) {
      this.generateQrCode();
    }
  }

  generateQrCode() {
    const canvas = document.createElement('canvas');
    toCanvas(canvas, this.link, { width: 300 }, (error) => {
      if (!error) {
        this.qrCodeUrl = canvas.toDataURL();
      }
    });
  }

  downloadQrCode() {
    const link = document.createElement('a');
    link.href = this.qrCodeUrl;
    link.download = 'qrcode.png';
    link.click();
  }

  downloadPdf() {
    const element = document.querySelector('.qr-modal-content') as HTMLElement;


    const options = {
      margin: 1,
      filename: 'QR_Code_Details.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().from(element).set(options).save().finally(() => {
      // Remove a classe após gerar o PDF
      element.classList.remove('no-buttons');
    });
  }
}
