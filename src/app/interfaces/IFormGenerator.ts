export interface InputConfig {
  label: string;
  valor: any;
  tipo: 'text' | 'number' | 'date' | 'select' | 'radio';
  config?: {
    placeholder?: string;
    disabled?: boolean;
    required?: boolean;
    pattern?: string;  // Para text inputs
    min?: number | string;  // Para number e date inputs
    max?: number | string;  // Para number e date inputs
    options?: string[];  // Para select e radio inputs
  };
}

// Exemplo:
// public inputConfigs: InputConfig[] = [
//   {
//     label: 'Nome Completo',
//     valor: '',
//     tipo: 'text',
//     config: {
//       placeholder: 'Digite seu nome completo',
//       required: true,
//       pattern: '^[a-zA-Z ]*$', // Apenas letras e espaços
//       disabled: false
//     }
//   },
//   {
//     label: 'Idade',
//     valor: '',
//     tipo: 'number',
//     config: {
//       placeholder: 'Digite sua idade',
//       required: true,
//       min: 18, // Mínimo de 18 anos
//       max: 100,
//       disabled: false
//     }
//   },
//   {
//     label: 'Data de Nascimento',
//     valor: '',
//     tipo: 'date',
//     config: {
//       required: true,
//       min: '1900-01-01', // Data mínima
//       max: new Date().toISOString().split('T')[0], // Data máxima é hoje
//       disabled: false
//     }
//   },
//   {
//     label: 'Gênero',
//     valor: '',
//     tipo: 'radio',
//     config: {
//       required: true,
//       options: ['Masculino', 'Feminino', 'Outro'],
//       disabled: false
//     }
//   },
//   {
//     label: 'Estado',
//     valor: '',
//     tipo: 'select',
//     config: {
//       required: true,
//       options: ['São Paulo', 'Rio de Janeiro', 'Minas Gerais', 'Bahia'],
//       disabled: false
//     }
//   },
//   {
//     label: 'Aceito os Termos',
//     valor: '',
//     tipo: 'radio',
//     config: {
//       required: true,
//       options: ['Sim', 'Não'],
//       disabled: false
//     }
//   }
// ];
