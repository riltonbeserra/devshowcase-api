import { ValidationError, UniqueConstraintError } from 'sequelize';

export function errorHandler(err, req, res, next) {
  // Erros de validação nativos do Sequelize (ex: validação de rating 1 a 5, campos vazios)
  if (err instanceof ValidationError || err instanceof UniqueConstraintError) {
    const messages = err.errors ? err.errors.map(e => e.message) : [err.message];
    return res.status(400).json({
      status: 'fail',
      message: 'Erro de validação nos dados fornecidos.',
      errors: messages
    });
  }

  // Erros com status code customizado lançado na aplicação
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message
    });
  }

  console.error('ERRO INTERNO:', err);

  return res.status(500).json({
    status: 'error',
    message: 'Ocorreu um erro interno no servidor.'
  });
}