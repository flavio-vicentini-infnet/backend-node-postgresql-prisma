import 'dotenv/config';
import BCrypt from 'bcrypt';
import { Database } from '../config/db.js';
import JWT from 'jsonwebtoken';
import { ProcuraUsuarioByLoginId } from './usuarioController.js';

const SECRET = process.env.SECRET;

// insere novo registro na tabela login
export async function CriaLogin({ email, senhaParam }) {
    try {
        // criptografa a senha
        const senha = BCrypt.hashSync(senhaParam, 10);

        const new_login = await Database.login.create({
            data: {
                email,
                senha,
            },
        });

        return new_login;
    } catch (error) {
        console.log(error.message);
        return error;
    }
}

// procura um login pelo email
export async function ProcuraLoginByEmail({ email }) {
    try {
        const user = await Database.login.findUnique({
            where: {
                email,
            },
        });

        return user;
    } catch (error) {
        console.log(error.message);
        return error;
    }
}

// procura um login pelo id
export async function ProcuraLoginById({ id }) {
    try {
        const usuario = await Database.login.findUnique({
            where: {
                id,
            },
        });

        return usuario;
    } catch (error) {
        console.log(error.message);
        return error;
    }
}

// loga um usuario no sistema e devolve um JWT
export async function Login({ email, senha }) {
    try {
        const login = await ProcuraLoginByEmail({ email });

        if (!login) {
            console.log(`Email ${email} not found.`);
            throw Error(`Usuário com email '${email}' não encontrado`);
        }

        const matchPassword = BCrypt.compareSync(senha, login.senha);

        if (!matchPassword) {
            throw Error(`Usuário ou senha não estão corretos`);
        }

        // procura o usuario pelo id de login
        const usuario = await ProcuraUsuarioByLoginId({ login_id: login.id });

        const token = JWT.sign(
            {
                login_id: login.id,
                email: login.email,
                ativo: login.ativo,
                usuario_id: usuario.id,
            },
            SECRET,
            { expiresIn: '1h' }
        );

        console.log(token);

        return token;
    } catch (error) {
        console.log(error.message);
        return error;
    }
}
