const express = require('express')
const app = express()
const { curl, GetStr } = require('one7-utils')
const bodyParser = require('body-parser')
const cors = require('cors')

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.send('Aplicacao Online!')
})

app.post('/custom/cpfSearch', async(req, res) => {
    var cpf = req.body.cpf

    const _curl = await curl({
        url: 'http://www.juventudeweb.mte.gov.br/pnpepesquisas.asp',
        method: "POST",
        body: `acao=consultar%20cpf&cpf=${cpf}`,
        headers: {
            'Content-Type': 'text/xml, application/x-www-form-urlencoded;charset=ISO-8859-1, text/xml; charset=ISO-8859-1',
            'Cookie': 'ASPSESSIONIDSCCRRTSA=NGOIJMMDEIMAPDACNIEDFBID; FGTServer=2A56DE837DA99704910F47A454B42D1A8CCF150E0874FDE491A399A5EF5657BC0CF03A1EEB1C685B4C118A83F971F6198A78',
            'Host': 'www.juventudeweb.mte.gov.br'
        }
    })

    if (_curl.includes('NRCPF')) {
        var nome = GetStr(_curl, 'NOPESSOAFISICA="', '"')
        var nasc = GetStr(_curl, 'DTNASCIMENTO="', '"')
        var [dia, mes, ano] = nasc.split("/")
        var idade = `2021 - ${ano} Anos`
        var rua = GetStr(_curl, 'NOLOGRADOURO="', '"')
        var numCasa = GetStr(_curl, 'NRLOGRADOURO="', '"')
        var complemento = GetStr(_curl, 'DSCOMPLEMENTO="', '"')
        var bairro = GetStr(_curl, 'NOBAIRRO="', '"')
        var cep = GetStr(_curl, 'NRCEP="', '"')
        var cidade = GetStr(_curl, 'NOMUNICIPIO="', '"')
        var uf = GetStr(_curl, 'SGUF="', '"')
        var nomeMae = GetStr(_curl, 'NOMAE="', '"')
        res.status(200).json({
            status: true,
            message: {
                cpf: cpf,
                nome: nome,
                nascimento: nasc,
                idade: idade,
                mae: nomeMae,
                endereco: `${rua}, ${numCasa} ${complemento} - ${bairro}, ${cidade}/${uf} - ${cep}`

            }
        })
    } else {
        res.status(412).json({
            status: false,
            message: "cpf nao encontrado"
        })
    }


})

app.listen(process.env.PORT || 5000, () => {
    console.log('Servidor Online!')
})