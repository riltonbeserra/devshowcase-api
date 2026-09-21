export const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'DevShowcase API',
    version: '2.0.0',
    description: 'API para partilha de portfólios, projetos, tecnologias e avaliações.'
  },
  servers: [
    {
      url: '/api',
      description: 'Servidor Principal'
    }
  ],
  paths: {
    '/profiles': {
      post: {
        summary: 'Registar um novo perfil de programador',
        tags: ['Profiles'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email'],
                properties: {
                  name: { type: 'string', example: 'Rilton Beserra' },
                  email: { type: 'string', example: 'rilton@exemplo.com' },
                  bio: { type: 'string', example: 'Desenvolvedor Full Stack' }
                }
              }
            }
          }
        },
        responses: {
          201: { description: 'Perfil criado com sucesso' },
          400: { description: 'Erro de validação' }
        }
      }
    },
    '/profiles/{id}': {
      get: {
        summary: 'Obter perfil por ID com projetos associados',
        tags: ['Profiles'],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
        ],
        responses: {
          200: { description: 'Perfil retornado com sucesso' },
          404: { description: 'Perfil não encontrado' }
        }
      }
    },
    '/technologies': {
      post: {
        summary: 'Registar nova tecnologia',
        tags: ['Technologies'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name'],
                properties: {
                  name: { type: 'string', example: 'Node.js' }
                }
              }
            }
          }
        },
        responses: {
          201: { description: 'Tecnologia criada com sucesso' }
        }
      },
      get: {
        summary: 'Listar todas as tecnologias',
        tags: ['Technologies'],
        responses: {
          200: { description: 'Lista retornada com sucesso' }
        }
      }
    },
    '/projects': {
      post: {
        summary: 'Criar um novo projeto',
        tags: ['Projects'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['title', 'description', 'repoUrl', 'profileId'],
                properties: {
                  title: { type: 'string', example: 'DevShowcase API' },
                  description: { type: 'string', example: 'API RESTful completa em Express' },
                  repoUrl: { type: 'string', example: 'https://github.com/riltonbeserra/devshowcase-api' },
                  profileId: { type: 'integer', example: 1 },
                  technologyIds: { type: 'array', items: { type: 'integer' }, example: [1] }
                }
              }
            }
          }
        },
        responses: {
          201: { description: 'Projeto registado com sucesso' },
          400: { description: 'Dados inválidos' }
        }
      },
      get: {
        summary: 'Listar projetos com paginação e filtro por tecnologia',
        tags: ['Projects'],
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
          { name: 'technology', in: 'query', schema: { type: 'string' } }
        ],
        responses: {
          200: { description: 'Lista paginada de projetos retornada com sucesso' }
        }
      }
    },
    '/projects/{id}/upvote': {
      put: {
        summary: 'Incrementar upvotes/curtidas de um projeto',
        tags: ['Projects'],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
        ],
        responses: {
          200: { description: 'Upvote adicionado' },
          404: { description: 'Projeto não encontrado' }
        }
      }
    },
    '/projects/{id}/feedbacks': {
      post: {
        summary: 'Registar avaliação e atualizar média do projeto',
        tags: ['Projects'],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['rating'],
                properties: {
                  rating: { type: 'integer', minimum: 1, maximum: 5, example: 5 },
                  comment: { type: 'string', example: 'Excelente arquitetura de código!' }
                }
              }
            }
          }
        },
        responses: {
          201: { description: 'Feedback registado e média recalculada' },
          400: { description: 'Nota inválida (fora do intervalo 1 a 5)' },
          404: { description: 'Projeto não encontrado' }
        }
      }
    }
  }
};