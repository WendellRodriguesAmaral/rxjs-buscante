import { FormControl } from '@angular/forms';
import { Item } from './../../models/interfaces';
import { Component } from '@angular/core';
import { catchError, debounceTime, distinctUntilChanged, filter, map, switchMap, throwError } from 'rxjs';
import { LivroVolumeInfo } from 'src/app/models/livroVolumeInfo';
import { LivroService } from 'src/app/service/livro.service';

const PAUSA = 300;

@Component({
  selector: 'app-lista-livros',
  templateUrl: './lista-livros.component.html',
  styleUrls: ['./lista-livros.component.css']
})
export class ListaLivrosComponent {

  campoBusca = new FormControl();
  //subscription: Subscription; //um observable retorna um subscription
  mensagemErro = '';

  constructor(private service:LivroService) { }  

  livrosEncontrados$ = this.campoBusca.valueChanges  //ele emite um evento cada vez tiver uma mudança no campo de busca
  .pipe(
    debounceTime(PAUSA), //so continua a requisição depois de um tempo especifico
    filter((valorDigitado)=> valorDigitado.length >= 3), //so permite executar as proximas linhas se digitar mais q 4 caracteres
    distinctUntilChanged(),
    switchMap(valorDigitado => this.service.buscar(valorDigitado)), //sempre faz a requisição com o ultimo valor passado
    map(items => this.livrosResultadoParaLivros(items)), //map serve para 'mudar' os dados, mas nesse caso so está executando um metodo
    catchError(error => { //catchError captura o erro
      console.log(error)
      return throwError(()=> new Error( this.mensagemErro = "Deu um erro aqui amigão. Recarregue a página!")) //throwError retorna um observable para quem ta inscrito nele
    })
  )


  livrosResultadoParaLivros(items:Item[]): LivroVolumeInfo[]{
    return items.map(item =>{
      return new LivroVolumeInfo(item);
    })
  }


}



