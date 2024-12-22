import { Component, ElementRef, EventEmitter, HostListener, Input, Output } from "@angular/core";
import { NG_VALUE_ACCESSOR } from "@angular/forms";

@Component({
  selector: "app-file-upload",
  templateUrl: "./file-upload.component.html",
  styleUrls: ["./file-upload.component.scss"],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: FileUploadComponent,
    multi: true
  }]
})
export class FileUploadComponent {
  @Input() id: string;
  @Input() invalid: boolean = false;
  @Input() multiple: boolean = false; // Permite definir no template se aceita múltiplos arquivos
  @Output() arquivoApagado = new EventEmitter();

  public onChange: (files: File[] | null) => void;
  public onTouched: () => void;

  public files: File[] = [];

  constructor(private host: ElementRef<HTMLInputElement>) {}

  @HostListener('change', ['$event'])
  public emitFiles(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input?.files && input.files.length > 0) {
      const selectedFiles = Array.from(input.files);

      if (!this.multiple) {
        // Se for single file, considera apenas o primeiro arquivo
        this.files = [selectedFiles[0]];
      } else {
        this.files = selectedFiles;
      }

      if (this.onChange) {
        this.onChange(this.files);
      }
    }
  }

  public writeValue(value: File[] | null) {
    this.host.nativeElement.value = "";
    this.files = value || [];
  }

  public registerOnChange(fn: (files: File[] | null) => void) {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void) {
    this.onTouched = fn;
  }

  public onDrop(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(event.dataTransfer.files);
      if (!this.multiple) {
        this.files = [droppedFiles[0]];
      } else {
        this.files = droppedFiles;
      }

      if (this.onChange) {
        this.onChange(this.files);
      }
    }
  }

  public onDragOver(event: DragEvent) {
    event.stopPropagation();
    event.preventDefault();
  }

  public removeFile(index: number) {
    this.files.splice(index, 1);
    if (this.onChange) {
      this.onChange(this.files.length > 0 ? this.files : null);
    }
    this.arquivoApagado.emit();
  }
}
