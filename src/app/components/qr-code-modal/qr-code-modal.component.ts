import { Component, ElementRef, Input, ViewChild } from '@angular/core';
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
  @Input() text: string = '';

  @ViewChild('qrTemplate', { static: false }) qrTemplate!: ElementRef;
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
    if (!this.qrTemplate) return;

    const element = this.qrTemplate.nativeElement;
    const options = {
      margin: 12,
      filename: 'QR_Code_Template.pdf',
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().from(element).set(options).save();
  }
}
