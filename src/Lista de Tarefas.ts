/*// //Falta fazer:
// Básico:
//   ✔️ Corrigir fundo do pop-up nas previews de música e texto bíblico.
//   ✔️ Corrigir reordenamento. 
//   ✔️ Concluir cálculo de linhas do slide.
//   ✔️ Permitir formatação de fontes, margens, estilo de texto.
//   ✔️ Possibilidade de excluir elementos.
//   ✔️ Corrigir problemas no leitor de referência bíblica.
// 
// Errinhos para corrigir:
//   ✔️ Redivisão de slides duplicando versículos quando a letra fica muito grande.
//   ✔️ Realce se mantém no modo de apresentação.
//   ✔️ Marcação de clicados no Negrito e afins.
//   ✔️ Limpar variáveis action no reducer.
//   ✔️ Imagem ficando fixa apenas no hover.
//   ✔️ Rolar a lista lateral igual a galeria. 
//   ✔️ Ícone menor na galeria.
//   ✔️ 'Null' no título do slide quando a referência é como: lc3-5.
//   ✔️ Zerar sliders ao limpar formatação.
//   ✔️ Reduzir logo PowerPoint.
//   ✔️ Redividir slides não está funcionando.
//   ✔️ Dividir slides calculando errado \n\n nos textos bíblicos.
//   ✔️ Combobox fonte letra não atualiza direito seu estilo.
//   ✔️ Atualizar apenas preview nos sliders, atualizar store apenas ao perder foco.
//   ✔️ TextoMestre nos slides de imagem.
//   ✔️ Alterar nome do tipo de slide de "Título" para "Texto Livre".
//   ✔️ Dividir slides chegando na borda.
//   ✔️ Alinhamento de texto não funciona desde que mudei as divs dos paragrafos.
//   ✔️ Botões novos do menu configurações.
//   ✔️ Carrossel da lista de slides.
//   ✔️ Slide-mestre aparecendo na apresentação.
//   ✔️ Tamanho botão tela cheia.
//   ✔️ Pesquisa de letra de música não funciona na produção.
//   ✔️ getEstiloPadrao pegar do padrão do usuário.
//   ✔️ Logo do vagalume não está clicável.
//   ✔️ Fade do tutorial duas vezes
//   ✔️ Configuração do tutorial ao dar sign out/zerar apresentação
//   ✔️ Borda na tela cheia está arredondada
//   ✔️ Gradiente das notificações por cima das coisas
//   ✔️ Criar nova apresentação não funciona lá em cima e no atalho
//   ✔️ Incluir webfonts na combo de fontes disponíveis.
//   ✔️ Fontes que não suportam números superscritos.
//   ✔️ Html descaracterizado ao enviar em anexo no e-mail.
//   ✔️ Definir callback meio e formato no menu exportação inconsistente.
//   ✔️ Envio da apresentação para o BD quando o estilo é limpado.
//   ✔️ Largura e altura auto no menu exportação.
//   ✔️ Nova apresentação sair da tela de download.
//   ✔️ Carrossel com espaço extra que desconfigura tudo.
//   ✔️ Mudar regras margem galeria de fundos
//   ✔️ Carrossel às vezes não funciona no "Arrastar".
//   ✔️ Posição dos tutoriais
//   ✔️ Redividir slides ao mudar fonte
//   ✔️ Diferença topleft no fundo 3D ou mudar estilo por completo.
//   ✔️ Update firestore está dando undefined
//   ✔️ Clonar estilo não está funcionando
//   ✔️ Posição do preview ao alterar ratio.
//   ✔️ Atalho avançar tutorial com setas
//   ✔️ 'Arraste uma imagem, ou clique para selecionar o arquivo.' não está clicável.
//   ✔️ Definir padrão incluir ratio.
//   ✔️ Exportação HTML às vezes sem css
//   ✔️ Excluir imagem do input.
//   ✔️ Barra de pesquisa está com muitos erros (editando todas as estrofes de todos os slides).
//   ✔️ Realçar apenas 1 resultado ao pesquisar.
//   ✔️ Ao abrir app, slide 1 é selecionado.
//   ✔️ Pular splash para página de login ao fazer logout.
//   ✔️ Imagem de menor qualidade não carrega se a de maior qualidade não tiver carregado.
//   ✔️ Slides perdendo o tampão ao prever galeria.
//   ✔️ Olhinho de ver senha no login.
//   ✔️ Login clicando enter.
//   ✔️ Estilo seta voltar perfil.
//   ✔️ Tela mudando antes do logout.
//   ✔️ Nova Apresentação usuário está sendo criada a cada login.
//   ✔️ Bloquear exportação PDF, e botão de dividir em colunas.
//   ✔️ Edição do tamanho da imagem.
//   ✔️ Animações input imagem.
//   ✔️ Ocultar/apagar título de slide de imagens.
//   ✔️ Concluir redimensionar imagem e mover. 
//   ✔️ Configurar imagem incluir border-radius, fixar proporção.
//   ✔️ Atalho F5 modo de apresentação.
//   ✔️ Scope errado quando tem login.
//   ✔️ Valor inicial sliders opacidade e borda imagem.
//   ✔️ Carrossel do Input Imagem não vai até o final.*/
// Errinhos:
//   ✔️ Click fora tutorial
//   Padding bottom redividir slides um pouco errado.
//   Redividir quando o texto de um slide é todo deletado.
//   Edição do conteúdo do parágrafo dando alguns erros (falha ao perder foco, não exibe cursor).
//   Exportação de imagens após mudanças inset.
//   Atalhos nos inputs.
//   Reduzir imagens que são grandes demais (galáxia...)
//   Problemas nos dados ao persistir redux.

/*// Features essenciais:
//   ✔️ Envio de imagens.
//   ✔️ Navegar slides clicando à direita ou esquerda.
//   ✔️ Enviar imagem para fundo.
//   ✔️ Editar texto direto no slide.
//   ✔️ Permitir desfazer ações da store (Ctrl + Z).
//   ✔️ Botão para zerar/começar nova apresentação.
//   ✔️ Popup de confirmação.
//   ✔️ Exportar como HTML.
//   ✔️ Marcador de repetições de estrofes nos slides de música/slide de refrão repetido.
//   ✔️ Dividir música em colunas.
//   ✔️ Possibilidade de editar elemento (retornando à tela da query).
//   ✔️ Atalhos em geral.
//   ✔️ Login para salvar preferências.
//   ✔️ Navbar no topo.
//   ✔️ Atalho para nova apresentação.
//   ✔️ Tela perfil do usuário: apresentações passadas, e-mails salvos. 
//   ✔️ Cards de notificação
//   ✔️ Gif splash.
//   ✔️ Gerar link compartilhável.
//   ✔️ Pesquisa no conteúdo dos slides.
//   ✔️ Navegação pelas setas causar rolagem na lista de slides.
//   ✔️ Tela de propagandas
//   ✔️ Criar texto livre padrão personalizado
//   ✔️ Selecionar resolução personalizada.
//   ✔️ Exportação de slides de imagem
//   ✔️ Recuperar senha
//   ✔️ Pedir cadastro ao tentar enviar e-mail
//   ✔️ Compor html e-mail 
//   ✔️ Enviar powerpoint por e-mail.
//   ✔️ Pagina de Download: visualizar apresentação online.
//   ✔️ Melhorar pesquisa de letra de música usando google.
//   ✔️ Editar tamanho da imagem direto no preview.
//   ✔️ Atalhos B e W no modo de apresentação.
//   ✔️ Perguntar número de frequentadores.
//   ✔️ Tela perfil do usuário: informações básicas
//   ✔️ Blend-mode tampão
//   ✔️ Persistir redux 🟨
//   ✔️ Duplicar slide. 
//   ✔️ Salvar/buscar apresentação padrão corretamente.
//   ✔️ Ajuda: rever tutoriais, entrar em contato com o desenvolvedor.
//   ✔️ Lista de atalhos do modo apresentação.*/
//   Incluir fontes como base64 (html) ou zip (power point). 🟥
//   Lidar com perda de conexão.
//   Tentar de novo/Avisar se upload da imagem não pôde ser feito.
//   Ocultar/isolar título. 🟨
//   Otimizar trocas de dados com BD. 🟨
//   Editar slide de imagens ou desabilitar edição. 🟨
//   Botões centralizar nas configurações de imagem.
//   Exportação em PowerPoint.

/*/ Features dispensáveis:
//   Tela perfil do usuário: predefinições. 🟥 
//   Prévia configurar blend-mode e fonte (preciso criar novo componenente Select).
//   Outros efeitos no texto: sombra, realce, etc...
//   Definir limite de e-mails.
//   Propagandas alternadas na galeria.
//   Favoritar músicas, fundos...
//   Incorporar vídeos do youtube.
//   Exportar como PDF.
//   Criar slides a partir de lista com separador.
//   Combo de número de capítulos e versículos da bíblia.
//   ColorPicker personalizado.
//   Adicionar logo da igreja (upload ou a partir de lista de logos famosas de denominações).
//   Otimizar mobile
//   Reutilizar links de compartilhamento.
//   Indicar que há estilização nos slides/grupos.
//   Página de redefinição de senha em português.
//   Fundo em gradiente.
//   Shenanigans de segunda tela.
//   Dividir slide em 2 colunas.
//   Animação excluir item lista perfil.
//   Nomear apresentacao
//   Duplicar apresentação.
//   Opção de inserir texto bíblico/imagem como grupo ou separado. 
//   Tela assinaturas/compras. 
//   Input nos sliders por texto.
//   Fotos de perfil.
//   Compartilhar layouts.
//   Lista de slides no arquivo html.
//   Transições de slides.
//   Ranking músicas.
//   Acrescentar músicas BD.
//   Pesquisa cifra.
//   Dicas eventuais: B/W, forma de escrita da referência bíblica.
//   Atalhos e click fora dos menus.
//   Deletar/duplicar slide arrastando/clicando com botão direito.
//   Duplicar slide através de botão.
//   Manter alt pressionado para duplicar o slide.
//   Pool de imagens do usuário
//   Criar PDF de documentação.
//   Atalho F1 para ajuda.
//   Slide-mestre de cada tipo */
//
// Negócio:
//   ✔️ Criar logo.
//   Cadastrar google ads.
//   Buscar parceria com ultimato.
//   Comprar domínio.
//   Configurar site para ser encontrado pelo google.
//   Pedir amigos para compartilharem.
//   Logos "Apoio" na tela de descanso
//   E-mails não caírem no spam
//   Criar instagram
//   Criar canal do youtube