import { Component } from '@angular/core';
import { AlertController, ToastController, ActionSheetController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(private alertaControl:AlertController,
    private toastControl: ToastController,
    private actionSheetControl: ActionSheetController){
      let tarefasJason = localStorage.getItem('tarefaDb');
      if(tarefasJason != null){
        this.tarefas =  JSON.parse(tarefasJason);
      }
     

  }
  tarefas: any[] = [];

  async adicionarTarefa(){
    const alerta = await this.alertaControl.create({
      header:'Qual a proxima consulta ?',
      inputs: [
        {name:'nome', type: 'text', placeholder: 'Qual a proxima consulta ?'},
        {name:'medico', type: 'text', placeholder: 'Qual o médico ?'},
        {name:'data', type:'date', placeholder: 'Qual a data ?'},
        {name:'horario', type: 'time', placeholder: 'Qual a hora ?'}
      ],
      buttons: [{text:'Cancelar', role: 'cancel', cssClass :"secondary", 
      handler: ()=>{
        //caso o usuario clique em cancelar
        console.log('Acho que você clicou em cancelar');
      }},
      {
        text : 'ok',
        handler: (form) =>{
          // debugger;
          this.addTarefa(form);
        }
      }
    ]
    });
    await alerta.present();
  }

  async addTarefa(lista : any[]) {
    //verifica se o usuario digitou uma tarefa
    if (lista.length < 1){const toast = await this.toastControl.create({
      message: 'Informe o que precisa fazer',
      duration: 2000,
      position: 'middle',
      color: 'primary'
    });
    toast.present();
    return;
  }
  let tarefa = {nome: lista.nome,
     medicos: lista.medico,
     datas: lista.data,
      horas: lista.horario,
       feito: false,
      mostrar: false};
  this.tarefas.push(tarefa);
  this.updateLocalStorage();

  }
  updateLocalStorage(){
    localStorage.setItem('tarefaDb',JSON.stringify(this.tarefas));
  }

  excluir(tarefinha: any){
    this.tarefas = this.tarefas.filter(a => tarefinha != a); //expressão lambda
    this.updateLocalStorage();
  }

  async abrirAcoes(tarefinha:any){
  
    const actionsheet = await this.actionSheetControl.create({
      header: "O que deseja fazer?",
      buttons: [{
        text: tarefinha.feito ? 'Desmarcar' : 'Marcar',
        icon: tarefinha.feito ? 'radio-button-off' : 'checkmark-circle',
        handler:()=>{
          tarefinha.feito = !tarefinha.feito; // inverte o valor de task
          this.updateLocalStorage();
        }
       },
     {
       text: 'Cancelar',
       icon: 'close',
       role: 'cancel',
       handler: () => {
         console.log('clicou em cancelar');
       }
     }
     ]
    });
    await actionsheet.present();// ecexutar a actionsheet
  }// final do actionsheet


}