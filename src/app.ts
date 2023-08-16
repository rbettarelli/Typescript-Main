console.log('Arquivo de testes. Pode mexer nele como quiser.')

//Desafio 1 

let employee: {code: number, name: string} = {
    code: 10,
    name: "John"
}

//Desafio 2 
enum profissao {
    Atriz,
    Padeiro,

}

type Pessoa = { nome: string, idade: number, profissao: profissao} 

const pessoa1: Pessoa = {nome: 'Maria', idade: 53, profissao: profissao.Atriz }
const pessoa2: Pessoa = {nome: "Roberto", idade: 23, profissao: profissao.Padeiro}
const pessoa3: Pessoa = {nome: "Laura", idade: 34, profissao: profissao.Atriz}
const pessoa4: Pessoa = {nome: "Carlos", idade: 67, profissao: profissao.Padeiro}

//Desafio 3



