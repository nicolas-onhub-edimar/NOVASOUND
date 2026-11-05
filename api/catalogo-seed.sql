SET NAMES utf8mb4;
USE novasound;

INSERT INTO artistas (nome) VALUES
    ('Playboi Carti'), ('Matuê'), ('Calcinha Preta'), ('Brandão85'), ('Nine Vicious')
ON DUPLICATE KEY UPDATE nome = VALUES(nome);

INSERT INTO generos (nome) VALUES ('Trap'), ('Rap'), ('Forró')
ON DUPLICATE KEY UPDATE nome = VALUES(nome);

-- Corrige importações antigas feitas com a página de códigos do Windows.
UPDATE generos
SET nome = CONVERT(UNHEX('466F7272C3B3') USING utf8mb4)
WHERE HEX(nome) = '466F7272E2949CE29482';

INSERT INTO albuns (artista_id, nome, ano, capa)
SELECT id, 'MUSIC', 2025, 'https://upload.wikimedia.org/wikipedia/commons/7/7b/I_Am_Music_by_Playboi_Carti.jpg?utm_source=pt.wikipedia.org&utm_campaign=index&utm_content=original'
FROM artistas WHERE nome = 'Playboi Carti'
ON DUPLICATE KEY UPDATE ano = VALUES(ano), capa = VALUES(capa);

INSERT INTO albuns (artista_id, nome, ano, capa)
SELECT id, '333', 2024, 'https://i.scdn.co/image/ab67616d0000b273996475bce560ead5737dbda1'
FROM artistas WHERE nome = 'Matuê'
ON DUPLICATE KEY UPDATE ano = VALUES(ano), capa = VALUES(capa);

INSERT INTO albuns (artista_id, nome, ano, capa)
SELECT id, 'Mágica', 2005, 'https://upload.wikimedia.org/wikipedia/pt/8/82/Calcinha_Preta_volume_12.jpg?utm_source=pt.wikipedia.org&utm_campaign=imageinfo&utm_content=thumbnail_unscaled'
FROM artistas WHERE nome = 'Calcinha Preta'
ON DUPLICATE KEY UPDATE ano = VALUES(ano), capa = VALUES(capa);

INSERT INTO albuns (artista_id, nome, ano, capa)
SELECT id, 'ISSO É TRAP VOL. 2', 2026, 'https://akamai.sscdn.co/uploadfile/letras/albuns/d/d/c/b/4805511776354759.jpg'
FROM artistas WHERE nome = 'Brandão85'
ON DUPLICATE KEY UPDATE ano = VALUES(ano), capa = VALUES(capa);

INSERT INTO albuns (artista_id, nome, ano, capa)
SELECT id, 'Studio Addict', 2024, 'https://cdn-images.dzcdn.net/images/cover/e9df7d2346612c2a473a81a76f5e7fcd/0x1900-000000-80-0-0.jpg'
FROM artistas WHERE nome = 'Nine Vicious'
ON DUPLICATE KEY UPDATE ano = VALUES(ano), capa = VALUES(capa);

INSERT IGNORE INTO album_generos (album_id, genero_id)
SELECT a.id, g.id FROM albuns a JOIN artistas ar ON ar.id = a.artista_id JOIN generos g ON g.nome IN ('Trap', 'Rap')
WHERE ar.nome = 'Playboi Carti' AND a.nome = 'MUSIC';
INSERT IGNORE INTO album_generos (album_id, genero_id)
SELECT a.id, g.id FROM albuns a JOIN artistas ar ON ar.id = a.artista_id JOIN generos g ON g.nome IN ('Trap', 'Rap')
WHERE ar.nome = 'Matuê' AND a.nome = '333';
INSERT IGNORE INTO album_generos (album_id, genero_id)
SELECT a.id, g.id FROM albuns a JOIN artistas ar ON ar.id = a.artista_id JOIN generos g ON g.nome = 'Forró'
WHERE ar.nome = 'Calcinha Preta' AND a.nome = 'Mágica';
INSERT IGNORE INTO album_generos (album_id, genero_id)
SELECT a.id, g.id FROM albuns a JOIN artistas ar ON ar.id = a.artista_id JOIN generos g ON g.nome = 'Trap'
WHERE ar.nome = 'Brandão85' AND a.nome = 'ISSO É TRAP VOL. 2';
INSERT IGNORE INTO album_generos (album_id, genero_id)
SELECT a.id, g.id FROM albuns a JOIN artistas ar ON ar.id = a.artista_id JOIN generos g ON g.nome = 'Trap'
WHERE ar.nome = 'Nine Vicious' AND a.nome = 'Studio Addict';

INSERT INTO faixas (album_id, numero, titulo, arquivo)
SELECT a.id, t.numero, t.titulo, t.arquivo
FROM albuns a JOIN artistas ar ON ar.id = a.artista_id
JOIN (
    SELECT 1 AS numero, 'POP OUT' AS titulo, 'audio/MUSIC/POP OUT.flac' AS arquivo
) t
WHERE ar.nome = 'Playboi Carti' AND a.nome = 'MUSIC'
ON DUPLICATE KEY UPDATE titulo = VALUES(titulo), arquivo = VALUES(arquivo);

INSERT INTO faixas (album_id, numero, titulo, arquivo)
SELECT a.id, t.numero, t.titulo, t.arquivo
FROM albuns a JOIN artistas ar ON ar.id = a.artista_id
JOIN (
    SELECT 1 AS numero, 'Crack com Mussilon' AS titulo, 'audio/333/Crack com Mussilon.mp3' AS arquivo
) t
WHERE ar.nome = 'Matuê' AND a.nome = '333'
ON DUPLICATE KEY UPDATE titulo = VALUES(titulo), arquivo = VALUES(arquivo);

INSERT INTO faixas (album_id, numero, titulo, arquivo)
SELECT a.id, t.numero, t.titulo, t.arquivo
FROM albuns a JOIN artistas ar ON ar.id = a.artista_id
JOIN (
    SELECT 1 AS numero, 'Mágica' AS titulo, 'audio/Mágica/Magica.flac' AS arquivo
) t
WHERE ar.nome = 'Calcinha Preta' AND a.nome = 'Mágica'
ON DUPLICATE KEY UPDATE titulo = VALUES(titulo), arquivo = VALUES(arquivo);

INSERT INTO faixas (album_id, numero, titulo, arquivo)
SELECT a.id, t.numero, t.titulo, t.arquivo
FROM albuns a JOIN artistas ar ON ar.id = a.artista_id
JOIN (
    SELECT 1 AS numero, 'BENÇA' AS titulo, 'audio/ISSO E TRAP 2/BENÇA.flac' AS arquivo UNION ALL
    SELECT 2, 'OK', 'audio/ISSO E TRAP 2/OK.flac' UNION ALL
    SELECT 3, 'PARIS', 'audio/ISSO E TRAP 2/PARIS.flac' UNION ALL
    SELECT 4, 'WARZONE', 'audio/ISSO E TRAP 2/WARZONE.flac' UNION ALL
    SELECT 5, 'BLUNT DE GOIABA', 'audio/ISSO E TRAP 2/BLUNT DE GOIABA.flac' UNION ALL
    SELECT 6, 'JAQUETA BAPE', 'audio/ISSO E TRAP 2/JAQUETA BAPE.flac' UNION ALL
    SELECT 7, 'MOOD', 'audio/ISSO E TRAP 2/MOOD.flac' UNION ALL
    SELECT 8, 'MILAGRE', 'audio/ISSO E TRAP 2/MILAGRE.flac' UNION ALL
    SELECT 9, 'FÓRMULAS & MIRAGENS', 'audio/ISSO E TRAP 2/FÓRMULAS & MIRAGENS.flac' UNION ALL
    SELECT 10, 'BUG NA MATRIX', 'audio/ISSO E TRAP 2/BUG NA MATRIX.flac' UNION ALL
    SELECT 11, 'JAPONÊS', 'audio/ISSO E TRAP 2/JAPONÊS.flac' UNION ALL
    SELECT 12, 'ROCKSTAR', 'audio/ISSO E TRAP 2/ROCKSTAR.flac' UNION ALL
    SELECT 13, 'DEPOIS DO SHOW', 'audio/ISSO E TRAP 2/DEPOIS DO SHOW.flac' UNION ALL
    SELECT 14, 'COMIGO MESMO', 'audio/ISSO E TRAP 2/COMIGO MESMO.flac' UNION ALL
    SELECT 15, 'CAPONGA', 'audio/ISSO E TRAP 2/CAPONGA.flac'
) t
WHERE ar.nome = 'Brandão85' AND a.nome = 'ISSO É TRAP VOL. 2'
ON DUPLICATE KEY UPDATE titulo = VALUES(titulo), arquivo = VALUES(arquivo);

INSERT INTO faixas (album_id, numero, titulo, arquivo)
SELECT a.id, t.numero, t.titulo, t.arquivo
FROM albuns a JOIN artistas ar ON ar.id = a.artista_id
JOIN (
    SELECT 1 AS numero, 'Studio Addict' AS titulo, 'audio/Studio Addict/studio addict.mp3' AS arquivo UNION ALL
    SELECT 2, 'Tokyo', 'audio/Studio Addict/Tokyo.flac' UNION ALL
    SELECT 3, 'F&N', 'audio/Studio Addict/F&N.flac' UNION ALL
    SELECT 4, 'The Truth', 'audio/Studio Addict/The Truth.mp3'
) t
WHERE ar.nome = 'Nine Vicious' AND a.nome = 'Studio Addict'
ON DUPLICATE KEY UPDATE titulo = VALUES(titulo), arquivo = VALUES(arquivo);

INSERT IGNORE INTO curtidas_faixas (usuario_id, faixa_id, criada_em)
SELECT c.usuario_id, f.id, c.criada_em
FROM curtidas c
JOIN musicas m ON m.id = c.musica_id
JOIN artistas ar ON ar.nome = m.artista
JOIN albuns a ON a.artista_id = ar.id AND a.nome = m.album
JOIN faixas f ON f.album_id = a.id AND f.titulo = m.titulo;

-- Mantém os caminhos de áudio com UTF-8 correto mesmo após importações antigas.
UPDATE faixas SET arquivo = CONVERT(UNHEX('617564696F2F4DC3A1676963612F4D61676963612E666C6163') USING utf8mb4) WHERE HEX(titulo) = '4DC3A167696361';
UPDATE faixas SET arquivo = CONVERT(UNHEX('617564696F2F4953534F2045205452415020322F42454EC387412E666C6163') USING utf8mb4) WHERE HEX(titulo) = '42454EC38741';
UPDATE faixas SET arquivo = CONVERT(UNHEX('617564696F2F4953534F2045205452415020322F46C393524D554C41532026204D49524147454E532E666C6163') USING utf8mb4) WHERE HEX(titulo) = '46C393524D554C41532026204D49524147454E53';
UPDATE faixas SET arquivo = CONVERT(UNHEX('617564696F2F4953534F2045205452415020322F4A41504F4EC38A532E666C6163') USING utf8mb4) WHERE HEX(titulo) = '4A41504F4EC38A53';
