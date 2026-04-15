const tarefasModel = require('../models/tarefasModel');
 
// LISTAR tarefas ativas
const listarTarefas = async (req, res) => {
    try {
        const tarefas = await tarefasModel.findAll();
      res.render('pages/index', { linhasTabela: tarefas });
    } catch (erro) {
        res.send(erro);
    }
};
 
// LISTAR inativas (opcional)
const listarInativas = async (req, res) => {
    try {
        const tarefas = await tarefasModel.findAllInativos();
        res.render('pages/inativas', { tarefas });
    } catch (erro) {
        res.send(erro);
    }
};
 
// CRIAR tarefa
const criarTarefa = async (req, res) => {
    try {
        await tarefasModel.create(req.body);
        res.redirect('/');
    } catch (erro) {
        res.send(erro);
    }
};
 
// ATUALIZAR tarefa
const atualizarTarefa = async (req, res) => {
    try {
        await tarefasModel.update(req.body);
        res.redirect('/');
    } catch (erro) {
        res.send(erro);
    }
};
 
// EXCLUSÃO LÓGICA
const excluirLogico = async (req, res) => {
    try {
        await tarefasModel.excluirLogico(req.params.id);
        res.redirect('/');
    } catch (erro) {
        res.send(erro);
    }
};
 
//  EXCLUSÃO FÍSICA
const excluirFisico = async (req, res) => {
    try {
        await tarefasModel.excluirFisico(req.params.id);
        res.redirect('/');
    } catch (erro) {
        res.send(erro);
    }
};
 
module.exports = {
    listarTarefas,
    listarInativas,
    criarTarefa,
    atualizarTarefa,
    excluirLogico,
    excluirFisico
};