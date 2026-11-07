import z from 'zod';

const base64Regex = /^[A-Za-z0-9+/]+={1}$/;

export const refreshTokenPipe = z
  .string({ error: 'La cookie es requerida' })
  .length(44, { error: 'La cookie tiene una longitud invalida' })
  .regex(base64Regex, { error: 'Formato de caracteres invalido' });
