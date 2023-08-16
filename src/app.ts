console.log("Arquivo de testes. Pode mexer nele como quiser.");

//Desafio 1

let employee: { code: number; name: string } = {
  code: 10,
  name: "John",
};

//Desafio 2
enum profissao {
  Atriz,
  Padeiro,
}

type Pessoa = { nome: string; idade: number; profissao: profissao };

const pessoa1: Pessoa = {
  nome: "Maria",
  idade: 53,
  profissao: profissao.Atriz,
};
const pessoa2: Pessoa = {
  nome: "Roberto",
  idade: 23,
  profissao: profissao.Padeiro,
};
const pessoa3: Pessoa = {
  nome: "Laura",
  idade: 34,
  profissao: profissao.Atriz,
};
const pessoa4: Pessoa = {
  nome: "Carlos",
  idade: 67,
  profissao: profissao.Padeiro,
};

//Desafio 3

let botaoAtualizar = document.getElementById('atualizar-saldo');
let botaoLimpar = document.getElementById('limpar-saldo')!;
let soma = document.getElementById('soma'!) as HTMLInputElement;
let campoSaldo = document.getElementById('campo-saldo');

let saldo = 0

limparSaldo()

function somarAoSaldo(soma: number) {
    if (campoSaldo) {
        saldo += soma
        campoSaldo.innerHTML = saldo.toString();
        limpaSoma();
    }
}

function limpaSoma() {
    soma.value = "";
}

function limparSaldo() {
    if (campoSaldo) {
        saldo = 0;
        campoSaldo.innerHTML = saldo.toString();
    }
}

if (botaoAtualizar) {
    botaoAtualizar.addEventListener('click', () => {
        somarAoSaldo(Number(soma.value)); 
    });
}
botaoLimpar.addEventListener('click', () => { 
    limparSaldo();
});


/**
    <h4>Valor a ser adicionado: <input id="soma"> </h4>
    <button id="atualizar-saldo">Atualizar saldo</button>
    <button id="limpar-saldo">Limpar seu saldo</button>
    <h1>"Seu saldo é: " <span id="campo-saldo"></span></h1>
 */

// Desafio 4 


  

  
  class HttpClient {
    static async get<T>({ url, method, body = null }: { url: string; method: string; body?: any }): Promise<T> {
      return new Promise<T>((resolve, reject) => {
        let request = new XMLHttpRequest();
        request.open(method, url, true);
  
        request.onload = () => {
          if (request.status >= 200 && request.status < 300) {
            resolve(JSON.parse(request.responseText));
          } else {
            reject({
              status: request.status,
              statusText: request.statusText,
            });
          }
        };
        request.onerror = () => {
          reject({
            status: request.status,
            statusText: request.statusText,
          });
        };
  
        if (body) {
          request.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
          body = JSON.stringify(body);
        }
        request.send(body);
      });
    }
  }
  
  class MovieApp {
    private apiKey: string = '';
    private requestToken: string = "";
    private username: string = "";
    private password: string = "";
    private sessionId: string ="";
    private listId: string = '';
  
    constructor() {
      let loginButton = document.getElementById('login-button');
      let searchButton = document.getElementById('search-button');
  
      if (loginButton) {
        loginButton.addEventListener('click', async () => {
          await this.criarRequestToken();
          await this.logar();
          await this.criarSessao();
        });
      }
  
      if (searchButton) {
        searchButton.addEventListener('click', async () => {
          let lista = document.getElementById('lista');
          if (lista) {
            lista.outerHTML = '';
          }
          let queryInput = document.getElementById('search') as HTMLInputElement;
          let query = queryInput.value;
          let listaDeFilmes = await this.procurarFilme(query);
          let ul = document.createElement('ul');
          ul.id = 'lista';
          for (const item of listaDeFilmes.results) {
            let li = document.createElement('li');
            li.appendChild(document.createTextNode(item.original_title));
            ul.appendChild(li);
          }
          console.log(listaDeFilmes);
          let searchContainer = document.getElementById('search-container');
          if (searchContainer) {
            searchContainer.appendChild(ul);
          }
        });
      }
    }
    
    setUsername(value: string) {
        this.username = value;
        this.validateLoginButton();
      }
    
      setPassword(value: string) {
        this.password = value;
        this.validateLoginButton();
      }
    
      setApiKey(value: string) {
        this.apiKey = value;
        this.validateLoginButton();
      }
    
      private validateLoginButton() {
        let loginButton = document.getElementById('login-button') as HTMLButtonElement;
        if (loginButton) {
          loginButton.disabled = !(this.password && this.username && this.apiKey);
        }
      }
    
  
    async criarRequestToken() {
      let result = await HttpClient.get<{
        request_token: string;
      }>({
        url: `https://api.themoviedb.org/3/authentication/token/new?api_key=${this.apiKey}`,
        method: 'GET',
      });
      this.requestToken = result.request_token;
    }
  
    async logar() {
      let body = {
        username: this.username,
        password: this.password,
        request_token: this.requestToken,
      };
  
      await HttpClient.get({
        url: `https://api.themoviedb.org/3/authentication/token/validate_with_login?api_key=${this.apiKey}`,
        method: 'POST',
        body: body,
      });
    }
  
    async criarSessao() {
      let result = await HttpClient.get<{
        session_id: string;
      }>({
        url: `https://api.themoviedb.org/3/authentication/session/new?api_key=${this.apiKey}&request_token=${this.requestToken}`,
        method: 'GET',
      });
      this.sessionId = result.session_id;
    }
  
    async procurarFilme(query: string) {
      query = encodeURI(query);
      let result = await HttpClient.get<{
        results: { original_title: string }[];
      }>({
        url: `https://api.themoviedb.org/3/search/movie?api_key=${this.apiKey}&query=${query}`,
        method: 'GET',
      });
      return result;
    }
  }
  
  window.addEventListener('load', () => {
    const movieApp = new MovieApp();
  
    let loginInput = document.getElementById('login') as HTMLInputElement;
    let senhaInput = document.getElementById('senha') as HTMLInputElement;
    let apiKeyInput = document.getElementById('api-key') as HTMLInputElement;
  
    if (loginInput && senhaInput && apiKeyInput) {
      loginInput.addEventListener('change', (event) => {
        movieApp.setUsername((event.target as HTMLInputElement).value);
      });
  
      senhaInput.addEventListener('change', (event) => {
        movieApp.setPassword((event.target as HTMLInputElement).value);
      });
  
      apiKeyInput.addEventListener('change', (event) => {
        movieApp.setApiKey((event.target as HTMLInputElement).value);
      });
    }
  });