import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import Swal, { SweetAlertResult } from "sweetalert2";


import { ReferenciasService } from '../services/referenciasService/referencias.service';
import { IReferencia } from '../interfaces/IReferencia';
@Component({
  selector: 'app-referencias',
  templateUrl: './referencias.component.html',
  styleUrls: ['./referencias.component.scss']
})
export class ReferenciasComponent implements OnInit {

  form: FormGroup;
  list: IReferencia[] | any[];

  constructor(
    private fb: FormBuilder,
    private refService:ReferenciasService
  ){
    this.list = []
    this.form = this.fb.group({
      referencia: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.refService.getReferencias().subscribe(ref => {
      this.list = ref
    })
  }


  salvar() {
    if (this.form.valid) {
      console.log("Formulário enviado!", this.form.value);
      this.refService.salvarReferencia(this.form.get('referencia')?.value).subscribe(res =>{
        if(res.referencia){
          this.list.push(res)
        }
      })
    } else {
      console.log("Formulário inválido.");
    }
  }

  apagar(ref:IReferencia){
    console.log(ref)
    this.refService.apagarReferencia(ref.referencia).subscribe(deleted =>{
      if(deleted){
        const index = this.list.indexOf(ref);
        this.list.splice(index,1)
      }
    })
  }


  copiarLink(codigo:string) {
    const link = `www.engemaia.com&ref=${codigo}`;

    // Usar a API do Clipboard para copiar o link
    navigator.clipboard.writeText(link).then(() => {
      Swal.fire({
        icon: "success",
        title: "Referencia Copiada!",
        text: "Ref: "+link,
        confirmButtonColor: "#3C58BF"
      });
    }).catch(err => {
      console.error('Falha ao copiar: ', err);
      Swal.fire({
        icon:"error",
        title: "Referencia Não Copiada!",
        text: "Mas seu link é: "+link,
      });
    });
  }
}
