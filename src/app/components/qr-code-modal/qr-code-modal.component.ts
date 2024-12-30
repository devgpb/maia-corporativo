import { Component, Input } from '@angular/core';
import { toCanvas } from 'qrcode';

@Component({
  selector: 'app-qr-code-modal',
  templateUrl: './qr-code-modal.component.html',
  styleUrls: ['./qr-code-modal.component.scss']
})
export class QrCodeModalComponent {
  @Input() link: string = '';
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
}
