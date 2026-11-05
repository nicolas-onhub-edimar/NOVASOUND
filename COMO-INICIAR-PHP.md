# NovaSound com cadastro, login e músicas curtidas

## Primeira configuração no XAMPP

1. Inicie **Apache** e **MySQL** no XAMPP Control Panel.
2. Abra `http://localhost/phpmyadmin`.
3. Selecione a aba **Importar**.
4. Importe `api/schema.sql` para criar as tabelas.
5. Depois, importe `api/catalogo-seed.sql` em codificação **UTF-8** para cadastrar no banco os artistas, álbuns, gêneros e faixas que já estavam no projeto.
6. Acesse o site pela URL `http://localhost/NOVASOUND/` (ou pelo nome da pasta usada em `htdocs`). Não abra `index.html` diretamente como `file:///...`.

`api/schema.sql` cria o banco `novasound` e as tabelas de usuários, catálogo e curtidas. `api/catalogo-seed.sql` cadastra os dados atuais do catálogo e migra curtidas antigas que coincidirem com as faixas. Os arquivos de áudio continuam em `audio/`; o banco guarda somente os caminhos. Os scripts usam operações que não apagam tabelas ou dados existentes.

## Banco local do XAMPP

`api/conexao.php` está configurado para o padrão local do XAMPP: servidor `127.0.0.1`, banco `novasound`, usuário `root` e senha vazia. Se sua instalação do MySQL usa outra senha, atualize `$senhaBanco` nesse arquivo.

## Funcionalidades incluídas

- Cadastro com nome, e-mail único e senha armazenada com `password_hash`.
- Login com sessão PHP e verificação segura por `password_verify`.
- Botões de curtir nas faixas da Discografia, disponíveis depois do login.
- Página **Curtidas**, que lista as faixas curtidas da conta e permite reproduzi-las.
- As músicas continuam como arquivos dentro de `audio/`; o banco guarda os caminhos e os metadados, não os arquivos de áudio.
- Página de administração para cadastrar artistas, álbuns, gêneros e faixas, com envio de capas e áudios.

## Ativar a administração do catálogo

1. Crie uma conta normal pelo site e entre nela.
2. No phpMyAdmin, abra o banco `novasound` e selecione a aba **SQL**.
3. Execute o comando abaixo trocando o e-mail pelo e-mail da sua conta:

   ```sql
   INSERT INTO administradores (usuario_id)
   SELECT id FROM usuarios WHERE email = 'seu-email@exemplo.com';
   ```

4. Abra **Minha conta** e escolha **Administração do catálogo**. A página também fica em `admin.php`.
5. Cadastre o artista antes do álbum e o álbum antes das faixas. Ao enviar uma faixa, o arquivo vai para `audio/catalogo/`; as capas enviadas vão para `capas/catalogo/`.

Para aceitar faixas grandes, abra o `php.ini` do Apache pelo botão **Config** do XAMPP, ajuste `upload_max_filesize` para `250M` e `post_max_size` para `260M`, salve e reinicie o Apache. O formulário limita cada arquivo de áudio a 200 MB.

Somente contas listadas na tabela `administradores` podem alterar o catálogo. Não compartilhe o acesso à conta administradora.

## Limites desta versão

- A lista Curtidas funciona como playlist automática das músicas curtidas; ainda não há criação de playlists personalizadas.
- Artistas, álbuns, gêneros e faixas são lidos do MySQL; para adicionar novos itens, inclua os dados nas tabelas correspondentes.
- O login é local ao XAMPP deste computador. Para publicar o site na internet, será preciso configurar hospedagem PHP/MySQL e trocar as credenciais locais.
