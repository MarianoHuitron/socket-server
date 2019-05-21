import { Socket } from 'socket.io';
import socketIO from 'socket.io';
import { UsuariosLista } from '../classes/usuarios-liesta';
import { Usuario } from '../classes/usuario';

export const usuariosConectados = new UsuariosLista();

export const conectarCliente = (cliente: Socket) => {
    const usuario = new Usuario(cliente.id);
    usuariosConectados.agregar(usuario);
}

export const desconectar = (cliente: Socket) => {

    cliente.on('disconnect', () => {
        console.log('Cliente desconectado');
        const user = usuariosConectados.borrarUsuario(cliente.id);
        // console.log(`Usuario borrado: ${user}`)
    });
}

export const mensaje = (cliente: Socket, io: socketIO.Server) => {
    cliente.on('mensaje', (payload: {de: string, cuerpo: string}) => {
        io.emit('mensaje-nuevo',payload);
    })
}

export const configurarUsuario = (cliente: Socket, io: SocketIO.Server) => {
    cliente.on('configurar-usuario', (payload: {nombre: string}, callback: Function) => {

        usuariosConectados.actualizarNombre(cliente.id, payload.nombre);
        callback({
            ok: true,
            mensaje: `Usuario ${payload.nombre}, configurado`
        });
    });
}