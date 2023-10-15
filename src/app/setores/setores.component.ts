import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import Swal, { SweetAlertResult } from "sweetalert2";

import { AuthService } from '../services/auth/auth.service';
import { Cargos } from '../interfaces/IUser';

import { SetoresService } from '../services/setores/setores.service';
import { ISetor } from '../interfaces/ISetor';

@Component({
  selector: 'app-setores',
  templateUrl: './setores.component.html',
  styleUrls: ['./setores.component.scss']
})
export class SetoresComponent implements OnInit {

  form: FormGroup;
  list: ISetor[] | any[];

  constructor(
    private fb: FormBuilder,
    private setoresService:SetoresService,
    private authService: AuthService
  ){
    this.list = []
    this.form = this.fb.group({
      setor: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.authService.cargosPermitidos([Cargos.ADMINISTRADOR,Cargos.GESTOR])

    this.setoresService.getSetores().subscribe(ref => {
      this.list = ref
    })
  }

  salvar() {
    if (this.form.valid) {
      this.setoresService.salvarSetor(this.form.get('setor')?.value).subscribe(res =>{
        if(res.nome){
          this.form.get('setor')?.setValue('')
          this.list.push(res)
        }
      })
    } else {
      console.log("Formulário inválido.");
    }
  }

  apagar(setor:ISetor){
    Swal.fire({
      title: 'Deseja mesmo apagar o setor?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não',
    }).then((result) => {
      if (result.isConfirmed) {
        this.setoresService.apagarSetor(setor.idSetor).subscribe(apagado =>{
          if(apagado){
            Swal.fire({
              icon: "success",
              title: "Setor Apagado!",
              confirmButtonColor: "#3C58BF"
            });
            const index = this.list.indexOf(setor);
            this.list.splice(index,1)
          }else{
            Swal.fire({
              icon: "error",
              title: "Setor Não Apagado!",
            });
          }
        })
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Setor não foi apagado.', '', 'info');
      }
    });
  }


  copiarLink(codigo:string) {
    const link = `www.engemaia.com?ref=${codigo}`;

    // Usar a API do Clipboard para copiar o link
    navigator.clipboard.writeText(link).then(() => {
      Swal.fire({
        icon: "success",
        title: "setor Copiada!",
        text: "Ref: "+link,
        confirmButtonColor: "#3C58BF"
      });
    }).catch(err => {
      console.error('Falha ao copiar: ', err);
      Swal.fire({
        icon:"error",
        title: "setor Não Copiada!",
        text: "Mas seu link é: "+link,
      });
    });
  }
}
