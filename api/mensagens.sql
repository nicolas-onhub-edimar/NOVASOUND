USE novasound;

CREATE TABLE IF NOT EXISTS mensagens (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT UNSIGNED NULL,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(190) NOT NULL,
    assunto VARCHAR(20) NOT NULL,
    mensagem TEXT NOT NULL,
    lida TINYINT(1) NOT NULL DEFAULT 0,
    criada_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    KEY idx_mensagens_criada (criada_em),
    CONSTRAINT fk_mensagens_usuario FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id) ON DELETE SET NULL
);
