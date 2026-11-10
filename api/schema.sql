CREATE DATABASE IF NOT EXISTS novasound
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE novasound;

CREATE TABLE IF NOT EXISTS usuarios (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(190) NOT NULL UNIQUE,
    senha_hash VARCHAR(255) NOT NULL,
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS administradores (
    usuario_id INT UNSIGNED PRIMARY KEY,
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_administradores_usuario FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS musicas (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    chave CHAR(64) NOT NULL UNIQUE,
    titulo VARCHAR(200) NOT NULL,
    artista VARCHAR(150) NOT NULL,
    album VARCHAR(200) NOT NULL,
    ano SMALLINT UNSIGNED NULL,
    capa TEXT NULL,
    arquivo VARCHAR(500) NOT NULL,
    criada_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS curtidas (
    usuario_id INT UNSIGNED NOT NULL,
    musica_id INT UNSIGNED NOT NULL,
    criada_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (usuario_id, musica_id),
    CONSTRAINT fk_curtidas_usuario FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id) ON DELETE CASCADE,
    CONSTRAINT fk_curtidas_musica FOREIGN KEY (musica_id)
        REFERENCES musicas(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS artistas (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS albuns (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    artista_id INT UNSIGNED NOT NULL,
    nome VARCHAR(200) NOT NULL,
    ano SMALLINT UNSIGNED NULL,
    capa TEXT NULL,
    UNIQUE KEY uq_album_artista_nome (artista_id, nome),
    CONSTRAINT fk_album_artista FOREIGN KEY (artista_id)
        REFERENCES artistas(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS generos (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(80) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS album_generos (
    album_id INT UNSIGNED NOT NULL,
    genero_id INT UNSIGNED NOT NULL,
    PRIMARY KEY (album_id, genero_id),
    CONSTRAINT fk_album_generos_album FOREIGN KEY (album_id)
        REFERENCES albuns(id) ON DELETE CASCADE,
    CONSTRAINT fk_album_generos_genero FOREIGN KEY (genero_id)
        REFERENCES generos(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS faixas (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    album_id INT UNSIGNED NOT NULL,
    numero SMALLINT UNSIGNED NOT NULL,
    titulo VARCHAR(200) NOT NULL,
    arquivo VARCHAR(500) NOT NULL,
    UNIQUE KEY uq_faixa_album_numero (album_id, numero),
    UNIQUE KEY uq_faixa_album_titulo (album_id, titulo),
    CONSTRAINT fk_faixa_album FOREIGN KEY (album_id)
        REFERENCES albuns(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS curtidas_faixas (
    usuario_id INT UNSIGNED NOT NULL,
    faixa_id INT UNSIGNED NOT NULL,
    criada_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (usuario_id, faixa_id),
    CONSTRAINT fk_curtidas_faixas_usuario FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id) ON DELETE CASCADE,
    CONSTRAINT fk_curtidas_faixas_faixa FOREIGN KEY (faixa_id)
        REFERENCES faixas(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS reproducoes (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT UNSIGNED NOT NULL,
    faixa_id INT UNSIGNED NOT NULL,
    reproduzida_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    KEY idx_reproducoes_faixa (faixa_id),
    KEY idx_reproducoes_usuario (usuario_id),
    CONSTRAINT fk_reproducoes_usuario FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id) ON DELETE CASCADE,
    CONSTRAINT fk_reproducoes_faixa FOREIGN KEY (faixa_id)
        REFERENCES faixas(id) ON DELETE CASCADE
);
