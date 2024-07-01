import { Database } from '../config/db.js';
import { CriaLogin } from './loginController.js';

// cria um novo usuario e um novo login
export async function CriaUsuario({ nome, email, senha, nascimento }) {
    try {
        // insere o novo registro na tabela 'login'
        const new_login = await CriaLogin({ email: email, senhaParam: senha });

        const login_id = new_login.id;

        const new_usuario = await Database.usuario.create({
            data: {
                nome,
                nascimento,
                login_id,
            },
        });

        return new_usuario;
    } catch (error) {
        console.log(error.message);
        return error;
    }
}

// procura um usuario pelo id de login
export async function ProcuraUsuarioByLoginId({ login_id }) {
    try {
        const usuario = await Database.usuario.findFirst({
            where: {
                login_id,
            },
        });

        return usuario;
    } catch (error) {
        console.log(error.message);
        return error;
    }
}
