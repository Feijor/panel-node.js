import { Injectable } from '@angular/core';
import { FormBuilder, Validators, AbstractControl, FormGroup } from '@angular/forms';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/catch';

@Injectable() 
export class RequisicoesService {

    private headers
    private loader;

    public server;

    constructor(private http: Http, public formBuilder: FormBuilder){
        //cria headers
        this.createAuthorizationHeader();

        //Pega link
        if(!/localhost/.test(document.location.host)) {
            this.server = 'https://appmastermind.herokuapp.com/api/';
        }else{
            this.server = 'http://localhost:3001/api/';
        }
    }

    createAuthorizationHeader() {
        this.headers = new Headers(); 

        this.headers.append('Content-Type', 'application/json');
        this.headers.append('Accept', 'application/json');
        this.headers.append('authorization', 'e4ZSAPkR3EsAPFypfZrDxC9zgXTDtQ80');
    }

    getServer(){
        return this.server;
    }

    //Funções de envio

    submitInternal(link: string, form: any){
        return this.http.post ( this.server + link,
                        form,
                        {headers: this.headers})
            .map(data => { 
                return data.json();
            })
            .catch((error:any) => {

                switch(error){
                    case 400:
                        alert(JSON.parse(error._body).message);
                        break;
                    case 401:
                        alert(JSON.parse(error._body).message);
                        break;
                    default:
                        console.log(error._body);
                }

                return Observable.throw(new Error(error));
            });
    }
 
    getInternal(link: string){
        return this.http.get ( this.server + link,
                        {headers: this.headers})
            .map(data => { 
                return data.json();
            })
            .catch((error:any) => {

                switch(error){
                    case 400:
                        alert(JSON.parse(error._body).msg);
                        break;
                    case 401:
                        alert(JSON.parse(error._body).msg);
                        break;
                    default:
                        console.log(JSON.parse(error._body).msg);
                }

                return Observable.throw(new Error(error.status));
            });
    }

    submitInternalSilent(link: string, form: any){
        return this.http.post ( this.server + link,
                        form,
                        {headers: this.headers})
            .map(data => { 
                return data.json();
            })
            .catch((error:any) => {
                console.log(error);
                return Observable.throw(new Error(error.status));
            });
    }

    //Validação de form

    verificaValid(form: FormGroup, campo: string){ 
        return !form.get(campo).valid && form.get(campo).touched;
    }

    aplicaCssErro(form: FormGroup, campo: string){
        return {
        'has-error': this.verificaValid(form, campo),
        'has-feedback': this.verificaValid(form, campo)
        }
    }

    //Cria classes de form's

    getFormLogin(){
        return this.formBuilder.group({
            email: [null, [Validators.required]],
            senha: [null, [Validators.required]],
        });
    }

    getFormNewpass(){
        return this.formBuilder.group({
            nova: [null, [Validators.required]],
            confirma: [null, [Validators.required]]
        },  { validator: this.passwordConfirming });
    }

    getFormUser(){
        return this.formBuilder.group({
            email: [null, [Validators.required]],
            senha: [null, [Validators.required]]
        });
    }

    getFormEsqueceu(){
        return this.formBuilder.group({
            email: [null, [Validators.required]]
        });
    }

    getFormResp(){
        return this.formBuilder.group({
            assunto: [null, [Validators.required]],
            texto: [null, [Validators.required]],
            _iduser: [null, [Validators.required]],
            _idretorno: [null, [Validators.required]],
            tipo: ['entrada']
        });
    }

    cadconfirm(c: AbstractControl) {        
        return (c.get('senha').value == c.get('confirma').value && c.get('aceite').value ? null : { nomatch: true });
    }

    passwordConfirming(c: AbstractControl) {        
        return (c.get('nova').value == c.get('confirma').value ? null : { nomatch: true });
    }
}