const express = require("express");
const router = express.Router();
const moment = require("moment");
const { body, validationResult } = require("express-validator");
 
moment.locale("pt-br");
 
const { tarefasModel } = require("../models/tarefasModel");
 
const opcoesSituacao = ["Cancelada", "Pendente", "Iniciada", "Finalizada", "Atrasada"];
 
const validarTarefa = [
    body("tarefa")
        .trim()
        .isLength({ min: 5, max: 45 })
        .withMessage("A tarefa deve ter entre 5 e 45 caracteres."),
    body("prazo")
        .isISO8601()
        .withMessage("Informe uma data válida.")
        .custom((value) => {
            const hoje = new Date();
            hoje.setHours(0, 0, 0, 0);
 
            const dataPrazo = new Date(`${value}T00:00:00`);
            if (dataPrazo < hoje) {
                throw new Error("O prazo deve ser hoje ou uma data futura.");
            }
            return true;
        }),
    body("situacao")
        .isInt({ min: 0, max: 4 })
        .withMessage("A situação deve ser um número inteiro entre 0 e 4.")
];
 
function montarDadosFormulario(req) {
    return {
        id_tarefa: req.body.id_tarefa || "0",
        nome_tarefa: req.body.tarefa || "",
        prazo_tarefa: req.body.prazo || "",
        situacao_tarefa: Number(req.body.situacao ?? 1),
        status_tarefa: 1
    };
}
 
router.get("/", async (req, res) => {
    res.locals.moment = moment;
    try {
        const lista = await tarefasModel.findAll();
        res.render("pages/index", {
            linhasTabela: Array.isArray(lista) ? lista : [],
            erroBanco: null
        });
    } catch (error) {
        console.log(error);
        res.status(500).render("pages/index", {
            linhasTabela: [],
            erroBanco: "Não foi possível carregar as tarefas porque a conexão com o banco de dados falhou."
        });
    }
});
 
router.get("/nova-tarefa", (req, res) => {
    res.locals.moment = moment;
    res.render("pages/cadastro", {
        tarefa: { id_tarefa: "0", nome_tarefa: "", prazo_tarefa: "", situacao_tarefa: 1, status_tarefa: 1 },
        tituloAba: "Nova Tarefa",
        tituloPagina: "Inserção de Tarefa",
        id_tarefa: "0",
        erros: [],
        dadosForm: {}
    });
});
 
router.get("/editar", async (req, res) => {
    res.locals.moment = moment;
    const id = req.query.id;
    try {
        const dadosTarefa = await tarefasModel.findById(id);
        if (!dadosTarefa.length) {
            return res.status(404).send("Tarefa não encontrada.");
        }
 
        res.render("pages/cadastro", {
            tarefa: dadosTarefa[0],
            tituloAba: "Edição de Tarefa",
            tituloPagina: "Alteração de Tarefa",
            id_tarefa: id,
            erros: [],
            dadosForm: {}
        });
    } catch (erro) {
        console.log(erro);
        res.status(500).send("Erro ao carregar a tarefa.");
    }
});
 
router.post("/nova-tarefa", validarTarefa, async (req, res) => {
    res.locals.moment = moment;
    const erros = validationResult(req);
 
    if (!erros.isEmpty()) {
        return res.status(422).render("pages/cadastro", {
            tarefa: montarDadosFormulario(req),
            tituloAba: "Nova Tarefa",
            tituloPagina: "Inserção de Tarefa",
            id_tarefa: "0",
            erros: erros.array(),
            dadosForm: req.body
        });
    }
 
    const dadosInsert = {
        nome: req.body.tarefa,
        prazo: req.body.prazo,
        situacao: req.body.situacao
    };
 
    try {
        await tarefasModel.create(dadosInsert);
        res.redirect("/");
    } catch (erro) {
        console.log(erro);
        res.status(500).send("Erro ao cadastrar a tarefa.");
    }
});
 
router.post("/editar", validarTarefa, async (req, res) => {
    res.locals.moment = moment;
    const erros = validationResult(req);
    const id = req.body.id_tarefa;
 
    if (!erros.isEmpty()) {
        return res.status(422).render("pages/cadastro", {
            tarefa: montarDadosFormulario(req),
            tituloAba: "Edição de Tarefa",
            tituloPagina: "Alteração de Tarefa",
            id_tarefa: id,
            erros: erros.array(),
            dadosForm: req.body
        });
    }
 
    const dadosUpdate = {
        id,
        nome: req.body.tarefa,
        prazo: req.body.prazo,
        situacao: req.body.situacao
    };
 
    try {
        await tarefasModel.update(dadosUpdate);
        res.redirect("/");
    } catch (erro) {
        console.log(erro);
        res.status(500).send("Erro ao alterar a tarefa.");
    }
});
 
router.get("/excluir-logico", async (req, res) => {
    const id = req.query.id;
 
    try {
        await tarefasModel.deleteLogico(id);
        res.redirect("/");
    } catch (erro) {
        console.log(erro);
        res.status(500).send("Erro ao excluir logicamente a tarefa.");
    }
});
 
router.get("/teste-create", async (req, res) => {
    const dadosInsert = {
        nome: "remover virus do PC 2 do 2B",
        prazo: "2026-04-10",
        situacao: 1
    };
 
    try {
        const resultInsert = await tarefasModel.create(dadosInsert);
        res.json({
            mensagem: "Insert realizado",
            resultado: resultInsert
        });
    } catch (erro) {
        console.log(erro);
        res.status(500).send("Erro no teste de create.");
    }
});
 
router.get("/teste-delete", async (req, res) => {
    const codigo = req.query.id || 1;
 
    try {
        const resultDelete = await tarefasModel.deleteFisico(codigo);
        res.json({
            mensagem: "Delete físico realizado",
            id_tarefa: codigo,
            resultado: resultDelete
        });
    } catch (erro) {
        console.log(erro);
        res.status(500).send("Erro no teste de delete físico.");
    }
});
 
router.get("/teste-delete-logico", async (req, res) => {
    const codigo = req.query.id || 1;
 
    try {
        const resultDelete = await tarefasModel.deleteLogico(codigo);
        res.json({
            mensagem: "Delete lógico realizado",
            id_tarefa: codigo,
            resultado: resultDelete
        });
    } catch (erro) {
        console.log(erro);
        res.status(500).send("Erro no teste de delete lógico.");
    }
});
 
module.exports = router;