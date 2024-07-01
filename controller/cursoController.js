import { Database } from '../config/db.js';

// lista todos os cursos sem auth
export async function ListaTodosCursos() {
    try {
        const cursos = await Database.curso.findMany();
        return cursos;
    } catch (error) {
        console.log(error);
        return error;
    }
}

// procura curso pelo id
export async function ProcuraCursoById({ id }) {
    try {
        const curso = await Database.curso.findFirst({
            where: {
                id,
            },
        });
        return curso;
    } catch (error) {
        console.log(error);
        return error;
    }
}

// procura na tabela 'usuario_curso' se um usuario esta inscrito num curso
export async function ProcuraUsuarioCurso({ usuario_id, curso_id }) {
    try {
        const inscricao = await Database.usuario_curso.findFirst({
            where: {
                usuario_id,
                curso_id,
            },
        });
        return inscricao;
    } catch (error) {
        console.log(error);
        return error;
    }
}

// inscreve um usuario em um curso
export async function InscreveUsuario({ usuario_id, curso_id }) {
    try {
        const inscricao = await Database.usuario_curso.create({
            data: {
                curso_id,
                usuario_id,
            },
        });
        return inscricao;
    } catch (error) {
        console.log(error);
        return error;
    }
}

// cancela a inscricao de um usuario em um curso
export async function CancelaInscricao({ usuario_id, curso_id }) {
    try {
        const inscricao = await ProcuraUsuarioCurso({ usuario_id: usuario_id, curso_id: curso_id });
        const inscricaoUpdate = await Database.usuario_curso.update({
            where: {
                id: inscricao.id,
            },
            data: {
                inscrito: false,
            },
        });
        return inscricaoUpdate;
    } catch (error) {
        console.log(error);
        return error;
    }
}

// lista os cursos que um usuario esta matriculado
export async function ListaCursoUsuario({ usuario_id }) {
    try {
        const cursos = await Database.usuario_curso.findMany({
            where: {
                usuario_id,
            },
            include: {
                usuario: {
                    select: {
                        nome: true,
                    },
                },
                curso: {
                    select: {
                        id: true,
                        nome: true,
                        descricao: true,
                        capa: true,
                        inscritos: true,
                        comeca_em: true,
                    },
                },
            },
        });
        return cursos;
    } catch (error) {
        console.log(error);
        return error;
    }
}
