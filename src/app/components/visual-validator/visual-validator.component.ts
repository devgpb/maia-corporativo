import { AfterContentInit, Component, ElementRef, Input } from "@angular/core";
import { AbstractControl, FormGroup } from "@angular/forms";

export interface IValidations {
	form: FormGroup;
	fields: {
		[field: string]: Array<{
			key: string
			message?: string
		}>
	};
}

@Component({
  selector: 'visual-validator',
  templateUrl: './visual-validator.component.html',
  styleUrls: ['./visual-validator.component.scss']
})
export class VisualValidatorComponent implements AfterContentInit {
  @Input() config: IValidations = {
    form: new FormGroup({}),
    fields: {}
  };

	@Input("field")
	public field: string ='';

	@Input("fields")
	public fields: string[] = [''];

	private inputs: HTMLElement[] = [] as HTMLElement[];

	constructor (private elementRef: ElementRef) { }

	public ngAfterContentInit () {
		const nodeList: NodeList = this.elementRef.nativeElement.childNodes;
		this.inputs = [this.elementRef.nativeElement.childNodes[0]];
		for (let i = 1; i < nodeList.length; i++) {
			if (nodeList[i].nodeName == "INPUT")
				this.inputs.push(nodeList[i] as HTMLElement);
		}

		for (const input of this.inputs) {
			if (!input.classList.contains("form-control"))
				input.classList.add("form-field");
		}
	}

	get formControl(): AbstractControl | { value: null; errors: null } | null {
    let resultControl: AbstractControl | { value: null; errors: null } | null = null;
    const fields = this.fields.length ? this.fields : [this.field];
    for (const field of fields) {
      const control = this.config.form && this.config.form.controls[field]
        ? this.config.form.controls[field]
        : { value: null, errors: null };
      if (control.errors && Object.keys(control.errors).length > 0) {
        resultControl = control;
        break;
      }
    }

    for (const input of this.inputs) {
        if (input) {
            if (this.controlIsDirty) {
                if (resultControl && resultControl.errors) {
                    input.classList.add("is-invalid");
                    input.classList.remove("is-valid");
                } else {
                    input.classList.add("is-valid");
                    input.classList.remove("is-invalid");
                }
            } else {
                input.classList.remove("is-valid", "is-invalid");
            }
        }
    }

    return resultControl;
}


	get fieldKey (): string {
		let key = "";
		const fields = this.fields ? this.fields : [this.field];
		for (const field of fields) {
			const control = this.config.form ? this.config.form.controls[field] : { value: null, errors: null };
			if (!key || control.errors)
				key = field;
		}

		return key;
	}

	get controlIsDirty(): boolean {
    let resultControl: AbstractControl<any, any> | { value: null, errors: null } | null = null;
    const fields = this.fields ? this.fields : [this.field];
    for (const field of fields) {
        const control = this.config.form ? this.config.form.controls[field] : { value: null, errors: null };
        if (!resultControl || control.value) {
            resultControl = control;
        }
    }

    for (const input of this.inputs) {
        if (input && (input.classList.contains("ng-dirty") || (resultControl && resultControl.value)))
            return true;
    }

    return false;
  }


	public getDefaultMessage (key: string): string {
		switch (key) {
			case "required":
				return "Este campo é obrigatório";
			case "email":
				return "Este campo deve ser um e-mail válido";
			case "min":
				return "Este campo deve ter um valor maior";
			case "max":
				return "Este campo deve ter um valor menor";
			case "minlength":
				return "Este campo deve ser maior";
			case "maxlength":
				return "Este campo deve ser menor";
			case "failedPhone":
				return "Este campo deve ser um telefone válido";
			default:
				return "Preenchimento inválido";
		}
	}
}
