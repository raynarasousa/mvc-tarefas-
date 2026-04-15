const pool = require("../../config/pool_conexoes");
 
const tarefasModel = {
 
    findAll: async () => {
        const [resultado] = await pool.query(
            "select * from tarefas where status_tarefa = 1 "
        );
        return resultado;
    },
 
    findAllInativos: async () => {
        const [resultado] = await pool.query(
            "select * from tarefas where status_tarefa = 0 "
        );
        return resultado;
    },
 
    findById: async (id) => {
        const [resultado] = await pool.query(
            "select * from tarefas where status_tarefa = 1 and id_tarefa = ?",
            [id]
        );
        return resultado;
    },
 
    create: async (campos) => {
        const [resultado] = await pool.query(
            "insert into tarefas(`nome_tarefa`,`prazo_tarefa`,`situacao_tarefa`) values(?,?,?)",
            [campos.nome, campos.prazo, campos.situacao]
        );
        return resultado;
    },
 
    update: async (campos) => {
        const [resultado] = await pool.query(
            "update tarefas set `nome_tarefa`= ?, `prazo_tarefa`= ?, `situacao_tarefa`= ? where id_tarefa = ? ",
            [campos.nome, campos.prazo, campos.situacao, campos.id]
        );
        return resultado;
    },
 
    deleteFisico: async (id) => {
        const [resultado] = await pool.query(
            "delete from tarefas where id_tarefa = ?",
            [id]
        );
        return resultado;
    },
 
    deleteLogico: async (id) => {
        const [resultado] = await pool.query(
            "update tarefas set status_tarefa = 0 where id_tarefa = ?",
            [id]
        );
        return resultado;
    }
 
};
 
module.exports = { tarefasModel };