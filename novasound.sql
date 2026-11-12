-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 12/11/2026 às 21:54
-- Versão do servidor: 10.4.32-MariaDB
-- Versão do PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `novasound`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `administradores`
--

CREATE TABLE `administradores` (
  `usuario_id` int(10) UNSIGNED NOT NULL,
  `criado_em` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `administradores`
--

INSERT INTO `administradores` (`usuario_id`, `criado_em`) VALUES
(1, '2026-11-05 01:00:49');

-- --------------------------------------------------------

--
-- Estrutura para tabela `album_generos`
--

CREATE TABLE `album_generos` (
  `album_id` int(10) UNSIGNED NOT NULL,
  `genero_id` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `album_generos`
--

INSERT INTO `album_generos` (`album_id`, `genero_id`) VALUES
(1, 1),
(1, 2),
(2, 1),
(2, 2),
(3, 3),
(4, 1),
(5, 1);

-- --------------------------------------------------------

--
-- Estrutura para tabela `albuns`
--

CREATE TABLE `albuns` (
  `id` int(10) UNSIGNED NOT NULL,
  `artista_id` int(10) UNSIGNED NOT NULL,
  `nome` varchar(200) NOT NULL,
  `ano` smallint(5) UNSIGNED DEFAULT NULL,
  `capa` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `albuns`
--

INSERT INTO `albuns` (`id`, `artista_id`, `nome`, `ano`, `capa`) VALUES
(1, 1, 'MUSIC', 2025, 'https://upload.wikimedia.org/wikipedia/commons/7/7b/I_Am_Music_by_Playboi_Carti.jpg?utm_source=pt.wikipedia.org&utm_campaign=index&utm_content=original'),
(2, 2, '333', 2024, 'https://i.scdn.co/image/ab67616d0000b273996475bce560ead5737dbda1'),
(3, 3, 'Mágica', 2005, 'https://upload.wikimedia.org/wikipedia/pt/8/82/Calcinha_Preta_volume_12.jpg?utm_source=pt.wikipedia.org&utm_campaign=imageinfo&utm_content=thumbnail_unscaled'),
(4, 4, 'ISSO É TRAP VOL. 2', 2026, 'https://akamai.sscdn.co/uploadfile/letras/albuns/d/d/c/b/4805511776354759.jpg'),
(5, 5, 'Studio Addict', 2024, 'https://cdn-images.dzcdn.net/images/cover/e9df7d2346612c2a473a81a76f5e7fcd/0x1900-000000-80-0-0.jpg');

-- --------------------------------------------------------

--
-- Estrutura para tabela `artistas`
--

CREATE TABLE `artistas` (
  `id` int(10) UNSIGNED NOT NULL,
  `nome` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `artistas`
--

INSERT INTO `artistas` (`id`, `nome`) VALUES
(4, 'Brandão85'),
(3, 'Calcinha Preta'),
(2, 'Matuê'),
(5, 'Nine Vicious'),
(1, 'Playboi Carti');

-- --------------------------------------------------------

--
-- Estrutura para tabela `curtidas`
--

CREATE TABLE `curtidas` (
  `usuario_id` int(10) UNSIGNED NOT NULL,
  `musica_id` int(10) UNSIGNED NOT NULL,
  `criada_em` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `curtidas`
--

INSERT INTO `curtidas` (`usuario_id`, `musica_id`, `criada_em`) VALUES
(1, 1, '2026-11-04 17:22:14'),
(1, 2, '2026-11-04 17:05:20'),
(1, 5, '2026-11-04 17:22:15'),
(1, 6, '2026-11-04 17:52:55');

-- --------------------------------------------------------

--
-- Estrutura para tabela `curtidas_faixas`
--

CREATE TABLE `curtidas_faixas` (
  `usuario_id` int(10) UNSIGNED NOT NULL,
  `faixa_id` int(10) UNSIGNED NOT NULL,
  `criada_em` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `curtidas_faixas`
--

INSERT INTO `curtidas_faixas` (`usuario_id`, `faixa_id`, `criada_em`) VALUES
(1, 4, '2026-11-05 00:48:32'),
(1, 5, '2026-11-05 00:49:15'),
(1, 9, '2026-11-05 00:48:35'),
(1, 11, '2026-11-05 00:50:54'),
(1, 19, '2026-11-04 17:52:55');

-- --------------------------------------------------------

--
-- Estrutura para tabela `faixas`
--

CREATE TABLE `faixas` (
  `id` int(10) UNSIGNED NOT NULL,
  `album_id` int(10) UNSIGNED NOT NULL,
  `numero` smallint(5) UNSIGNED NOT NULL,
  `titulo` varchar(200) NOT NULL,
  `arquivo` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `faixas`
--

INSERT INTO `faixas` (`id`, `album_id`, `numero`, `titulo`, `arquivo`) VALUES
(1, 1, 1, 'POP OUT', 'audio/MUSIC/POP OUT.flac'),
(2, 2, 1, 'Crack com Mussilon', 'audio/333/Crack com Mussilon.mp3'),
(3, 3, 1, 'Mágica', 'audio/Mágica/Magica.flac'),
(4, 4, 1, 'BENÇA', 'audio/ISSO E TRAP 2/BENÇA.flac'),
(5, 4, 2, 'OK', 'audio/ISSO E TRAP 2/OK.flac'),
(6, 4, 3, 'PARIS', 'audio/ISSO E TRAP 2/PARIS.flac'),
(7, 4, 4, 'WARZONE', 'audio/ISSO E TRAP 2/WARZONE.flac'),
(8, 4, 5, 'BLUNT DE GOIABA', 'audio/ISSO E TRAP 2/BLUNT DE GOIABA.flac'),
(9, 4, 6, 'JAQUETA BAPE', 'audio/ISSO E TRAP 2/JAQUETA BAPE.flac'),
(10, 4, 7, 'MOOD', 'audio/ISSO E TRAP 2/MOOD.flac'),
(11, 4, 8, 'MILAGRE', 'audio/ISSO E TRAP 2/MILAGRE.flac'),
(12, 4, 9, 'FÓRMULAS & MIRAGENS', 'audio/ISSO E TRAP 2/FÓRMULAS & MIRAGENS.flac'),
(13, 4, 10, 'BUG NA MATRIX', 'audio/ISSO E TRAP 2/BUG NA MATRIX.flac'),
(14, 4, 11, 'JAPONÊS', 'audio/ISSO E TRAP 2/JAPONÊS.flac'),
(15, 4, 12, 'ROCKSTAR', 'audio/ISSO E TRAP 2/ROCKSTAR.flac'),
(16, 4, 13, 'DEPOIS DO SHOW', 'audio/ISSO E TRAP 2/DEPOIS DO SHOW.flac'),
(17, 4, 14, 'COMIGO MESMO', 'audio/ISSO E TRAP 2/COMIGO MESMO.flac'),
(18, 4, 15, 'CAPONGA', 'audio/ISSO E TRAP 2/CAPONGA.flac'),
(19, 5, 1, 'Studio Addict', 'audio/Studio Addict/studio addict.mp3'),
(20, 5, 2, 'Tokyo', 'audio/Studio Addict/Tokyo.flac'),
(21, 5, 3, 'F&N', 'audio/Studio Addict/F&N.flac'),
(22, 5, 4, 'The Truth', 'audio/Studio Addict/The Truth.mp3');

-- --------------------------------------------------------

--
-- Estrutura para tabela `generos`
--

CREATE TABLE `generos` (
  `id` int(10) UNSIGNED NOT NULL,
  `nome` varchar(80) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `generos`
--

INSERT INTO `generos` (`id`, `nome`) VALUES
(3, 'Forró'),
(2, 'Rap'),
(1, 'Trap');

-- --------------------------------------------------------

--
-- Estrutura para tabela `mensagens`
--

CREATE TABLE `mensagens` (
  `id` int(10) UNSIGNED NOT NULL,
  `usuario_id` int(10) UNSIGNED DEFAULT NULL,
  `nome` varchar(100) NOT NULL,
  `email` varchar(190) NOT NULL,
  `assunto` varchar(20) NOT NULL,
  `mensagem` text NOT NULL,
  `lida` tinyint(1) NOT NULL DEFAULT 0,
  `criada_em` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `musicas`
--

CREATE TABLE `musicas` (
  `id` int(10) UNSIGNED NOT NULL,
  `chave` char(64) NOT NULL,
  `titulo` varchar(200) NOT NULL,
  `artista` varchar(150) NOT NULL,
  `album` varchar(200) NOT NULL,
  `ano` smallint(5) UNSIGNED DEFAULT NULL,
  `capa` text DEFAULT NULL,
  `arquivo` varchar(500) NOT NULL,
  `criada_em` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `musicas`
--

INSERT INTO `musicas` (`id`, `chave`, `titulo`, `artista`, `album`, `ano`, `capa`, `arquivo`, `criada_em`) VALUES
(1, '8cb0ebb654c217958bf450ec99dbdf0f71b87fa15bd421c796b008cba0a4440d', 'BENÇA', 'Brandão85', 'ISSO É TRAP VOL. 2', 2026, 'https://akamai.sscdn.co/uploadfile/letras/albuns/d/d/c/b/4805511776354759.jpg', 'audio/ISSO E TRAP 2/BENÇA.flac', '2026-11-04 17:05:18'),
(2, '9430864bb41aaf24fcf63ce00ebb5c944085898ccf7b249b5ddf2fc632ad1ac1', 'OK', 'Brandão85', 'ISSO É TRAP VOL. 2', 2026, 'https://akamai.sscdn.co/uploadfile/letras/albuns/d/d/c/b/4805511776354759.jpg', 'audio/ISSO E TRAP 2/OK.flac', '2026-11-04 17:05:20'),
(5, 'e9c15f0d2f74cbf2738e4a4aa93fe4f11b22397f98a88e0a5b70c899cca8c66d', 'JAQUETA BAPE', 'Brandão85', 'ISSO É TRAP VOL. 2', 2026, 'https://akamai.sscdn.co/uploadfile/letras/albuns/d/d/c/b/4805511776354759.jpg', 'audio/ISSO E TRAP 2/JAQUETA BAPE.flac', '2026-11-04 17:22:15'),
(6, '34682389b752d7d4007b1f601fe3b4769a2bea2806e47c2412550c21a874705c', 'Studio Addict', 'Nine Vicious', 'Studio Addict', 2024, 'https://cdn-images.dzcdn.net/images/cover/e9df7d2346612c2a473a81a76f5e7fcd/0x1900-000000-80-0-0.jpg', 'audio/Studio Addict/studio addict.mp3', '2026-11-04 17:52:55');

-- --------------------------------------------------------

--
-- Estrutura para tabela `reproducoes`
--

CREATE TABLE `reproducoes` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `usuario_id` int(10) UNSIGNED NOT NULL,
  `faixa_id` int(10) UNSIGNED NOT NULL,
  `reproduzida_em` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `reproducoes`
--

INSERT INTO `reproducoes` (`id`, `usuario_id`, `faixa_id`, `reproduzida_em`) VALUES
(1, 1, 19, '2026-11-05 02:20:40'),
(2, 1, 20, '2026-11-05 02:21:20'),
(3, 1, 4, '2026-11-10 04:38:06'),
(4, 1, 5, '2026-11-10 04:40:30');

-- --------------------------------------------------------

--
-- Estrutura para tabela `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(10) UNSIGNED NOT NULL,
  `nome` varchar(100) NOT NULL,
  `email` varchar(190) NOT NULL,
  `senha_hash` varchar(255) NOT NULL,
  `criado_em` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `usuarios`
--

INSERT INTO `usuarios` (`id`, `nome`, `email`, `senha_hash`, `criado_em`) VALUES
(1, 'Nicolas', 'nicolasgodenot@gmail.com', '$2y$10$6J0g8Mbd58PP3LEAnaPPQuDTLL2HA4MBvPz5W0yXdu8M/b4GecgPS', '2026-11-04 17:05:04');

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `administradores`
--
ALTER TABLE `administradores`
  ADD PRIMARY KEY (`usuario_id`);

--
-- Índices de tabela `album_generos`
--
ALTER TABLE `album_generos`
  ADD PRIMARY KEY (`album_id`,`genero_id`),
  ADD KEY `fk_album_generos_genero` (`genero_id`);

--
-- Índices de tabela `albuns`
--
ALTER TABLE `albuns`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_album_artista_nome` (`artista_id`,`nome`);

--
-- Índices de tabela `artistas`
--
ALTER TABLE `artistas`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nome` (`nome`);

--
-- Índices de tabela `curtidas`
--
ALTER TABLE `curtidas`
  ADD PRIMARY KEY (`usuario_id`,`musica_id`),
  ADD KEY `fk_curtidas_musica` (`musica_id`);

--
-- Índices de tabela `curtidas_faixas`
--
ALTER TABLE `curtidas_faixas`
  ADD PRIMARY KEY (`usuario_id`,`faixa_id`),
  ADD KEY `fk_curtidas_faixas_faixa` (`faixa_id`);

--
-- Índices de tabela `faixas`
--
ALTER TABLE `faixas`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_faixa_album_numero` (`album_id`,`numero`),
  ADD UNIQUE KEY `uq_faixa_album_titulo` (`album_id`,`titulo`);

--
-- Índices de tabela `generos`
--
ALTER TABLE `generos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nome` (`nome`);

--
-- Índices de tabela `mensagens`
--
ALTER TABLE `mensagens`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_mensagens_criada` (`criada_em`),
  ADD KEY `fk_mensagens_usuario` (`usuario_id`);

--
-- Índices de tabela `musicas`
--
ALTER TABLE `musicas`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `chave` (`chave`);

--
-- Índices de tabela `reproducoes`
--
ALTER TABLE `reproducoes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_reproducoes_faixa` (`faixa_id`),
  ADD KEY `idx_reproducoes_usuario` (`usuario_id`);

--
-- Índices de tabela `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `albuns`
--
ALTER TABLE `albuns`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de tabela `artistas`
--
ALTER TABLE `artistas`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de tabela `faixas`
--
ALTER TABLE `faixas`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT de tabela `generos`
--
ALTER TABLE `generos`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de tabela `mensagens`
--
ALTER TABLE `mensagens`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `musicas`
--
ALTER TABLE `musicas`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de tabela `reproducoes`
--
ALTER TABLE `reproducoes`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de tabela `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Restrições para tabelas despejadas
--

--
-- Restrições para tabelas `administradores`
--
ALTER TABLE `administradores`
  ADD CONSTRAINT `fk_administradores_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE;

--
-- Restrições para tabelas `album_generos`
--
ALTER TABLE `album_generos`
  ADD CONSTRAINT `fk_album_generos_album` FOREIGN KEY (`album_id`) REFERENCES `albuns` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_album_generos_genero` FOREIGN KEY (`genero_id`) REFERENCES `generos` (`id`) ON DELETE CASCADE;

--
-- Restrições para tabelas `albuns`
--
ALTER TABLE `albuns`
  ADD CONSTRAINT `fk_album_artista` FOREIGN KEY (`artista_id`) REFERENCES `artistas` (`id`) ON DELETE CASCADE;

--
-- Restrições para tabelas `curtidas`
--
ALTER TABLE `curtidas`
  ADD CONSTRAINT `fk_curtidas_musica` FOREIGN KEY (`musica_id`) REFERENCES `musicas` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_curtidas_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE;

--
-- Restrições para tabelas `curtidas_faixas`
--
ALTER TABLE `curtidas_faixas`
  ADD CONSTRAINT `fk_curtidas_faixas_faixa` FOREIGN KEY (`faixa_id`) REFERENCES `faixas` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_curtidas_faixas_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE;

--
-- Restrições para tabelas `faixas`
--
ALTER TABLE `faixas`
  ADD CONSTRAINT `fk_faixa_album` FOREIGN KEY (`album_id`) REFERENCES `albuns` (`id`) ON DELETE CASCADE;

--
-- Restrições para tabelas `mensagens`
--
ALTER TABLE `mensagens`
  ADD CONSTRAINT `fk_mensagens_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL;

--
-- Restrições para tabelas `reproducoes`
--
ALTER TABLE `reproducoes`
  ADD CONSTRAINT `fk_reproducoes_faixa` FOREIGN KEY (`faixa_id`) REFERENCES `faixas` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_reproducoes_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
