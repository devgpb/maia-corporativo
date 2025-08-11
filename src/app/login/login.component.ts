import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // Importe FormBuilder, FormGroup e Validators
import { faL } from '@fortawesome/free-solid-svg-icons';

declare var particlesJS: any;
@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    standalone: false
})
export class LoginComponent implements OnInit{
  public loginForm: FormGroup; // Crie um FormGroup
  public invalidCred: boolean = false;
  public error:any;

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder // Injete o FormBuilder
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]], // Adicione validadores
      password: ['', [Validators.required]]
    });
  }

  onSubmit() {
    // Verificar se o formulário é válido antes de enviar
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value; // Obtenha os valores do formulário


      this.authService.login(email, password).subscribe(res => {
        this.router.navigate(['/pedidos']);
      },(error)=>{
        this.invalidCred = true
        // this.error = JSON.stringify(error)
      });
    }
  }

  ngOnInit(): void {
    particlesJS.load('particles-js', '../assets/particles.json', function() {
      console.log('callback - particles.js config loaded');
    });
  }
}
