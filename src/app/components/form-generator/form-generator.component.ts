import { Component, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { InputConfig } from 'src/app/interfaces/IFormGenerator';



@Component({
  selector: 'form-generator',
  templateUrl: './form-generator.component.html',
  styleUrls: ['./form-generator.component.scss']
})
export class FormGeneratorComponent {
  @Input() configs: InputConfig[] = [];
  form: FormGroup = new FormGroup({});

  ngOnChanges() {
    this.createForm();
  }

  createForm() {
    const group: { [key: string]: FormControl } = {};

    this.configs.forEach(config => {
      const control = new FormControl(
        config.valor || '',
        this.getValidators(config)
      );
      group[config.label] = control;
    });

    this.form = new FormGroup(group);
  }

  getValidators(config: InputConfig) {
    const validators = [];

    if (config.config?.required) {
      validators.push(Validators.required);
    }

    if (config.tipo === 'text' && config.config?.pattern) {
      validators.push(Validators.pattern(config.config.pattern));
    }

    if (config.tipo === 'number' || config.tipo === 'date') {
      if (config.config?.min !== undefined) {
        validators.push(Validators.min(Number(config.config.min)));
      }
      if (config.config?.max !== undefined) {
        validators.push(Validators.max(Number(config.config.max)));
      }
    }

    return validators;
  }
}
